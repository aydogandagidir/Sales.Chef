import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Sales Performance Report
export const getSalesPerformance = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    period: v.optional(v.string()), // "week", "month", "quarter", "year"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const quotes = await ctx.db.query("quotes").collect();
    
    // Filter by date range if provided
    let filteredQuotes = quotes;
    if (args.startDate && args.endDate) {
      filteredQuotes = quotes.filter(q => 
        q._creationTime >= args.startDate! && q._creationTime <= args.endDate!
      );
    }

    // Group by time period
    const groupedData = new Map();
    const now = Date.now();
    
    filteredQuotes.forEach(quote => {
      let periodKey: string;
      const date = new Date(quote._creationTime);
      
      switch (args.period) {
        case "week":
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          periodKey = weekStart.toISOString().split('T')[0];
          break;
        case "month":
          periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case "quarter":
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          periodKey = `${date.getFullYear()}-Q${quarter}`;
          break;
        case "year":
          periodKey = date.getFullYear().toString();
          break;
        default:
          periodKey = date.toISOString().split('T')[0];
      }

      if (!groupedData.has(periodKey)) {
        groupedData.set(periodKey, {
          period: periodKey,
          totalQuotes: 0,
          totalValue: 0,
          convertedQuotes: 0,
          convertedValue: 0,
          avgQuoteValue: 0,
          conversionRate: 0,
        });
      }

      const data = groupedData.get(periodKey);
      data.totalQuotes++;
      data.totalValue += quote.totalAmount;
      
      if (quote.status === "converted") {
        data.convertedQuotes++;
        data.convertedValue += quote.totalAmount;
      }
    });

    // Calculate averages and rates
    const results = Array.from(groupedData.values()).map(data => ({
      ...data,
      avgQuoteValue: data.totalQuotes > 0 ? data.totalValue / data.totalQuotes : 0,
      conversionRate: data.totalQuotes > 0 ? (data.convertedQuotes / data.totalQuotes) * 100 : 0,
    }));

    return results.sort((a, b) => a.period.localeCompare(b.period));
  },
});

// Customer Analysis Report
export const getCustomerAnalysis = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const customers = await ctx.db.query("customers").collect();
    const quotes = await ctx.db.query("quotes").collect();

    const customerStats = customers.map(customer => {
      const customerQuotes = quotes.filter(q => q.customerId === customer._id);
      const totalValue = customerQuotes.reduce((sum, q) => sum + q.totalAmount, 0);
      const convertedQuotes = customerQuotes.filter(q => q.status === "converted");
      const convertedValue = convertedQuotes.reduce((sum, q) => sum + q.totalAmount, 0);

      return {
        customer,
        totalQuotes: customerQuotes.length,
        totalValue,
        convertedQuotes: convertedQuotes.length,
        convertedValue,
        conversionRate: customerQuotes.length > 0 ? (convertedQuotes.length / customerQuotes.length) * 100 : 0,
        avgQuoteValue: customerQuotes.length > 0 ? totalValue / customerQuotes.length : 0,
        lastQuoteDate: customerQuotes.length > 0 ? Math.max(...customerQuotes.map(q => q._creationTime)) : null,
      };
    });

    return customerStats.sort((a, b) => b.totalValue - a.totalValue);
  },
});

// Product Performance Report
export const getProductPerformance = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const products = await ctx.db.query("products").collect();
    const quotes = await ctx.db.query("quotes").collect();

    const productStats = new Map();

    // Initialize product stats
    products.forEach(product => {
      productStats.set(product._id, {
        product,
        timesQuoted: 0,
        totalQuantity: 0,
        totalValue: 0,
        convertedQuantity: 0,
        convertedValue: 0,
        avgPrice: product.basePrice,
        conversionRate: 0,
      });
    });

    // Analyze quote items
    quotes.forEach(quote => {
      quote.items.forEach(item => {
        if (item.productId && productStats.has(item.productId)) {
          const stats = productStats.get(item.productId);
          stats.timesQuoted++;
          stats.totalQuantity += item.quantity;
          stats.totalValue += item.total;

          if (quote.status === "converted") {
            stats.convertedQuantity += item.quantity;
            stats.convertedValue += item.total;
          }
        }
      });
    });

    // Calculate rates and averages
    const results = Array.from(productStats.values()).map(stats => ({
      ...stats,
      conversionRate: stats.timesQuoted > 0 ? (stats.convertedQuantity / stats.totalQuantity) * 100 : 0,
      avgPrice: stats.totalQuantity > 0 ? stats.totalValue / stats.totalQuantity : stats.product.basePrice,
    }));

    return results.sort((a, b) => b.totalValue - a.totalValue);
  },
});

// Quote Status Pipeline Report
export const getQuotePipeline = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const quotes = await ctx.db.query("quotes").collect();
    const customers = await ctx.db.query("customers").collect();

    const pipeline = {
      draft: { count: 0, value: 0, quotes: [] as any[] },
      pending_approval: { count: 0, value: 0, quotes: [] as any[] },
      sent: { count: 0, value: 0, quotes: [] as any[] },
      under_review: { count: 0, value: 0, quotes: [] as any[] },
      approved: { count: 0, value: 0, quotes: [] as any[] },
      rejected: { count: 0, value: 0, quotes: [] as any[] },
      converted: { count: 0, value: 0, quotes: [] as any[] },
      expired: { count: 0, value: 0, quotes: [] as any[] },
    };

    for (const quote of quotes) {
      const customer = customers.find(c => c._id === quote.customerId);
      const quoteWithCustomer = { ...quote, customer };

      if (pipeline[quote.status as keyof typeof pipeline]) {
        pipeline[quote.status as keyof typeof pipeline].count++;
        pipeline[quote.status as keyof typeof pipeline].value += quote.totalAmount;
        pipeline[quote.status as keyof typeof pipeline].quotes.push(quoteWithCustomer);
      }
    }

    return pipeline;
  },
});

