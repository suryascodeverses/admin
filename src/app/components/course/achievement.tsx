"use client";

import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { notifyError, notifySuccess } from "@/utils/toast";
import DefaultUploadImg from "../products/add-product/default-upload-img";

const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Achievement {
  id: string;
  title: string;
  type: "video" | "gallery";
  year: number;
  media: {
    path: string;
    type: string;
  };
}

// Modal Component
const AchievementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  form: Partial<Achievement>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Achievement>>>;
  mediaFile: File | null;
  setMediaFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  submitting: boolean;
}> = ({ isOpen, onClose, form, setForm, mediaFile, setMediaFile, handleSubmit, submitting }) => {
  if (!isOpen) return null;

  const typeOptions = [
    { value: "video", label: "Video" },
    { value: "gallery", label: "Gallery" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl mx-4">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">
            {form.id ? "Edit" : "Add"} Material
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title || ""}
                onChange={handleChange}
                placeholder="Achievement Title"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <ReactSelect
                className="w-full"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "42px",
                  }),
                }}
                value={
                  typeOptions.find((option) => option.value === form.type) || null
                }
                onChange={(selectedOption) => {
                  handleChange({
                    target: {
                      name: "type",
                      value: selectedOption?.value || "",
                    },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                options={typeOptions}
                placeholder="Select Type"
                isClearable
                name="type"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={form.year || ""}
                onChange={handleChange}
                placeholder="Year (e.g., 2024)"
                min={1000}
                max={9999}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {form.type === "video" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <input
                  type="text"
                  name="media"
                  value={form.media?.path || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      media: { path: e.target.value, type: "video" },
                    }))
                  }
                  placeholder="Video URL"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required={!form.id}
                />
              </div>
            )}

            {form.type === "gallery" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <div className="text-center flex items-center justify-center my-2">
                  {form?.id ? (
                    <DefaultUploadImg img={form.media?.path} wh={100} />
                  ) : (
                    <DefaultUploadImg wh={100} />
                  )}
                </div>
                <div>
                  <input
                    onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                    type="file"
                    name="media"
                    id="product_img"
                    className="hidden"
                    required={!form?.id}
                  />
                  <label
                    htmlFor="product_img"
                    className="block w-full text-center py-2 px-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    Upload Image
                  </label>
                </div>
                {mediaFile && (
                  <p className="mt-2 text-sm text-gray-600">{mediaFile.name}</p>
                )}
              </div>
            )}
          </div>
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#7C3AED] text-white rounded-lg font-medium hover:bg-[#6D28D9] disabled:opacity-50 flex items-center gap-2"
              disabled={submitting}
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
              {submitting ? "Adding..." : "Add Material"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Achievement: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [form, setForm] = useState<Partial<Achievement>>({});
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const typeOptions = [
    { value: "video", label: "Video" },
    { value: "gallery", label: "Gallery" },
  ];

  const fetchAchievements = async () => {
    try {
      const res = await fetch(`${base_api}/api/achievements`);
      const data = await res.json();
      if (data.success) {
        setAchievements(data.data);
      } else {
        notifyError("Failed to fetch achievements.");
      }
    } catch (error) {
      console.error(error);
      notifyError("An error occurred while fetching achievements.");
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", form.title || "");
      formData.append("type", form.type || "");
      formData.append("year", String(form.year || ""));

      if (form.type === "video") {
        formData.append("media", form.media?.path || "");
      } else if (mediaFile) {
        formData.append("media", mediaFile);
      }

      const endpoint = form.id
        ? `${base_api}/api/achievements/${form.id}`
        : `${base_api}/api/achievements`;
      const method = form.id ? "PUT" : "POST";
      setSubmitting(true);

      const res = await fetch(endpoint, {
        method,
        body: formData,
      });
      setSubmitting(false);
      const result = await res.json();
      if (!res.ok) notifyError(result.message ?? "Failed to submit.");

      setForm({});
      setMediaFile(null);
      fetchAchievements();

      notifySuccess(
        form.id
          ? "Achievement updated successfully."
          : "Achievement added successfully."
      );
    } catch (error) {
      setSubmitting(false);
      console.error(error);
      notifyError("Failed to submit achievement. Please try again.");
    }
  };

  const handleEdit = (item: Achievement) => {
    setForm({
      id: item.id,
      title: item.title,
      type: item.type,
      year: item.year,
      media: item.media,
    });
    setMediaFile(null);
  };

  const handleDelete = async (id: string) => {
    try {
      setSubmitting(true);
      const res = await fetch(`${base_api}/api/achievements/${id}`, {
        method: "DELETE",
      });
      setSubmitting(false);

      if (!res.ok) throw new Error("Failed to delete");

      fetchAchievements();
      notifySuccess("Achievement deleted successfully.");
    } catch (error) {
      console.error(error);
      notifyError("Failed to delete achievement.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-[#7C3AED] px-6 py-8 rounded-lg mx-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Course Materials</h1>
            <p className="text-white/80">Manage and organize your course materials</p>
          </div>
          <button 
            onClick={() => {
              setForm({});
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-white text-[#7C3AED] rounded-lg font-medium flex items-center gap-2 hover:bg-white/90 transition-colors"
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
            Add Material
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg mx-6 p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">TITLE</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">TYPE</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">YEAR</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((item) => (
              <tr key={item.id} className="border-b last:border-b-0">
                <td className="py-4 px-4">{item.title}</td>
                <td className="py-4 px-4">{item.type}</td>
                <td className="py-4 px-4">{item.year}</td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleEdit(item);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={submitting}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AchievementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setForm({});
          setMediaFile(null);
        }}
        form={form}
        setForm={setForm}
        mediaFile={mediaFile}
        setMediaFile={setMediaFile}
        handleSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
};

export default Achievement;
