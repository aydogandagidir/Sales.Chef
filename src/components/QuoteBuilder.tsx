import { useState } from "react";
import { PageHeader } from "./PageHeader";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface QuoteBuilderProps {
  onBack: () => void;
}

const TABS = [
  "Details",
  "Introduction",
  "Materials",
  "Manpower",
  "Logistics",
  "Additional",
  "Summary",
];

export function QuoteBuilder({ onBack }: QuoteBuilderProps) {
  const customers = useQuery(api.customers.list);
  const products = useQuery(api.products.list);
  const createQuote = useMutation(api.quotes.create);

  const [activeTab, setActiveTab] = useState(0);
  const [selectedSubcategory, setSelectedSubcategory] = useState("Mechanical");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [title, setTitle] = useState("");
  // Details tab state
  const [quotationNumber, setQuotationNumber] = useState("QTN-2025-0977");
  const [issueDate, setIssueDate] = useState("05.07.2025");
  const [validity, setValidity] = useState("30 days");
  const [currency, setCurrency] = useState("US Dollar ($)");
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("http://example.com/logo.png");
  const [companyAddress, setCompanyAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  // Client info
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectReference, setProjectReference] = useState("");
  // Introduction tab state
  const [projectSummary, setProjectSummary] = useState("");
  const [scopeOfSupply, setScopeOfSupply] = useState("");
  const [keyAssumptions, setKeyAssumptions] = useState("");
  // Summary tab state
  const [paymentTerms, setPaymentTerms] = useState("");
  const [deliveryTerms, setDeliveryTerms] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [warranty, setWarranty] = useState("");
  const [liability, setLiability] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [forceMajeure, setForceMajeure] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !title) return;

    setIsSubmitting(true);
    try {
      await createQuote({
        customerId: selectedCustomerId as Id<"customers">,
        title,
        items: [], // No more items to send
        taxRate: 0, // No tax rate in new flow
        validityDays: 0, // No validity days in new flow
        terms: paymentTerms,
        notes: nextSteps,
      });
      onBack();
    } catch (error) {
      console.error("Failed to create quote:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (customers === undefined || products === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-gray-900 p-6 flex justify-center items-start">
      <div className="w-full max-w-4xl">
        <PageHeader title="Create New Quotation" buttonLabel="Save Quotation" />
        {/* Tab Navigation */}
        <div
          className="flex bg-gray-100 rounded-lg overflow-hidden mb-6"
          style={{
            fontFamily:
              'Inter Variable, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            color: "rgb(17 24 39)",
            boxSizing: "border-box",
            borderWidth: 0,
            borderStyle: "solid",
            borderColor: "#e5e7eb",
            width: "100%",
            maxWidth: "56rem",
          }}
        >
          {TABS.map((tab, idx) => (
            <button
              key={tab}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === idx
                  ? "bg-white text-blue-600 border-b-4 border-blue-500"
                  : "bg-gray-100 text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(idx)}
              style={{
                fontFamily:
                  'Inter Variable, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                color: "rgb(17 24 39)",
                boxSizing: "border-box",
                borderWidth: 0,
                borderStyle: "solid",
                borderColor: "#e5e7eb",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        {activeTab === 0 && (
          <form
            className="space-y-8 p-6 font-[Inter] bg-white text-gray-900 w-full max-w-4xl"
            style={{
              fontFamily:
                'Inter Variable, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            }}
          >
            {/* Quotation Details */}
            <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Quotation Details</h3>
              <p className="text-gray-500 text-sm mb-4">
                Basic information about the quotation
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm mb-1">
                    Quotation Number *
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                      value={quotationNumber}
                      onChange={(e) => setQuotationNumber(e.target.value)}
                    />
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-700 px-3 py-2 rounded"
                      onClick={() =>
                        setQuotationNumber(
                          "QTN-2025-" + Math.floor(1000 + Math.random() * 9000),
                        )
                      }
                    >
                      Generate
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Issue Date *</label>
                  <input
                    type="text"
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm mb-1">
                    Validity Period *
                  </label>
                  <select
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    value={validity}
                    onChange={(e) => setValidity(e.target.value)}
                  >
                    <option>30 days</option>
                    <option>60 days</option>
                    <option>90 days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Currency *</label>
                  <select
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option>US Dollar ($)</option>
                    <option>Euro (€)</option>
                    <option>British Pound (£)</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Company Information */}
            <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">
                Company Information
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Enter your company details that will appear on the quotation
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Company Name *</label>
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Company Logo URL</label>
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    value={companyLogo}
                    onChange={(e) => setCompanyLogo(e.target.value)}
                    placeholder="http://example.com/logo.png"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Company Address</label>
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="123 Business St, City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Contact Phone</label>
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Contact Email</label>
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@yourcompany.com"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Company Website</label>
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>
            </div>
            {/* Client Information */}
            <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Client Information</h3>
              <p className="text-gray-500 text-sm mb-4">
                Enter the client details for this quotation
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Client Name *</label>
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Client Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Contact Person</label>
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                    placeholder="John Smith"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Client Address</label>
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="456 Client St, City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Client Email</label>
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Project Reference</label>
                <input
                  className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                  value={projectReference}
                  onChange={(e) => setProjectReference(e.target.value)}
                  placeholder="Automated Warehouse System for Client"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="bg-gray-100 border border-gray-300 text-gray-500 px-4 py-2 rounded"
                disabled
              >
                Previous
              </button>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => setActiveTab(1)}
              >
                Next
              </button>
            </div>
          </form>
        )}
        {activeTab === 1 && (
          <form
            className="space-y-8 p-6 font-[Inter] bg-white text-gray-900 w-full max-w-4xl"
            style={{
              fontFamily:
                'Inter Variable, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            }}
          >
            <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">
                Introduction & Scope of Work
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Provide an overview of what the quotation covers
              </p>
              <div className="mb-4">
                <label className="block text-sm mb-1">Project Summary</label>
                <textarea
                  className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                  rows={2}
                  value={projectSummary}
                  onChange={(e) => setProjectSummary(e.target.value)}
                  placeholder="Brief description of the project or service (e.g., Supply and installation of conveyor systems for Client's Facility)"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">Scope of Supply</label>
                <textarea
                  className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                  rows={2}
                  value={scopeOfSupply}
                  onChange={(e) => setScopeOfSupply(e.target.value)}
                  placeholder="High-level list of deliverables (e.g., equipment, services, installation, training)"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Key Assumptions</label>
                <textarea
                  className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                  rows={2}
                  value={keyAssumptions}
                  onChange={(e) => setKeyAssumptions(e.target.value)}
                  placeholder="Any assumptions affecting pricing (e.g., 'Excludes local taxes' or 'Assumes client provides site access')"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="bg-gray-100 border border-gray-300 text-gray-500 px-4 py-2 rounded"
                onClick={() => setActiveTab(0)}
              >
                Previous
              </button>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => setActiveTab(2)}
              >
                Next
              </button>
            </div>
          </form>
        )}
        {activeTab === 2 && (
          <form
            className="space-y-8 p-6 font-[Inter] bg-white text-gray-900 w-full max-w-4xl"
            style={{
              fontFamily:
                'Inter Variable, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            }}
          >
            <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">
                Material & Equipment Costs
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Itemized list of all materials and equipment
              </p>
              {/* Subcategory Tabs */}
              <div className="mb-4">
                <div className="flex gap-2 mb-4">
                  {["Mechanical", "Electrical", "Hardware", "Additionals"].map(
                    (cat, idx) => (
                      <button
                        key={cat}
                        type="button"
                        className={`px-4 py-1 rounded font-medium text-sm transition-colors focus:outline-none ${
                          selectedSubcategory === cat
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                        }`}
                        onClick={() => setSelectedSubcategory(cat)}
                      >
                        {cat}
                      </button>
                    ),
                  )}
                </div>
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <span className="material-icons">add</span> Add Item
                  </button>
                </div>
                {/* Table placeholder for materials */}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Subcategory</th>
                        <th className="px-4 py-2">Part Number</th>
                        <th className="px-4 py-2">Supplier</th>
                        <th className="px-4 py-2">Unit Price</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Example row */}
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-2 font-semibold">
                          steel construction
                        </td>
                        <td className="px-4 py-2">mechanical</td>
                        <td className="px-4 py-2">N/A</td>
                        <td className="px-4 py-2">ABC Steel</td>
                        <td className="px-4 py-2">$12.00</td>
                        <td className="px-4 py-2">
                          <button className="bg-blue-600 text-white px-3 py-1 rounded">
                            Select
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="bg-gray-100 border border-gray-300 text-gray-500 px-4 py-2 rounded"
                onClick={() => setActiveTab(1)}
              >
                Previous
              </button>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => setActiveTab(3)}
              >
                Next
              </button>
            </div>
          </form>
        )}
        {activeTab === 3 && (
          <form
            className="space-y-8 p-6 font-[Inter] bg-white text-gray-900 w-full max-w-4xl"
            style={{
              fontFamily:
                'Inter Variable, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            }}
          >
            <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Manpower Costs</h3>
              <p className="text-gray-500 text-sm mb-4">
                Labor costs by project phase or task
              </p>
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center gap-2"
                >
                  <span className="material-icons">storage</span> From Catalog
                </button>
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <span className="material-icons">add</span> Add Item
                </button>
              </div>
              <div className="text-gray-400 text-center py-8">
                No manpower costs added yet. Click "Add Item" to get started.
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="bg-gray-100 border border-gray-300 text-gray-500 px-4 py-2 rounded"
                onClick={() => setActiveTab(2)}
              >
                Previous
              </button>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => setActiveTab(4)}
              >
                Next
              </button>
            </div>
          </form>
        )}
        {activeTab === 4 && (
          <form
            className="space-y-8 p-6 font-[Inter] bg-white text-gray-900 w-full max-w-4xl"
            style={{
              fontFamily:
                'Inter Variable, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            }}
          >
            <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Logistic Costs</h3>
              <p className="text-gray-500 text-sm mb-4">
                Transportation and logistics expenses
              </p>
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center gap-2"
                >
                  <span className="material-icons">storage</span> From Catalog
                </button>
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <span className="material-icons">add</span> Add Item
                </button>
              </div>
              <div className="text-gray-400 text-center py-8">
                No logistic costs added yet. Click "Add Item" to get started.
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="bg-gray-100 border border-gray-300 text-gray-500 px-4 py-2 rounded"
                onClick={() => setActiveTab(3)}
              >
                Previous
              </button>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => setActiveTab(5)}
              >
                Next
              </button>
            </div>
          </form>
        )}
        {activeTab === 5 && (
          <form
            className="space-y-8 p-6 font-[Inter] bg-white text-gray-900 w-full max-w-4xl"
            style={{
              fontFamily:
                'Inter Variable, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            }}
          >
            <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Additional Costs</h3>
              <p className="text-gray-500 text-sm mb-4">
                Taxes, duties, optional items, and contingencies
              </p>
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center gap-2"
                >
                  <span className="material-icons">storage</span> From Catalog
                </button>
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <span className="material-icons">add</span> Add Item
                </button>
              </div>
              <div className="text-gray-400 text-center py-8">
                No additional costs added yet. Click "Add Item" to get started.
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="bg-gray-100 border border-gray-300 text-gray-500 px-4 py-2 rounded"
                onClick={() => setActiveTab(4)}
              >
                Previous
              </button>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => setActiveTab(6)}
              >
                Next
              </button>
            </div>
          </form>
        )}
        {activeTab === 6 && (
          <form
            className="space-y-8 p-6 font-[Inter] bg-white text-gray-900 w-full max-w-4xl"
            style={{
              fontFamily:
                'Inter Variable, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            }}
            onSubmit={handleSubmit}
          >
            <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Total Project Cost</h3>
              <p className="text-gray-500 text-sm mb-4">
                Summary of all costs for the project
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-2">Category</th>
                      <th className="px-4 py-2">Base Cost</th>
                      <th className="px-4 py-2">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2">Material & Equipment</td>
                      <td className="px-4 py-2">$0.00</td>
                      <td className="px-4 py-2">$0.00</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2">Manpower</td>
                      <td className="px-4 py-2">$0.00</td>
                      <td className="px-4 py-2">$0.00</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2">Logistics</td>
                      <td className="px-4 py-2">$0.00</td>
                      <td className="px-4 py-2">$0.00</td>
                    </tr>
                  </tbody>
                </table>
                <div className="bg-gray-100 text-gray-900 text-xl font-bold p-4 mt-4 rounded-lg text-center">
                  Grand Total
                  <br />
                  $0,00
                </div>
              </div>
              {/* Terms and Conditions Section */}
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-2">
                  Terms and Conditions
                </h4>
                <div className="space-y-2">
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    placeholder="Payment Terms"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                  />
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    placeholder="Delivery Terms"
                    value={deliveryTerms}
                    onChange={(e) => setDeliveryTerms(e.target.value)}
                  />
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    placeholder="Lead Time"
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                  />
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    placeholder="Warranty"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                  />
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    placeholder="Liability"
                    value={liability}
                    onChange={(e) => setLiability(e.target.value)}
                  />
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    placeholder="Cancellation Policy"
                    value={cancellationPolicy}
                    onChange={(e) => setCancellationPolicy(e.target.value)}
                  />
                  <input
                    className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    placeholder="Force Majeure"
                    value={forceMajeure}
                    onChange={(e) => setForceMajeure(e.target.value)}
                  />
                </div>
              </div>
              {/* Call to Action Section */}
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-2">Call to Action</h4>
                <textarea
                  className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900"
                  placeholder="Next Steps"
                  rows={2}
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="bg-gray-100 border border-gray-300 text-gray-500 px-4 py-2 rounded"
                onClick={() => setActiveTab(5)}
              >
                Previous
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Quotation"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
