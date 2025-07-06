import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if sample data already exists
    const existingCustomers = await ctx.db.query("customers").first();
    if (existingCustomers) {
      return { message: "Sample data already exists" };
    }

    // Create sample customers with diverse industries
    const customers = [
      {
        companyName: "Global Logistics Solutions",
        contactName: "Sarah Johnson",
        email: "sarah.johnson@globallogistics.com",
        phone: "+1-555-0123",
        address: "1234 Industrial Blvd",
        city: "Chicago",
        country: "USA",
        industry: "E-commerce & Fulfillment",
        notes: "Large-scale fulfillment center requiring high-throughput sorting"
      },
      {
        companyName: "European Distribution Hub",
        contactName: "Hans Mueller",
        email: "h.mueller@eudistribution.de",
        phone: "+49-30-12345678",
        address: "Industriestraße 45",
        city: "Berlin",
        country: "Germany",
        industry: "Retail Distribution",
        notes: "Multi-channel distribution center with complex routing needs"
      },
      {
        companyName: "Asia Pacific Freight",
        contactName: "Li Wei",
        email: "li.wei@apfreight.com",
        phone: "+86-21-87654321",
        address: "Shanghai Port Area",
        city: "Shanghai",
        country: "China",
        industry: "Freight & Logistics",
        notes: "Port-adjacent facility requiring customs integration"
      },
      {
        companyName: "Pharma Supply Chain Inc",
        contactName: "Dr. Maria Rodriguez",
        email: "m.rodriguez@pharmasupply.com",
        phone: "+1-555-0456",
        address: "789 Medical Drive",
        city: "Boston",
        country: "USA",
        industry: "Pharmaceutical",
        notes: "Temperature-controlled environment with strict compliance requirements"
      },
      {
        companyName: "Automotive Parts Direct",
        contactName: "Klaus Weber",
        email: "k.weber@autoparts.com",
        phone: "+49-89-98765432",
        address: "Münchener Str. 123",
        city: "Munich",
        country: "Germany",
        industry: "Automotive",
        notes: "Just-in-time delivery requirements with heavy parts handling"
      }
    ];

    const customerIds = [];
    for (const customer of customers) {
      const id = await ctx.db.insert("customers", { ...customer, createdBy: userId });
      customerIds.push(id);
    }

    // Create comprehensive product catalog for intralogistics
    const products = [
      // Material & Hardware - Conveyors
      {
        name: "Belt Conveyor System BC-2000",
        description: "Heavy-duty belt conveyor for packages up to 50kg, 2m width",
        category: "Material & Hardware",
        subcategory: "Conveyors",
        basePrice: 15000,
        unit: "meter",
        isActive: true,
        specifications: "Load capacity: 50kg/package, Belt width: 2000mm, Speed: 0.5-2.0 m/s"
      },
      {
        name: "Roller Conveyor RC-1200",
        description: "Gravity and powered roller conveyor for light to medium packages",
        category: "Material & Hardware",
        subcategory: "Conveyors",
        basePrice: 8500,
        unit: "meter",
        isActive: true,
        specifications: "Load capacity: 30kg/package, Roller width: 1200mm, Motorized option available"
      },
      {
        name: "Telescopic Conveyor TC-EXT",
        description: "Extendable telescopic conveyor for truck loading/unloading",
        category: "Material & Hardware",
        subcategory: "Conveyors",
        basePrice: 45000,
        unit: "unit",
        isActive: true,
        specifications: "Extension: 8-18m, Load capacity: 35kg/package, Height adjustable"
      },

      // Material & Hardware - DWS Systems
      {
        name: "DWS-Pro Dimensioning System",
        description: "Complete dimensioning, weighing, and scanning solution",
        category: "Material & Hardware",
        subcategory: "DWS Systems",
        basePrice: 85000,
        unit: "unit",
        isActive: true,
        specifications: "Accuracy: ±2mm/±10g, Throughput: 3600 packages/hour, Multi-sided scanning"
      },
      {
        name: "Compact DWS-Lite",
        description: "Entry-level DWS system for smaller operations",
        category: "Material & Hardware",
        subcategory: "DWS Systems",
        basePrice: 35000,
        unit: "unit",
        isActive: true,
        specifications: "Accuracy: ±5mm/±20g, Throughput: 1800 packages/hour, Single-sided scanning"
      },

      // Material & Hardware - Crossbelt/Loop Sorters
      {
        name: "Crossbelt Sorter CBS-3000",
        description: "High-speed crossbelt sorting system with 300 destinations",
        category: "Material & Hardware",
        subcategory: "Crossbelt/Loop Sorters",
        basePrice: 750000,
        unit: "system",
        isActive: true,
        specifications: "Throughput: 15000 packages/hour, 300 destinations, Package size: 100x100x600mm"
      },
      {
        name: "Loop Sorter LS-150",
        description: "Continuous loop sorter for medium-volume operations",
        category: "Material & Hardware",
        subcategory: "Crossbelt/Loop Sorters",
        basePrice: 450000,
        unit: "system",
        isActive: true,
        specifications: "Throughput: 8000 packages/hour, 150 destinations, Recirculation capability"
      },

      // Material & Hardware - Singulators
      {
        name: "Singulator Unit SG-Auto",
        description: "Automatic package singulation system",
        category: "Material & Hardware",
        subcategory: "Singulators",
        basePrice: 65000,
        unit: "unit",
        isActive: true,
        specifications: "Throughput: 4000 packages/hour, Gap creation: 200-800mm, Auto-adjustment"
      },

      // Material & Hardware - Barcode/QR Readers
      {
        name: "Sick Barcode Scanner SBS-Pro",
        description: "Industrial barcode scanner with omnidirectional reading",
        category: "Material & Hardware",
        subcategory: "Barcode/QR Readers",
        basePrice: 3500,
        unit: "unit",
        isActive: true,
        specifications: "Read rate: 99.9%, Omnidirectional, IP65 rated, Ethernet interface"
      },
      {
        name: "Cognex Vision System CVS-Advanced",
        description: "Machine vision system for complex package identification",
        category: "Material & Hardware",
        subcategory: "Barcode/QR Readers",
        basePrice: 12000,
        unit: "unit",
        isActive: true,
        specifications: "2D/3D vision, OCR capability, Multiple trigger modes, Industrial housing"
      },

      // Material & Hardware - Electrical Panels & PLCs
      {
        name: "Siemens PLC S7-1500",
        description: "Industrial PLC for automation control",
        category: "Material & Hardware",
        subcategory: "Electrical Panels & PLCs",
        basePrice: 8500,
        unit: "unit",
        isActive: true,
        specifications: "CPU 1515-2, 512KB memory, Ethernet interface, Safety integrated"
      },
      {
        name: "Main Control Panel MCP-Industrial",
        description: "Complete electrical control panel with HMI",
        category: "Material & Hardware",
        subcategory: "Electrical Panels & PLCs",
        basePrice: 25000,
        unit: "unit",
        isActive: true,
        specifications: "IP54 enclosure, 15\" HMI touchscreen, Emergency stops, Status indicators"
      },

      // Material & Hardware - Structural Supports
      {
        name: "Steel Support Frame SSF-Heavy",
        description: "Heavy-duty steel support structure for conveyor systems",
        category: "Material & Hardware",
        subcategory: "Structural Supports",
        basePrice: 5000,
        unit: "meter",
        isActive: true,
        specifications: "Load capacity: 500kg/m, Hot-dip galvanized, Modular design"
      },

      // Manpower / Engineering Services
      {
        name: "System Design & Engineering",
        description: "Complete system layout and mechanical design services",
        category: "Manpower / Engineering Services",
        subcategory: "Design & Engineering",
        basePrice: 150,
        unit: "hour",
        isActive: true,
        specifications: "CAD drawings, 3D modeling, Load calculations, Safety assessments"
      },
      {
        name: "Project Management Services",
        description: "Dedicated project manager for installation coordination",
        category: "Manpower / Engineering Services",
        subcategory: "Project Management",
        basePrice: 120,
        unit: "hour",
        isActive: true,
        specifications: "Timeline management, Resource coordination, Progress reporting, Risk management"
      },
      {
        name: "Workshop Assembly Services",
        description: "Pre-assembly and testing in controlled workshop environment",
        category: "Manpower / Engineering Services",
        subcategory: "Workshop Assembly",
        basePrice: 85,
        unit: "hour",
        isActive: true,
        specifications: "Quality control, Pre-testing, Documentation, Packaging for transport"
      },
      {
        name: "On-site Installation Team",
        description: "Skilled technicians for on-site installation and setup",
        category: "Manpower / Engineering Services",
        subcategory: "On-site Installation",
        basePrice: 95,
        unit: "hour",
        isActive: true,
        specifications: "Certified technicians, Safety training, Tools included, Progress documentation"
      },
      {
        name: "Commissioning & Testing",
        description: "System commissioning and performance testing services",
        category: "Manpower / Engineering Services",
        subcategory: "Commissioning & Testing",
        basePrice: 110,
        unit: "hour",
        isActive: true,
        specifications: "Performance validation, Safety testing, Documentation, Handover protocols"
      },
      {
        name: "Operator Training Program",
        description: "Comprehensive training for system operators",
        category: "Manpower / Engineering Services",
        subcategory: "Operator Training",
        basePrice: 2500,
        unit: "day",
        isActive: true,
        specifications: "Up to 8 participants, Hands-on training, Documentation, Certification"
      },

      // Logistics & Transport
      {
        name: "European Road Freight",
        description: "Road transport within Europe for equipment delivery",
        category: "Logistics & Transport",
        subcategory: "Freight Services",
        basePrice: 2.5,
        unit: "km",
        isActive: true,
        specifications: "Full truck load, Specialized transport, Insurance included, Tracking available"
      },
      {
        name: "Sea Freight - Container",
        description: "Container shipping for international deliveries",
        category: "Logistics & Transport",
        subcategory: "Freight Services",
        basePrice: 3500,
        unit: "container",
        isActive: true,
        specifications: "20ft/40ft containers, Port-to-port, Documentation included"
      },
      {
        name: "Customs Clearance Service",
        description: "Import/export customs handling and documentation",
        category: "Logistics & Transport",
        subcategory: "Customs & Import Taxes",
        basePrice: 450,
        unit: "shipment",
        isActive: true,
        specifications: "Documentation, Duty calculation, Clearance processing, Compliance check"
      },
      {
        name: "Professional Packaging",
        description: "Industrial packaging for sensitive equipment",
        category: "Logistics & Transport",
        subcategory: "Packaging & Handling",
        basePrice: 350,
        unit: "unit",
        isActive: true,
        specifications: "Shock-resistant, Weather protection, Custom crating, Handling instructions"
      },
      {
        name: "Transport Insurance",
        description: "Comprehensive insurance coverage for equipment transport",
        category: "Logistics & Transport",
        subcategory: "Insurance",
        basePrice: 0.5,
        unit: "percent",
        isActive: true,
        specifications: "Full replacement value, Global coverage, Damage protection, Theft coverage"
      },

      // Software & Control Systems
      {
        name: "WCS Software License",
        description: "Warehouse Control System software with basic features",
        category: "Software & Control Systems",
        subcategory: "WCS Software",
        basePrice: 45000,
        unit: "license",
        isActive: true,
        specifications: "Basic routing, Reporting, User management, API integration, 1-year support"
      },
      {
        name: "PLC Programming Service",
        description: "Custom PLC programming and logic development",
        category: "Software & Control Systems",
        subcategory: "PLC Programming & Logic",
        basePrice: 125,
        unit: "hour",
        isActive: true,
        specifications: "Siemens/Allen-Bradley, Safety functions, Documentation, Testing protocols"
      },
      {
        name: "HMI Design & Development",
        description: "Custom HMI interface design and programming",
        category: "Software & Control Systems",
        subcategory: "HMI Design",
        basePrice: 100,
        unit: "hour",
        isActive: true,
        specifications: "Touch screen interface, Alarm management, Trend displays, User levels"
      },
      {
        name: "ERP/WMS Integration",
        description: "Integration with existing ERP and WMS systems",
        category: "Software & Control Systems",
        subcategory: "Data Integration",
        basePrice: 8500,
        unit: "system",
        isActive: true,
        specifications: "API development, Data mapping, Real-time sync, Testing & validation"
      },

      // After-Sales Services & Support
      {
        name: "Extended Warranty - 3 Years",
        description: "Extended warranty coverage beyond standard warranty",
        category: "After-Sales Services & Support",
        subcategory: "Extended Warranty",
        basePrice: 15000,
        unit: "system",
        isActive: true,
        specifications: "Parts & labor, Remote diagnostics, Priority support, Annual maintenance"
      },
      {
        name: "Spare Parts Kit - Essential",
        description: "Essential spare parts kit for maintenance",
        category: "After-Sales Services & Support",
        subcategory: "Spare Parts Kits",
        basePrice: 5500,
        unit: "kit",
        isActive: true,
        specifications: "Most common wear parts, 2-year supply, Storage recommendations, Part numbers"
      },
      {
        name: "Remote Diagnostics Service",
        description: "24/7 remote monitoring and diagnostics",
        category: "After-Sales Services & Support",
        subcategory: "Remote Diagnostics",
        basePrice: 2500,
        unit: "year",
        isActive: true,
        specifications: "VPN connection, Real-time monitoring, Predictive maintenance, Monthly reports"
      },
      {
        name: "Technical Hotline Support",
        description: "Dedicated technical support hotline",
        category: "After-Sales Services & Support",
        subcategory: "Hotline / On-call Support",
        basePrice: 1800,
        unit: "year",
        isActive: true,
        specifications: "Business hours support, Expert technicians, Remote assistance, Escalation procedures"
      },

      // Optional Systems & Modules
      {
        name: "Telescopic Conveyor Extension",
        description: "Additional telescopic conveyor for loading docks",
        category: "Optional Systems & Modules",
        subcategory: "Telescopic Conveyors",
        basePrice: 35000,
        unit: "unit",
        isActive: true,
        specifications: "8-15m extension, 30kg capacity, Height adjustment, Safety features"
      },
      {
        name: "Additional Induction Line",
        description: "Extra induction line for increased throughput",
        category: "Optional Systems & Modules",
        subcategory: "Additional Induction Lines",
        basePrice: 25000,
        unit: "line",
        isActive: true,
        specifications: "2000 packages/hour, DWS integration, Merge capability, Safety sensors"
      },
      {
        name: "Extra Sorting Chutes",
        description: "Additional output chutes for sorting system",
        category: "Optional Systems & Modules",
        subcategory: "Extra Store Output/Sorting Chutes",
        basePrice: 3500,
        unit: "chute",
        isActive: true,
        specifications: "Pneumatic diverter, LED indication, Adjustable height, Safety guards"
      },
      {
        name: "Redundancy Control System",
        description: "Backup control system for critical operations",
        category: "Optional Systems & Modules",
        subcategory: "Redundancy Systems",
        basePrice: 45000,
        unit: "system",
        isActive: true,
        specifications: "Hot standby, Automatic failover, Synchronized operation, Status monitoring"
      },
      {
        name: "Automatic Labeling Machine",
        description: "High-speed labeling system for packages",
        category: "Optional Systems & Modules",
        subcategory: "Labeling Machines",
        basePrice: 28000,
        unit: "unit",
        isActive: true,
        specifications: "3000 labels/hour, Variable data printing, Quality verification, Multiple formats"
      }
    ];

    const productIds = [];
    for (const product of products) {
      const id = await ctx.db.insert("products", { ...product, createdBy: userId });
      productIds.push(id);
    }

    // Create sample quotes with realistic intralogistics scenarios
    const quotes = [
      {
        customerId: customerIds[0], // Global Logistics Solutions
        quoteNumber: "Q-2024-001",
        title: "E-commerce Fulfillment Center - Complete Sorting Solution",
        description: "High-throughput sorting system for 50,000 packages/day capacity with DWS integration",
        status: "sent" as const,
        validUntil: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
        items: [
          {
            productId: productIds[6], // Crossbelt Sorter CBS-3000
            name: "Crossbelt Sorter CBS-3000",
            description: "Crossbelt sorting system with 200 destinations",
            quantity: 1,
            unitPrice: 750000,
            discount: 5,
            total: 712500
          },
          {
            productId: productIds[3], // DWS-Pro Dimensioning System
            name: "DWS-Pro Dimensioning System",
            description: "Complete DWS solution with multi-sided scanning",
            quantity: 2,
            unitPrice: 85000,
            discount: 0,
            total: 170000
          },
          {
            productId: productIds[14], // System Design & Engineering
            name: "System Design & Engineering",
            description: "Complete system design and layout planning",
            quantity: 200,
            unitPrice: 150,
            discount: 0,
            total: 30000
          },
          {
            productId: productIds[17], // On-site Installation Team
            name: "On-site Installation Team",
            description: "Installation and setup services",
            quantity: 320,
            unitPrice: 95,
            discount: 0,
            total: 30400
          }
        ],
        subtotal: 942900,
        taxRate: 8.5,
        taxAmount: 80146.65,
        totalAmount: 1023046.65,
        terms: "Net 30 days. Installation timeline: 12-16 weeks after order confirmation.",
        notes: "Includes 2-year warranty and operator training. Extended warranty available."
      },
      {
        customerId: customerIds[1], // European Distribution Hub
        quoteNumber: "Q-2024-002",
        title: "Multi-Channel Distribution Upgrade",
        description: "Conveyor system upgrade with advanced WCS integration",
        status: "under_review" as const,
        validUntil: Date.now() + (45 * 24 * 60 * 60 * 1000),
        items: [
          {
            productId: productIds[0], // Belt Conveyor System BC-2000
            name: "Belt Conveyor System BC-2000",
            description: "Heavy-duty belt conveyor system",
            quantity: 150,
            unitPrice: 15000,
            discount: 8,
            total: 2070000
          },
          {
            productId: productIds[1], // Roller Conveyor RC-1200
            name: "Roller Conveyor RC-1200",
            description: "Powered roller conveyor sections",
            quantity: 80,
            unitPrice: 8500,
            discount: 8,
            total: 625600
          },
          {
            productId: productIds[25], // WCS Software License
            name: "WCS Software License",
            description: "Premium WCS software with analytics",
            quantity: 1,
            unitPrice: 45000,
            discount: 0,
            total: 45000
          }
        ],
        subtotal: 2740600,
        taxRate: 19,
        taxAmount: 520714,
        totalAmount: 3261314,
        terms: "Net 45 days. Phased installation to minimize disruption.",
        notes: "Integration with existing SAP WMS. Training for 20 operators included."
      }
    ];

    for (const quote of quotes) {
      await ctx.db.insert("quotes", { ...quote, createdBy: userId, version: 1 });
    }

    return {
      message: "Sample data created successfully",
      counts: {
        customers: customers.length,
        products: products.length,
        quotes: quotes.length
      }
    };
  },
});

export const clearAllData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Delete all quotes first (due to foreign key constraints)
    const quotes = await ctx.db.query("quotes").collect();
    for (const quote of quotes) {
      await ctx.db.delete(quote._id);
    }

    // Delete all customers
    const customers = await ctx.db.query("customers").collect();
    for (const customer of customers) {
      await ctx.db.delete(customer._id);
    }

    // Delete all products
    const products = await ctx.db.query("products").collect();
    for (const product of products) {
      await ctx.db.delete(product._id);
    }

    return { message: "All data cleared successfully" };
  },
});