// Industry Analysis Report
export const getIndustryAnalysis = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const customers = await ctx.db.query("customers").collect();
    const quotes = await ctx.db.query("quotes").collect();

    const industryStats = new Map();

    customers.forEach(customer => {
      const industry = customer.industry || "Unknown";
      if (!industryStats.has(industry)) {
        industryStats.set(industry, {
          industry,
          customerCount: 0,
          totalQuotes: 0,
          totalValue: 0,
          convertedQuotes: 0,
          convertedValue: 0,
          conversionRate: 0,
          avgQuoteValue: 0,
        });
      }
      industryStats.get(industry).customerCount++;
    });

    quotes.forEach(quote => {
      const customer = customers.find(c => c._id === quote.customerId);
      const industry = customer?.industry || "Unknown";
      
      if (industryStats.has(industry)) {
        const stats = industryStats.get(industry);
        stats.totalQuotes++;
        stats.totalValue += quote.totalAmount;
        
        if (quote.status === "converted") {
          stats.convertedQuotes++;
          stats.convertedValue += quote.totalAmount;
        }
      }
    });

    const results = Array.from(industryStats.values()).map(stats => ({
      ...stats,
      conversionRate: stats.totalQuotes > 0 ? (stats.convertedQuotes / stats.totalQuotes) * 100 : 0,
      avgQuoteValue: stats.totalQuotes > 0 ? stats.totalValue / stats.totalQuotes : 0,
    }));

    return results.sort((a, b) => b.totalValue - a.totalValue);
  },
});

// Monthly Trends Report
export const getMonthlyTrends = query({
  args: {
    months: v.optional(v.number()), // Number of months to look back
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const monthsBack = args.months || 12;
    const quotes = await ctx.db.query("quotes").collect();
    
    const now = new Date();
    const trends = [];

    for (let i = monthsBack - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthQuotes = quotes.filter(q => {
        const quoteDate = new Date(q._creationTime);
        return quoteDate >= date && quoteDate < nextMonth;
      });

      const convertedQuotes = monthQuotes.filter(q => q.status === "converted");
      
      trends.push({
        month: date.toISOString().substring(0, 7), // YYYY-MM format
        monthName: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        totalQuotes: monthQuotes.length,
        totalValue: monthQuotes.reduce((sum, q) => sum + q.totalAmount, 0),
        convertedQuotes: convertedQuotes.length,
        convertedValue: convertedQuotes.reduce((sum, q) => sum + q.totalAmount, 0),
        conversionRate: monthQuotes.length > 0 ? (convertedQuotes.length / monthQuotes.length) * 100 : 0,
        avgQuoteValue: monthQuotes.length > 0 ? monthQuotes.reduce((sum, q) => sum + q.totalAmount, 0) / monthQuotes.length : 0,
      });
    }

    return trends;
  },
});

// Executive Summary Report
export const getExecutiveSummary = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const quotes = await ctx.db.query("quotes").collect();
    const customers = await ctx.db.query("customers").collect();
    const products = await ctx.db.query("products").collect();

    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);

    const recentQuotes = quotes.filter(q => q._creationTime >= thirtyDaysAgo);
    const quarterQuotes = quotes.filter(q => q._creationTime >= ninetyDaysAgo);

    const convertedQuotes = quotes.filter(q => q.status === "converted");
    const recentConverted = recentQuotes.filter(q => q.status === "converted");

    // Top customers by value
    const customerValues = new Map();
    quotes.forEach(quote => {
      if (quote.status === "converted") {
        const current = customerValues.get(quote.customerId) || 0;
        customerValues.set(quote.customerId, current + quote.totalAmount);
      }
    });

    const topCustomers = Array.from(customerValues.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([customerId, value]) => {
        const customer = customers.find(c => c._id === customerId);
        return { customer, value };
      });

    return {
      overview: {
        totalQuotes: quotes.length,
        totalValue: quotes.reduce((sum, q) => sum + q.totalAmount, 0),
        convertedQuotes: convertedQuotes.length,
        convertedValue: convertedQuotes.reduce((sum, q) => sum + q.totalAmount, 0),
        conversionRate: quotes.length > 0 ? (convertedQuotes.length / quotes.length) * 100 : 0,
        avgQuoteValue: quotes.length > 0 ? quotes.reduce((sum, q) => sum + q.totalAmount, 0) / quotes.length : 0,
      },
      recent: {
        quotesLast30Days: recentQuotes.length,
        valueLast30Days: recentQuotes.reduce((sum, q) => sum + q.totalAmount, 0),
        convertedLast30Days: recentConverted.length,
        convertedValueLast30Days: recentConverted.reduce((sum, q) => sum + q.totalAmount, 0),
      },
      quarter: {
        quotesLast90Days: quarterQuotes.length,
        valueLast90Days: quarterQuotes.reduce((sum, q) => sum + q.totalAmount, 0),
      },
      topCustomers,
      activeCustomers: customers.length,
      activeProducts: products.filter(p => p.isActive).length,
    };
  },
});
