"use client";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { notifySuccess, notifyError } from "@/utils/toast";

interface Course {
  id: string;
  title: string;
  categoryTypeId: string;
}

interface CourseMaterial {
  id: string;
  title: string;
  description: string;
  fees: string;
  media: { name: string; path: string; type: string };
  courseId: string;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
  categoryTypeId: string;
}

const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

const CourseMaterialManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [form, setForm] = useState<CourseMaterial | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

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

  const fetchCategories = async (categoryTypeId: string) => {
    try {
      const res = await fetch(
        `${base_api}/api/categories/category-by-type/${categoryTypeId}`
      );
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        notifyError(data.message || "Failed to fetch categories.");
      }
    } catch (error) {
      console.error(error);
      notifyError("Error fetching categories.");
    }
  };

  const fetchMaterials = async () => {
    try {
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
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const selectedCourse = courses.find(
      (course) => course.id === selectedCourseId
    );
    if (selectedCourse?.categoryTypeId) {
      fetchCategories(selectedCourse.categoryTypeId);
    }
    fetchMaterials();
  }, [selectedCourseId]);

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
    e.preventDefault();
    if (!form || !mediaFile || !selectedCourseId || !selectedCategoryId) {
      notifyError("Please complete all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (
          value &&
          key !== "id" &&
          key !== "media" &&
          key !== "courseId" &&
          key !== "categoryId"
        ) {
          formData.append(key, value);
        }
      });
      formData.append("media", mediaFile);
      formData.append("courseId", selectedCourseId);
      formData.append("categoryId", selectedCategoryId);

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
        fetchMaterials();
      } else {
        notifyError(result.message || "Failed to submit material.");
      }
    } catch (error) {
      console.error(error);
      notifyError("Error submitting course material.");
    }
  };

  const handleEdit = async (material: CourseMaterial) => {
    setForm(material);
    setSelectedCourseId(material.courseId);
    const course = courses.find((c) => c.id === material.courseId);
    if (course?.categoryTypeId) {
      await fetchCategories(course.categoryTypeId);
    }
    setSelectedCategoryId(material.categoryId || "");
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${base_api}/api/courses/material/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok) {
        notifySuccess("Material deleted successfully.");
        fetchMaterials();
      } else {
        notifyError(result.message || "Failed to delete material.");
      }
    } catch (error) {
      console.error(error);
      notifyError("Error deleting course material.");
    }
  };

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId
  );
  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <ReactSelect
          className="mb-4 w-full"
          value={
            selectedCourse
              ? { value: selectedCourseId, label: selectedCourse.title }
              : null
          }
          onChange={(selectedOption) => {
            setSelectedCourseId(selectedOption?.value || "");
            setSelectedCategoryId("");
          }}
          options={courses.map((course) => ({
            value: course.id,
            label: course.title,
          }))}
          placeholder="Select Course"
        />
        {categories.length > 0 && (
          <ReactSelect
            className="mb-6 w-full"
            value={
              selectedCategory
                ? { value: selectedCategoryId, label: selectedCategory.name }
                : null
            }
            onChange={(selectedOption) =>
              setSelectedCategoryId(selectedOption?.value || "")
            }
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            placeholder="Select Category"
          />
        )}
      </div>

      <div className="col-span-12 lg:col-span-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white px-8 py-8 rounded-md mb-6"
        >
          <h4 className="text-[22px] mb-4">Add / Edit Course Material</h4>

          <div className="mb-4">
            <input
              type="text"
              name="title"
              value={form?.title || ""}
              onChange={handleChange}
              placeholder="Material Title"
              className="input input-bordered w-full h-[44px] px-4"
              required
            />
          </div>

          <div className="mb-4">
            <textarea
              name="description"
              value={form?.description || ""}
              onChange={handleChange}
              placeholder="Material Description"
              className="textarea textarea-bordered w-full px-4"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="number"
              name="fees"
              value={form?.fees || ""}
              onChange={handleChange}
              placeholder="Fees"
              className="input input-bordered w-full h-[44px] px-4"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleMediaUpload}
              className="file-input file-input-bordered w-full"
              required={!form?.id}
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="tp-btn px-6 py-2">
              {form?.id ? "Update Material" : "Add Material"}
            </button>

            {form?.id && (
              <button
                type="button"
                className="tp-btn bg-gray-200 text-gray-800 hover:bg-gray-300 px-6 py-2"
                onClick={() => {
                  setForm(null);
                  setMediaFile(null);
                  setSelectedCategoryId("");
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white px-8 py-6 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Course Materials</h3>
          {materials.length === 0 ? (
            <p className="text-gray-500">
              No materials available for this course.
            </p>
          ) : (
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="text-left">Image</th>
                  <th className="text-left">Title</th>
                  <th className="text-left">Fees</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material.id}>
                    <td>
                      <img
                        src={material.media.path}
                        alt=""
                        className="w-16 h-12 object-cover border rounded"
                      />
                    </td>
                    <td>{material.title}</td>
                    <td>{material.fees}</td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEdit(material)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(material.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseMaterialManagement;
