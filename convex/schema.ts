import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Customer management
  customers: defineTable({
    companyName: v.string(),
    contactName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    industry: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdBy: v.id("users"),
  })
    .index("by_company", ["companyName"])
    .index("by_email", ["email"])
    .index("by_created_by", ["createdBy"]),

  // Product/Service catalog
  products: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.string(),
    subcategory: v.optional(v.string()),
    basePrice: v.number(),
    unit: v.string(), // "hour", "piece", "license", etc.
    isActive: v.boolean(),
    specifications: v.optional(v.string()),
    createdBy: v.id("users"),
  })
    .index("by_category", ["category"])
    .index("by_subcategory", ["subcategory"])
    .index("by_active", ["isActive"])
    .index("by_created_by", ["createdBy"]),

  // Quote templates
  quoteTemplates: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    items: v.array(v.object({
      productId: v.id("products"),
      quantity: v.number(),
      unitPrice: v.number(),
      discount: v.number(), // percentage
    })),
    validityDays: v.number(),
    terms: v.optional(v.string()),
    createdBy: v.id("users"),
  }).index("by_created_by", ["createdBy"]),

  // Main quotes table
  quotes: defineTable({
    quoteNumber: v.string(),
    customerId: v.id("customers"),
    title: v.string(),
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
    items: v.array(v.object({
      productId: v.optional(v.id("products")),
      name: v.string(),
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      discount: v.number(), // percentage
      total: v.number(),
    })),
    subtotal: v.number(),
    taxRate: v.number(), // percentage
    taxAmount: v.number(),
    totalAmount: v.number(),
    validUntil: v.number(), // timestamp
    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
    version: v.number(),
    parentQuoteId: v.optional(v.id("quotes")), // for revisions
    createdBy: v.id("users"),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
    sentAt: v.optional(v.number()),
  })
    .index("by_quote_number", ["quoteNumber"])
    .index("by_customer", ["customerId"])
    .index("by_status", ["status"])
    .index("by_created_by", ["createdBy"])
    .index("by_valid_until", ["validUntil"]),

  // Quote activities/history
  quoteActivities: defineTable({
    quoteId: v.id("quotes"),
    action: v.string(), // "created", "updated", "sent", "approved", etc.
    description: v.string(),
    performedBy: v.id("users"),
    metadata: v.optional(v.object({
      oldStatus: v.optional(v.string()),
      newStatus: v.optional(v.string()),
      changes: v.optional(v.array(v.string())),
    })),
  })
    .index("by_quote", ["quoteId"])
    .index("by_performed_by", ["performedBy"]),

  // Company settings
  companySettings: defineTable({
    companyName: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    website: v.optional(v.string()),
    taxId: v.optional(v.string()),
    defaultTaxRate: v.number(),
    defaultValidityDays: v.number(),
    defaultTerms: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    updatedBy: v.id("users"),
  }).index("by_updated_by", ["updatedBy"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
