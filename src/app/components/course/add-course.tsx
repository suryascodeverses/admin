"use client";

import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { notifySuccess, notifyError } from "@/utils/toast"; // adjust if needed
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Course {
  id: string;
  title: string;
  description: string;
  video: string;
  // categoryId: string;
  categoryTypeId: string;
}

interface CategoryType {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<Partial<Course>>({});
  // const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${base_api}/api/courses`);
      const data = await res.json();
      if (data.success) {
        setCourses(data.data);
      } else {
        notifyError(data.message || "Failed to fetch courses.");
      }
    } catch (error) {
      console.error(error);
      notifyError("Error fetching courses.");
    }
  };

  const fetchCategoryTypes = async () => {
    try {
      const res = await fetch(`${base_api}/api/category-types`);
      const data = await res.json();
      if (data.success) {
        setCategoryTypes(data.data);
      } else {
        notifyError(data.message || "Failed to fetch category types.");
      }
    } catch (error) {
      console.error(error);
      notifyError("Error fetching category types.");
    }
  };

  // const fetchCategories = async () => {
  //   if (!form.categoryTypeId) return;
  //   try {
  //     const res = await fetch(
  //       `${base_api}/api/categories/category-by-type/${form.categoryTypeId}`
  //     );
  //     const data = await res.json();
  //     if (data.success) {
  //       setCategories(data.data);
  //     } else {
  //       notifyError(data.message || "Failed to fetch categories.");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     notifyError("Error fetching categories.");
  //   }
  // };

  useEffect(() => {
    fetchCourses();
    fetchCategoryTypes();
  }, []);

  // useEffect(() => {
  //   fetchCategories();
  // }, [form.categoryTypeId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = form.id
      ? `${base_api}/api/courses/add/${form.id}`
      : `${base_api}/api/courses/add`;
    const method = form.id ? "PUT" : "POST";

    try {
      setSubmitting(true);

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      setSubmitting(false);

      const result = await res.json();

      if (res.ok) {
        notifySuccess(`Course ${form.id ? "updated" : "added"} successfully.`);
        setForm({});
        fetchCourses();
      } else {
        notifyError(result.message || "Failed to submit course.");
      }
    } catch (error) {
      console.error(error);
      notifyError("Error submitting course.");
      setSubmitting(false);
    }
  };

  const handleEdit = (course: Course) => {
    setForm(course);
  };

  const handleDelete = async (id: string) => {
    try {
      setSubmitting(true);

      const res = await fetch(`${base_api}/api/courses/${id}`, {
        method: "DELETE",
      });
      setSubmitting(false);

      const result = await res.json();
      if (res.ok) {
        notifySuccess("Course deleted successfully.");
        fetchCourses();
      } else {
        notifyError(result.message || "Failed to delete course.");
      }
    } catch (error) {
      console.error(error);
      notifyError("Error deleting course.");
      setSubmitting(false);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Search and Add Button */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white font-heading tracking-tight">Courses</h2>
            <p className="text-indigo-100 mt-2 font-medium">Manage and organize your courses</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
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
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Course
            </button>
          </div>
        </div>
      </div>

      {/* Course Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 font-semibold text-gray-600">NAME</th>
                <th className="text-left py-4 font-semibold text-gray-600">TYPE</th>
                <th className="text-right py-4 font-semibold text-gray-600">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4">{course.title}</td>
                  <td className="py-4">
                    {categoryTypes.find(type => type.id === course.categoryTypeId)?.name || 'N/A'}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                        title="Edit course"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                        disabled={submitting}
                        title="Delete course"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No courses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {form.id ? 'Edit Course' : 'Add New Course'}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setForm({});
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title || ""}
                    onChange={handleChange}
                    placeholder="Enter course title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description || ""}
                    onChange={handleChange}
                    placeholder="Enter course description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL
                  </label>
                  <input
                    type="text"
                    name="video"
                    value={form.video || ""}
                    onChange={handleChange}
                    placeholder="Enter video URL"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Type
                  </label>
                  <ReactSelect
                    value={
                      form?.categoryTypeId
                        ? {
                            value: form.categoryTypeId,
                            label: categoryTypes.find(
                              (type) => type.id === form.categoryTypeId
                            )?.name,
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      handleChange({
                        target: {
                          name: "categoryTypeId",
                          value: selectedOption?.value || "",
                        },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    options={categoryTypes.map((type) => ({
                      value: type.id,
                      label: type.name,
                    }))}
                    placeholder="Select Category Type"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isClearable
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setForm({});
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : form.id ? 'Update Course' : 'Add Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
