"use client";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";


interface Course {
  id: string;
  title: string;
}

interface CourseMaterial {
  id: string;
  title: string;
  description: string;
  duration: string;
  fees: string;
  media: { name: string; path: string; type: string };
  courseId: string;
}

const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

const CourseMaterialManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [form, setForm] = useState<CourseMaterial | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  console.log(selectedCourseId);

  const fetchCourses = async () => {
    const res = await fetch(`${base_api}/api/courses`);
    const data = await res.json();
    if (data.success) setCourses(data.data);
  };

  const fetchMaterials = async () => {
    if (!selectedCourseId) return;
    const res = await fetch(
      `${base_api}/api/courses/material${
        selectedCourseId !== "" ? `/courseId/${selectedCourseId}` : ""
      }`
    );
    const data = await res.json();
    if (data.success) {
      const filtered = data.data.filter(
        (mat: CourseMaterial) => mat.courseId === selectedCourseId
      );
      setMaterials(filtered);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
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
    if (!form || !mediaFile || !selectedCourseId) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value && key !== "id" && key !== "media" && key !== "courseId") {
        formData.append(key, value);
      }
    });
    formData.append("media", mediaFile);
    formData.append("courseId", selectedCourseId);

    const res = await fetch(
      `${base_api}/api/courses/material${form.id ? `/${form.id}` : "/add"}`,
      {
        method: form.id ? "PUT" : "POST",
        body: formData,
      }
    );

    if (res.ok) {
      setForm(null);
      setMediaFile(null);
      fetchMaterials();
    }
  };

  const handleEdit = (material: CourseMaterial) => {
    setForm(material);
  };

  const handleDelete = async (id: string) => {
    await fetch(`${base_api}/api/courses/material/${id}`, { method: "DELETE" });
    fetchMaterials();
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <ReactSelect
          className="mb-6 w-full"
          value={
            courses.find((course) => course.id === selectedCourseId) && {
              value: selectedCourseId,
              label: courses.find((course) => course.id === selectedCourseId)
                ?.title,
            }
          }
          onChange={(selectedOption) =>
            setSelectedCourseId(selectedOption?.value || "")
          }
          options={courses.map((course) => ({
            value: course.id,
            label: course.title,
          }))}
        />
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
              type="text"
              name="duration"
              value={form?.duration || ""}
              onChange={handleChange}
              placeholder="Duration"
              className="input input-bordered w-full h-[44px] px-4"
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
          <button type="submit" className="tp-btn px-6 py-2">
            {form?.id ? "Update Material" : "Add Material"}
          </button>
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
