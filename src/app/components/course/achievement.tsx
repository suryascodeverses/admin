"use client";

import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";

// Assuming these are defined globally or imported
import { notifyError, notifySuccess } from "@/utils/toast"; // adjust path as needed
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

const Achievement: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [form, setForm] = useState<Partial<Achievement>>({});
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white px-8 py-8 rounded-md mb-6"
        >
          <h4 className="text-[22px] mb-4">Add / Edit Achievement</h4>
          <div className="mb-4">
            <input
              type="text"
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              placeholder="Achievement Title"
              className="input input-bordered w-full h-[44px] px-4"
              required
            />
          </div>
          <div className="mb-4">
            <ReactSelect
              className="w-full mb-4"
              styles={{
                control: (base) => ({
                  ...base,
                  height: "44px",
                  paddingLeft: "0.75rem", // px-4
                }),
              }}
              value={
                typeOptions.find((option) => option.value === form.type) || null
              }
              onChange={(selectedOption) => {
                const createFakeEvent = (name: string, value: string) =>
                  ({
                    target: {
                      name,
                      value,
                    },
                  } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
                // debugger;
                handleChange(
                  createFakeEvent("type", selectedOption?.value || "")
                );
              }}
              options={typeOptions}
              placeholder="Select Type"
              isClearable
              name="type"
            />

            {/* <select
              name="type"
              value={form.type || ""}
              onChange={handleChange}
              className="select select-bordered w-full h-[44px] px-4"
              required
            >
              <option value="">Select Type</option>
              <option value="video">Video</option>
              <option value="gallery">Gallery</option>
            </select> */}
          </div>
          <div className="mb-4">
            <input
              type="number"
              name="year"
              value={form.year || ""}
              onChange={handleChange}
              placeholder="Year (e.g., 2024)"
              min={1000}
              max={9999}
              className="input input-bordered w-full h-[44px] px-4"
              required
            />
          </div>

          {form.type === "video" && (
            <div className="mb-4">
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
                className="input input-bordered w-full h-[44px] px-4"
                required={!form.id}
              />
            </div>
          )}

          {form.type === "gallery" && (
            <div className="my-8">
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
                  // accept="image/*"
                  type="file"
                  name="media"
                  id="product_img"
                  className="hidden"
                  required={!form?.id}
                />
                <label
                  htmlFor="product_img"
                  className="text-tiny w-full inline-block py-1 px-4 rounded-md border border-gray6 text-center hover:cursor-pointer hover:bg-theme hover:text-white hover:border-theme transition"
                >
                  Upload Image
                </label>
              </div>
              {mediaFile && <span className="text-md"> {mediaFile.name}</span>}
            </div>

            // <div className="mb-4">
            //   <input
            //     type="file"
            //     name="media"
            //     accept="image/*"
            //     onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
            //     className="file-input file-input-bordered w-full"
            //   />
            // </div>
          )}

          <button
            type="submit"
            className="tp-btn px-6 py-2"
            disabled={submitting}
          >
            {form.id ? "Update " : "Add "}
          </button>
        </form>
      </div>

      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white px-8 py-6 rounded-md">
          <h3 className="text-xl font-semibold mb-4">All Achievements</h3>
          {achievements.length === 0 ? (
            <p className="text-gray-500">No achievements available.</p>
          ) : (
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="text-left">Title</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Year</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.type}</td>
                    <td>{item.year}</td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
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

export default Achievement;
