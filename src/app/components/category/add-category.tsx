"use client";
import { notifyError, notifySuccess } from "@/utils/toast";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { PlusIcon, XMarkIcon, PencilIcon, TrashIcon, FolderPlusIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
// Add these if not already available
// import { notifySuccess, notifyError } from "@/utils/notify"; // Adjust this import path to your project

const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

type Category = {
  name: string;
  categoryTypeId: string;
};
type CategoryType = {
  id: string;
  name: string;
};
type CategoryField = keyof Category;

const CategoryForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([
    { name: "", categoryTypeId: "" },
  ]);
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ name: "", categoryTypeId: "" });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategoryTypes();
    fetchCategories();
  }, []);

  const fetchCategoryTypes = async () => {
    try {
      const res = await fetch(`${base_api}/api/category-types/`);
      const data = await res.json();
      if (res.ok) {
        setCategoryTypes(data.data);
      } else {
        notifyError("Failed to load category types.");
      }
    } catch (err) {
      console.error("Failed to fetch category types:", err);
      notifyError("An error occurred while fetching category types.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${base_api}/api/categories/`);
      const data = await res.json();
      if (res.ok) {
        setAllCategories(data.data);
      } else {
        notifyError("Failed to load categories.");
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      notifyError("An error occurred while fetching categories.");
    }
  };

  const handleInputChange = (
    index: number,
    field: CategoryField,
    value: string
  ) => {
    const updated = [...categoryList];
    updated[index][field] = value;
    setCategoryList(updated);
  };

  const handleAddCategoryInput = () => {
    setCategoryList([...categoryList, { name: "", categoryTypeId: "" }]);
  };

  const handleDeleteCategoryInput = (index: number) => {
    if (categoryList.length > 1) {
      setCategoryList(categoryList.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validCategories = categoryList.filter(
      (c) => c.name.trim() && c.categoryTypeId.trim()
    );

    if (validCategories.length === 0) {
      notifyError("Please fill in all fields before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${base_api}/api/categories/add-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: validCategories }),
      });
      setSubmitting(false);

      const result = await res.json();
      if (res.ok) {
        setCategoryList([{ name: "", categoryTypeId: "" }]);
        fetchCategories();
        notifySuccess("Categories added successfully!");
      } else {
        notifyError(result.message || "Failed to add categories.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      notifyError("An error occurred while submitting categories.");
      setSubmitting(false);
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setEditData({
      name: category.name,
      categoryTypeId: category.categoryTypeId,
    });
  };

  const handleUpdate = async (id: number) => {
    if (!editData.name.trim() || !editData.categoryTypeId.trim()) {
      notifyError("Both fields are required.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${base_api}/api/categories/edit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      setSubmitting(false);

      const data = await res.json();
      if (res.ok) {
        setEditingId(null);
        fetchCategories();
        notifySuccess("Category updated successfully!");
      } else {
        notifyError(data.message || "Failed to update category.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      notifyError("An error occurred while updating the category.");
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setSubmitting(true);

      const res = await fetch(`${base_api}/api/categories/delete/${id}`, {
        method: "DELETE",
      });
      setSubmitting(false);

      const data = await res.json();
      if (res.ok) {
        fetchCategories();
        notifySuccess("Category deleted successfully!");
      } else {
        notifyError(data.message || "Failed to delete category.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      notifyError("An error occurred while deleting the category.");
      setSubmitting(false);
    }
  };

  const filteredCategories = allCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoryTypes.find(type => type.id === cat.categoryTypeId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Search and Add Button */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white font-heading tracking-tight">Categories</h2>
            <p className="text-indigo-100 mt-2 font-medium">Manage and organize your course categories</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
                <input
                  type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-lg border-2 border-indigo-400/30 bg-white/10 text-white placeholder-indigo-200 focus:bg-white/20 focus:border-indigo-300 transition-all duration-200 w-full md:w-64 font-medium"
              />
              <svg className="absolute left-3 top-3 h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              <FolderPlusIcon className="h-5 w-5" />
              Add Category
            </button>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <AnimatePresence>
                {filteredCategories.map((category: any, index) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      {editingId === category.id ? (
                            <input
                              type="text"
                          className="w-full px-3 py-2 border border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                      ) : (
                        <div className="text-sm font-semibold text-gray-900">{category.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === category.id ? (
                            <ReactSelect
                          className="react-select-container"
                          classNamePrefix="react-select"
                          options={categoryTypes.map(type => ({
                                value: type.id,
                            label: type.name
                          }))}
                          value={categoryTypes
                            .filter(type => type.id === editData.categoryTypeId)
                            .map(type => ({ value: type.id, label: type.name }))[0]}
                          onChange={(selected: any) =>
                                setEditData({
                                  ...editData,
                              categoryTypeId: selected?.value || ""
                            })
                          }
                          placeholder="Select type..."
                          isClearable
                        />
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {categoryTypes.find(type => type.id === category.categoryTypeId)?.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingId === category.id ? (
                        <div className="flex justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUpdate(category.id)}
                              disabled={submitting}
                            className="inline-flex items-center px-3.5 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
                          >
                            Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                              onClick={() => setEditingId(null)}
                            className="inline-flex items-center px-3.5 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
                          >
                            Cancel
                          </motion.button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.1, color: '#4F46E5' }}
                            onClick={() => handleEdit(category)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1, color: '#DC2626' }}
                            onClick={() => handleDelete(category.id)}
                            disabled={submitting}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </motion.button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <FolderPlusIcon className="h-16 w-16 text-gray-400" />
                      <h3 className="mt-3 text-lg font-semibold text-gray-900">No categories</h3>
                      <p className="mt-2 text-sm text-gray-500">Get started by creating a new category.</p>
                      <div className="mt-6">
                            <button
                          onClick={() => setIsModalOpen(true)}
                          className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                          <PlusIcon className="h-5 w-5 mr-2" />
                          Add Category
                        </button>
                      </div>
                    </div>
                  </td>
                  </tr>
              )}
            </tbody>
            </table>
        </div>
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50"
            >
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                  <h3 className="text-xl font-bold text-gray-900">Add New Category</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-4">
                      {categoryList.map((cat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative bg-gray-50/70 p-5 rounded-lg border border-gray-200/70"
                        >
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Category Name
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                                placeholder="Enter category name"
                                value={cat.name}
                                onChange={(e) => handleInputChange(index, "name", e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Category Type
                              </label>
                              <ReactSelect
                                className="react-select-container"
                                classNamePrefix="react-select"
                                options={categoryTypes.map(type => ({
                                  value: type.id,
                                  label: type.name
                                }))}
                                value={categoryTypes
                                  .filter(type => type.id === cat.categoryTypeId)
                                  .map(type => ({ value: type.id, label: type.name }))[0]}
                                onChange={(selected: any) =>
                                  handleInputChange(index, "categoryTypeId", selected?.value || "")
                                }
                                placeholder="Select type..."
                                isClearable
                              />
                            </div>
                          </div>
                          {categoryList.length > 1 && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => handleDeleteCategoryInput(index)}
                              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="sticky bottom-0 pt-4 bg-white border-t border-gray-100 space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="button"
                        onClick={handleAddCategoryInput}
                        className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Another Category
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {submitting ? (
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          "Add Categories"
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryForm;
