import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all customers
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db
      .query("customers")
      .order("desc")
      .collect();
  },
});

// Get customer by ID
export const getById = query({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.get(args.customerId);
  },
});

// Create new customer
export const create = mutation({
  args: {
    companyName: v.string(),
    contactName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    industry: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("customers", {
      ...args,
      createdBy: userId,
    });
  },
});

// Update customer
export const update = mutation({
  args: {
    customerId: v.id("customers"),
    companyName: v.string(),
    contactName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    industry: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { customerId, ...updates } = args;
    return await ctx.db.patch(customerId, updates);
  },
});

// Search customers
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const customers = await ctx.db.query("customers").collect();
    
    if (!args.searchTerm) return customers;

    const searchLower = args.searchTerm.toLowerCase();
    return customers.filter(customer => 
      customer.companyName.toLowerCase().includes(searchLower) ||
      customer.contactName.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower)
    );
  },
});
