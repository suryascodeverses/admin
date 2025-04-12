"use client";

import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { notifySuccess, notifyError } from "@/utils/toast"; // adjust if needed

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

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white px-8 py-8 rounded-md mb-6"
        >
          <h4 className="text-[22px] mb-4">Add / Edit Course</h4>
          <div className="mb-4">
            <input
              type="text"
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              placeholder="Course Title"
              className="input input-bordered w-full h-[44px] px-4"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              placeholder="Course Description"
              className="textarea textarea-bordered w-full px-4"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="video"
              value={form.video || ""}
              onChange={handleChange}
              placeholder="Video URL"
              className="input input-bordered w-full h-[44px] px-4"
              required
            />
          </div>
          <div className="mb-4">
            <ReactSelect
              className="w-full mb-4"
              value={
                categoryTypes.find(
                  (type) => type.id === form?.categoryTypeId
                ) && {
                  value: form?.categoryTypeId,
                  label: categoryTypes.find(
                    (type) => type.id === form?.categoryTypeId
                  )?.name,
                }
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
              isClearable
            />
          </div>
          {/* <div className="mb-4">
            <ReactSelect
              className="w-full mb-4"
              value={
                categories.find((cat) => cat.id === form?.categoryId) && {
                  value: form?.categoryId,
                  label: categories.find((cat) => cat.id === form?.categoryId)
                    ?.name,
                }
              }
              onChange={(selectedOption) =>
                handleChange({
                  target: {
                    name: "categoryId",
                    value: selectedOption?.value || "",
                  },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              options={categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              placeholder="Select Category"
              isClearable
            />
          </div> */}
          <button
            type="submit"
            className="tp-btn px-6 py-2"
            disabled={submitting}
          >
            {form.id ? "Update Course" : "Add Course"}
          </button>
        </form>
      </div>

      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white px-8 py-6 rounded-md">
          <h3 className="text-xl font-semibold mb-4">All Courses</h3>
          {courses.length === 0 ? (
            <p className="text-gray-500">No courses available.</p>
          ) : (
            <table className="table w-full">
              <thead>
                <tr>
                  {/* <th className="text-left">Video URL</th> */}
                  <th className="text-left">Name</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    {/* <td className="text-blue-600 truncate max-w-[180px]">
                      <a href={course.video} target="_blank" rel="noopener noreferrer">
                        {course.video}
                      </a>
                    </td> */}
                    <td>{course.title}</td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEdit(course)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(course.id)}
                        disabled={submitting}
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

export default CourseManagement;
