import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Generate quote number
function generateQuoteNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `QT-${year}${month}${day}-${random}`;
}

// Calculate quote totals
function calculateTotals(items: any[], taxRate: number) {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
    return sum + itemTotal;
  }, 0);
  
  const taxAmount = subtotal * (taxRate / 100);
  const totalAmount = subtotal + taxAmount;
  
  return { subtotal, taxAmount, totalAmount };
}

// Get all quotes
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const quotes = await ctx.db
      .query("quotes")
      .order("desc")
      .collect();

    // Get customer info for each quote
    const quotesWithCustomers = await Promise.all(
      quotes.map(async (quote) => {
        const customer = await ctx.db.get(quote.customerId);
        return {
          ...quote,
          customer,
        };
      })
    );

    return quotesWithCustomers;
  },
});

// Get quote by ID
export const getById = query({
  args: { quoteId: v.id("quotes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const quote = await ctx.db.get(args.quoteId);
    if (!quote) return null;

    const customer = await ctx.db.get(quote.customerId);
    const creator = await ctx.db.get(quote.createdBy);

    return {
      ...quote,
      customer,
      creator,
    };
  },
});

// Create new quote
export const create = mutation({
  args: {
    customerId: v.id("customers"),
    title: v.string(),
    items: v.array(v.object({
      productId: v.optional(v.id("products")),
      name: v.string(),
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      discount: v.number(),
    })),
    taxRate: v.number(),
    validityDays: v.number(),
    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Calculate item totals
    const itemsWithTotals = args.items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice * (1 - item.discount / 100),
    }));

    // Calculate quote totals
    const { subtotal, taxAmount, totalAmount } = calculateTotals(itemsWithTotals, args.taxRate);

    // Set validity date
    const validUntil = Date.now() + (args.validityDays * 24 * 60 * 60 * 1000);

    const quoteId = await ctx.db.insert("quotes", {
      quoteNumber: generateQuoteNumber(),
      customerId: args.customerId,
      title: args.title,
      status: "draft",
      items: itemsWithTotals,
      subtotal,
      taxRate: args.taxRate,
      taxAmount,
      totalAmount,
      validUntil,
      terms: args.terms,
      notes: args.notes,
      version: 1,
      createdBy: userId,
    });

    // Log activity
    await ctx.db.insert("quoteActivities", {
      quoteId,
      action: "created",
      description: "Quote created",
      performedBy: userId,
    });

    return quoteId;
  },
});

// Update quote
export const update = mutation({
  args: {
    quoteId: v.id("quotes"),
    title: v.string(),
    items: v.array(v.object({
      productId: v.optional(v.id("products")),
      name: v.string(),
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      discount: v.number(),
    })),
    taxRate: v.number(),
    validityDays: v.number(),
    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { quoteId, ...updates } = args;

    // Calculate item totals
    const itemsWithTotals = updates.items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice * (1 - item.discount / 100),
    }));

    // Calculate quote totals
    const { subtotal, taxAmount, totalAmount } = calculateTotals(itemsWithTotals, updates.taxRate);

    // Set validity date
    const validUntil = Date.now() + (updates.validityDays * 24 * 60 * 60 * 1000);

    await ctx.db.patch(quoteId, {
      ...updates,
      items: itemsWithTotals,
      subtotal,
      taxAmount,
      totalAmount,
      validUntil,
    });

    // Log activity
    await ctx.db.insert("quoteActivities", {
      quoteId,
      action: "updated",
      description: "Quote updated",
      performedBy: userId,
    });

    return quoteId;
  },
});

// Update quote status
export const updateStatus = mutation({
  args: {
    quoteId: v.id("quotes"),
    status: v.union(
      v.literal("draft"),
      v.literal("pending_approval"),
      v.literal("sent"),
      v.literal("under_review"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("converted"),
      v.literal("expired")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const quote = await ctx.db.get(args.quoteId);
    if (!quote) throw new Error("Quote not found");

    const oldStatus = quote.status;
    const updates: any = { status: args.status };

    // Set timestamps for specific status changes
    if (args.status === "sent" && oldStatus !== "sent") {
      updates.sentAt = Date.now();
    }
    if (args.status === "approved" && oldStatus !== "approved") {
      updates.approvedBy = userId;
      updates.approvedAt = Date.now();
    }

    await ctx.db.patch(args.quoteId, updates);

    // Log activity
    await ctx.db.insert("quoteActivities", {
      quoteId: args.quoteId,
      action: "status_changed",
      description: `Status changed from ${oldStatus} to ${args.status}`,
      performedBy: userId,
      metadata: {
        oldStatus,
        newStatus: args.status,
      },
    });

    return args.quoteId;
  },
});

// Get quote activities
export const getActivities = query({
  args: { quoteId: v.id("quotes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const activities = await ctx.db
      .query("quoteActivities")
      .withIndex("by_quote", (q) => q.eq("quoteId", args.quoteId))
      .order("desc")
      .collect();

    // Get user info for each activity
    const activitiesWithUsers = await Promise.all(
      activities.map(async (activity) => {
        const user = await ctx.db.get(activity.performedBy);
        return {
          ...activity,
          user,
        };
      })
    );

    return activitiesWithUsers;
  },
});

// Get quotes by status
export const getByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const quotes = await ctx.db
      .query("quotes")
      .withIndex("by_status", (q) => q.eq("status", args.status as any))
      .order("desc")
      .collect();

    // Get customer info for each quote
    const quotesWithCustomers = await Promise.all(
      quotes.map(async (quote) => {
        const customer = await ctx.db.get(quote.customerId);
        return {
          ...quote,
          customer,
        };
      })
    );

    return quotesWithCustomers;
  },
});

// Get dashboard stats
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const quotes = await ctx.db.query("quotes").collect();
    
    const stats = {
      total: quotes.length,
      draft: quotes.filter(q => q.status === "draft").length,
      sent: quotes.filter(q => q.status === "sent").length,
      approved: quotes.filter(q => q.status === "approved").length,
      converted: quotes.filter(q => q.status === "converted").length,
      totalValue: quotes.reduce((sum, q) => sum + q.totalAmount, 0),
      convertedValue: quotes
        .filter(q => q.status === "converted")
        .reduce((sum, q) => sum + q.totalAmount, 0),
    };

    return stats;
  },
});
