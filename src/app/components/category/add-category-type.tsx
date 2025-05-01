"use client";
import React, { useEffect, useState } from "react";
import { notifySuccess, notifyError } from "@/utils/toast"; // adjust path if needed

const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

const AddCategoryType = () => {
  const [allTypes, setAllTypes] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const res = await fetch(`${base_api}/api/category-types/`);
      const data = await res.json();
      if (res.ok) {
        setAllTypes(data.data);
      } else {
        notifyError(data.message || "Failed to fetch category types");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      notifyError("Something went wrong while fetching category types.");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      notifyError("Please enter a category name");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${base_api}/api/category-types/add-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ types: [newCategoryName.trim()] }),
      });

      const result = await res.json();
      
      if (res.ok) {
        notifySuccess("Category type added successfully!");
        setNewCategoryName("");
        setIsModalOpen(false);
        await fetchTypes();
      } else {
        notifyError(result.message || "Failed to add category type.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      notifyError("Something went wrong while adding category type.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (type: any) => {
    setEditingId(type.id);
    setEditedName(type.name);
  };

  const handleUpdate = async (id: number) => {
    if (!editedName.trim()) {
      notifyError("Category type name cannot be empty.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${base_api}/api/category-types/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedName }),
      });

      const result = await res.json();
      
      if (res.ok) {
        notifySuccess("Category type updated successfully!");
        setEditingId(null);
        await fetchTypes();
      } else {
        notifyError(result.message || "Failed to update category type.");
      }
    } catch (err) {
      console.error("Update error:", err);
      notifyError("Something went wrong while updating category type.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setSubmitting(true);
      const res = await fetch(`${base_api}/api/category-types/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();
      
      if (res.ok) {
        notifySuccess("Category type deleted successfully!");
        await fetchTypes();
      } else {
        notifyError(result.message || "Failed to delete category type.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      notifyError("Something went wrong while deleting category type.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTypes = allTypes.filter(type => 
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Header Section */}
      <div className="bg-[#7C3AED]">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-white">Categories</h1>
          <p className="text-white/80 text-sm mt-1">Manage and organize your course categories</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="ml-4 bg-white text-[#7C3AED] px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Category
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">NAME</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">TYPE</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTypes.map((type) => (
                <tr key={type.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    {editingId === type.id ? (
                      <input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-800">{type.name}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Course
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {editingId === type.id ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleUpdate(type.id)}
                          className="text-green-600 hover:text-green-800 font-medium"
                          disabled={submitting}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-800 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => handleEdit(type)}
                          className="text-purple-600 hover:text-purple-800"
                          disabled={submitting}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(type.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={submitting}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Category</h2>
            <form onSubmit={handleAddCategory}>
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6D28D9] transition-colors disabled:opacity-50"
                >
                  {submitting ? "Adding..." : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCategoryType;
