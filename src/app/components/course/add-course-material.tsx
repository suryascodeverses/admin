"use client";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { notifySuccess, notifyError } from "@/utils/toast";
import DefaultUploadImg from "../products/add-product/default-upload-img";

interface CategoryType {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
  categoryTypeId: string;
}

interface CourseMaterial {
  id: string;
  title: string;
  description: string;
  fees?: string;
  media: { name: string; path: string; type: string };
  courseId: string;
  categoryId: string;
}

const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

const CourseMaterialManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [form, setForm] = useState<CourseMaterial | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${base_api}/api/courses`);
      const data = await res.json();
      if (data.success) {
        setCourses(data.data);
        setFilteredCourses(data.data);
      } else {
        notifyError(data.message || "Failed to fetch courses.");
      }
    } catch (error) {
      console.error(error);
      notifyError("Error fetching courses.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryTypes = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryTypes();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      const filtered = courses.filter(
        (course) => course.categoryTypeId === selectedCategoryId
      );
      setFilteredCourses(filtered);
      if (
        selectedCourseId &&
        !filtered.find((c) => c.id === selectedCourseId)
      ) {
        setSelectedCourseId("");
      }
    } else {
      setFilteredCourses(courses);
    }
  }, [selectedCategoryId, courses, selectedCourseId]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        selectedCourseId
          ? `${base_api}/api/courses-material/courseId/${selectedCourseId}`
          : `${base_api}/api/courses-material`
      );
      const data = await res.json();
      if (data.success) {
        setMaterials(data.data);
      } else {
        notifyError(data.message || "Failed to fetch materials.");
      }
    } catch (error) {
      console.error(error);
      notifyError("Error fetching course materials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedCategoryId) {
      fetch(`${base_api}/api/categories/category-by-type/${selectedCategoryId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setCategories(data.data);
          else setCategories([]);
        })
        .catch(() => setCategories([]));
    } else {
      setCategories([]);
    }
  }, [selectedCategoryId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev!, [name]: value }));
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!selectedCourseId || !selectedCategoryId || !form?.categoryId) {
      notifyError("Please select category type, course, and category.");
      return;
    }

    if (!form?.title?.trim()) {
      notifyError("Please enter a title.");
      return;
    }

    if (!form?.description?.trim()) {
      notifyError("Please enter a description.");
      return;
    }

    if (!form.id && !mediaFile) {
      notifyError("Please upload a media file.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("courseId", selectedCourseId);
      formData.append("categoryId", form.categoryId);
      if (form?.fees) {
        formData.append("fees", form.fees.toString());
      }

      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      const res = await fetch(
        `${base_api}/api/courses-material${form.id ? `/${form.id}` : "/add"}`,
        {
          method: form.id ? "PUT" : "POST",
          body: formData,
        }
      );

      const result = await res.json();

      if (res.ok) {
        notifySuccess(
          `Material ${form.id ? "updated" : "added"} successfully!`
        );
        setForm(null);
        setMediaFile(null);
        setSelectedCategoryId("");
        setSelectedCourseId("");
        fetchMaterials();
      } else {
        throw new Error(result.message || "Failed to submit material.");
      }
    } catch (error: any) {
      console.error("Error submitting material:", error);
      notifyError(error.message || "Error submitting course material.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (material: CourseMaterial) => {
    setForm(material);
    setSelectedCourseId(material.courseId);
    const course = courses.find((c) => c.id === material.courseId);
    if (course) {
      setSelectedCategoryId(course.categoryTypeId);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSubmitting(true);
      const res = await fetch(`${base_api}/api/courses-material/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok) {
        notifySuccess("Material deleted successfully.");
        fetchMaterials();
      } else {
        notifyError(result.message || "Failed to delete material.");
      }
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      notifyError("Error deleting course material.");
      setSubmitting(false);
    }
  };

  const filteredMaterials = materials.filter((material) =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCategory = categoryTypes.find(
    (cat) => cat.id === selectedCategoryId
  );

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#8B5CF6] p-6 rounded-lg">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Course Materials
        </h1>
        <p className="text-white/80 mb-4">
          Manage and organize your course materials
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search materials..."
              className="w-full sm:w-[300px] h-10 pl-10 pr-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-white/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
            onClick={() =>
              setForm({
                id: "",
                title: "",
                description: "",
                fees: "",
                media: { name: "", path: "", type: "" },
                courseId: "",
                categoryId: "",
              })
            }
            className="px-4 py-2 bg-white text-[#8B5CF6] rounded-lg hover:bg-white/90 transition-colors font-medium flex items-center gap-2"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Material
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5CF6] mx-auto"></div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Type
            </label>
            <ReactSelect
              value={
                selectedCategory
                  ? { value: selectedCategoryId, label: selectedCategory.name }
                  : null
              }
              onChange={(selectedOption) => {
                setSelectedCategoryId(selectedOption?.value || "");
              }}
              options={categoryTypes.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              placeholder="Select Category Type"
              className="basic-select"
              classNamePrefix="select"
              isDisabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <ReactSelect
              value={
                selectedCourse
                  ? { value: selectedCourseId, label: selectedCourse.title }
                  : null
              }
              onChange={(selectedOption) => {
                setSelectedCourseId(selectedOption?.value || "");
              }}
              options={filteredCourses.map((course) => ({
                value: course.id,
                label: course.title,
              }))}
              placeholder="Select Course"
              className="basic-select"
              classNamePrefix="select"
            />
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  TITLE
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  DESCRIPTION
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  FEES
                </th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">{material.title}</td>
                  <td className="py-4 px-6">{material.description}</td>
                  <td className="py-4 px-6">{material.fees}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleEdit(material)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      <svg
                        className="h-5 w-5 inline"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={submitting}
                    >
                      <svg
                        className="h-5 w-5 inline"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {form && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {form.id ? "Edit" : "Add"} Course Material
                </h2>
                <button
                  onClick={() => {
                    setForm(null);
                    setMediaFile(null);
                    setSelectedCategoryId("");
                    setSelectedCourseId("");
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Type
                    </label>
                    <ReactSelect
                      value={
                        selectedCategory
                          ? {
                              value: selectedCategoryId,
                              label: selectedCategory.name,
                            }
                          : null
                      }
                      onChange={(option) =>
                        setSelectedCategoryId(option?.value || "")
                      }
                      options={categoryTypes.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                      }))}
                      placeholder="Select Category Type"
                      className="basic-select"
                      classNamePrefix="select"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course
                    </label>
                    <ReactSelect
                      value={
                        selectedCourse
                          ? {
                              value: selectedCourseId,
                              label: selectedCourse.title,
                            }
                          : null
                      }
                      onChange={(option) =>
                        setSelectedCourseId(option?.value || "")
                      }
                      options={filteredCourses.map((course) => ({
                        value: course.id,
                        label: course.title,
                      }))}
                      placeholder="Select Course"
                      className="basic-select"
                      classNamePrefix="select"
                      isDisabled={!selectedCategoryId}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <ReactSelect
                      value={
                        categories.find((cat) => cat.id === form.categoryId)
                          ? {
                              value: form.categoryId,
                              label: categories.find(
                                (cat) => cat.id === form.categoryId
                              )?.name,
                            }
                          : null
                      }
                      onChange={(option) =>
                        setForm((prev) => ({
                          ...prev!,
                          categoryId: option?.value || "",
                        }))
                      }
                      options={categories.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                      }))}
                      placeholder="Select Category"
                      isDisabled={!selectedCategoryId}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title || ""}
                      onChange={handleChange}
                      placeholder="Enter title"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fees
                    </label>
                    <input
                      type="number"
                      name="fees"
                      value={form.fees || ""}
                      onChange={handleChange}
                      placeholder="Enter fees"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description || ""}
                      onChange={handleChange}
                      placeholder="Enter description"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={4}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Media
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 border rounded-md flex items-center justify-center bg-gray-50">
                      {form.id && form.media?.path ? (
                        <DefaultUploadImg img={form.media.path} wh={96} />
                      ) : (
                        <DefaultUploadImg wh={96} />
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="product_img"
                        className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        Upload Image
                      </label>
                      <input
                        onChange={handleMediaUpload}
                        type="file"
                        name="image"
                        id="product_img"
                        className="hidden"
                        accept="image/*"
                        required={!form.id}
                      />
                      {mediaFile && (
                        <p className="mt-2 text-sm text-gray-500">
                          {mediaFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setForm(null);
                      setMediaFile(null);
                      setSelectedCategoryId("");
                      setSelectedCourseId("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      submitting || !selectedCategoryId || !selectedCourseId
                    }
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                      submitting || !selectedCategoryId || !selectedCourseId
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {submitting ? "Saving..." : "Save"}
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

export default CourseMaterialManagement;
