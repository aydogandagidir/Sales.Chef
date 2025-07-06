import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all active products
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db
      .query("products")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("desc")
      .collect();
  },
});

// Get products by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Get all categories
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const products = await ctx.db
      .query("products")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    const categories = [...new Set(products.map(p => p.category))];
    return categories.sort();
  },
});

// Create new product
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.string(),
    basePrice: v.number(),
    unit: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("products", {
      ...args,
      isActive: true,
      createdBy: userId,
    });
  },
});

// Update product
export const update = mutation({
  args: {
    productId: v.id("products"),
    name: v.string(),
    description: v.string(),
    category: v.string(),
    basePrice: v.number(),
    unit: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { productId, ...updates } = args;
    return await ctx.db.patch(productId, updates);
  },
});

// Search products
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const products = await ctx.db
      .query("products")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    
    if (!args.searchTerm) return products;

    const searchLower = args.searchTerm.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  },
});
