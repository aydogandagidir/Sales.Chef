import { useState } from "react";
import { PageHeader } from "./PageHeader";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const PRODUCT_CATEGORIES = {
  "Material & Hardware": [
    "Conveyors",
    "DWS Systems",
    "Singulators",
    "Crossbelt/Loop Sorters",
    "Barcode/QR Readers",
    "Electrical Panels & PLCs",
    "Structural Supports",
  ],
  "Manpower / Engineering Services": [
    "Design & Engineering",
    "Project Management",
    "Workshop Assembly",
    "On-site Installation",
    "Commissioning & Testing",
    "Operator Training",
  ],
  "Logistics & Transport": [
    "Freight Services",
    "Customs & Import Taxes",
    "Packaging & Handling",
    "Insurance",
  ],
  "Software & Control Systems": [
    "WCS Software",
    "PLC Programming & Logic",
    "HMI Design",
    "Data Integration",
  ],
  "After-Sales Services & Support": [
    "Extended Warranty",
    "Spare Parts Kits",
    "Remote Diagnostics",
    "Hotline / On-call Support",
  ],
  "Optional Systems & Modules": [
    "Telescopic Conveyors",
    "Additional Induction Lines",
    "Extra Store Output/Sorting Chutes",
    "Redundancy Systems",
    "Labeling Machines",
  ],
};

const UNITS = [
  "unit",
  "meter",
  "hour",
  "system",
  "license",
  "kit",
  "month",
  "year",
  "km",
  "kg",
  "container",
  "shipment",
  "destination",
  "chute",
  "line",
];

export function ProductManager() {
  const products = useQuery(api.products.list);
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Id<"products"> | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSubcategory, setFilterSubcategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    basePrice: 0,
    unit: "unit",
    isActive: true,
    specifications: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      subcategory: "",
      basePrice: 0,
      unit: "unit",
      isActive: true,
      specifications: "",
    });
    setSelectedCategory("");
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory || "",
      basePrice: product.basePrice,
      unit: product.unit,
      isActive: product.isActive,
      specifications: product.specifications || "",
    });
    setSelectedCategory(product.category);
    setEditingProduct(product._id);
    setShowForm(true);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFormData({ ...formData, category, subcategory: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct({
          productId: editingProduct,
          ...formData,
        });
      } else {
        await createProduct(formData);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  // Filter products based on search and category filters
  const filteredProducts =
    products?.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || product.category === filterCategory;
      const matchesSubcategory =
        filterSubcategory === "all" ||
        product.subcategory === filterSubcategory;

      return matchesSearch && matchesCategory && matchesSubcategory;
    }) || [];

  // Get unique categories and subcategories for filters
  const availableCategories = [
    ...new Set(products?.map((p) => p.category) || []),
  ];
  const availableSubcategories =
    filterCategory === "all"
      ? [...new Set(products?.map((p) => p.subcategory).filter(Boolean) || [])]
      : [
          ...new Set(
            products
              ?.filter((p) => p.category === filterCategory)
              .map((p) => p.subcategory)
              .filter(Boolean) || [],
          ),
        ];

  if (products === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Catalog"
        buttonLabel="Add New Product"
        icon="add"
        onButtonClick={() => setShowForm(true)}
      />
      <p className="text-gray-600 mt-1">
        Manage your intralogistics products and services
      </p>

      {/* Category Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(PRODUCT_CATEGORIES).map(([category, subcategories]) => {
          const categoryProducts =
            products?.filter((p) => p.category === category) || [];
          const categoryIcon =
            {
              "Material & Hardware": "🧱",
              "Manpower / Engineering Services": "👷",
              "Logistics & Transport": "🚛",
              "Software & Control Systems": "📊",
              "After-Sales Services & Support": "🔧",
              "Optional Systems & Modules": "➕",
            }[category] || "📦";

          return (
            <div
              key={category}
              className="bg-white p-4 rounded-lg shadow border"
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">{categoryIcon}</span>
                <div>
                  <h3 className="font-medium text-gray-900">{category}</h3>
                  <p className="text-sm text-gray-500">
                    {categoryProducts.length} products
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {subcategories.slice(0, 3).join(", ")}
                {subcategories.length > 3 &&
                  ` +${subcategories.length - 3} more`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setFilterSubcategory("all");
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory
            </label>
            <select
              value={filterSubcategory}
              onChange={(e) => setFilterSubcategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              disabled={filterCategory === "all"}
            >
              <option value="all">All Subcategories</option>
              {availableSubcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </div>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select Category</option>
                  {Object.keys(PRODUCT_CATEGORIES).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) =>
                    setFormData({ ...formData, subcategory: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  disabled={!selectedCategory}
                >
                  <option value="">Select Subcategory</option>
                  {selectedCategory &&
                    PRODUCT_CATEGORIES[
                      selectedCategory as keyof typeof PRODUCT_CATEGORIES
                    ]?.map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      basePrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Active Product
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technical Specifications
              </label>
              <textarea
                value={formData.specifications}
                onChange={(e) =>
                  setFormData({ ...formData, specifications: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows={3}
                placeholder="Technical specifications, dimensions, capabilities, etc."
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingProduct ? "Update" : "Create"} Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.description}
                      </div>
                      {product.specifications && (
                        <div className="text-xs text-gray-400 mt-1">
                          {product.specifications}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.category}
                    </div>
                    {product.subcategory && (
                      <div className="text-xs text-gray-500">
                        {product.subcategory}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.basePrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ||
              filterCategory !== "all" ||
              filterSubcategory !== "all"
                ? "No products match your search criteria"
                : "No products found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
