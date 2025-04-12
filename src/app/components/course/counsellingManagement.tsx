"use client";

import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import Image from "next/image";
import { notifyError, notifySuccess } from "@/utils/toast";
import DefaultUploadImg from "../products/add-product/default-upload-img";
// import { notifyError, notifySuccess } from "@/utils/notify";

interface Counselling {
  id: string;
  title: string;
  description: string;
  price: number;
  media: any;
  categoryId: string;
  categoryTypeId: string;
  category?: any;
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

const CounsellingManagement: React.FC = () => {
  const [items, setItems] = useState<Counselling[]>([]);
  const [form, setForm] = useState<Partial<Counselling>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${base_api}/api/career-counselling`);
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      notifyError("Failed to load counselling items.");
    }
  };

  const fetchCategoryTypes = async () => {
    try {
      const res = await fetch(`${base_api}/api/category-types`);
      const data = await res.json();
      if (data.success) setCategoryTypes(data.data);
    } catch (err) {
      notifyError("Failed to load category types.");
    }
  };

  const fetchCategories = async () => {
    if (!form.categoryTypeId) return;
    try {
      const res = await fetch(
        `${base_api}/api/categories/category-by-type/${form.categoryTypeId}`
      );
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      notifyError("Failed to load categories.");
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategoryTypes();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [form.categoryTypeId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.price ||
      !form.categoryId ||
      !form.categoryTypeId ||
      (!form.id && !mediaFile)
    ) {
      notifyError("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value);
    });
    if (mediaFile) formData.append("media", mediaFile);

    const endpoint = form.id
      ? `${base_api}/api/career-counselling/${form.id}`
      : `${base_api}/api/career-counselling`;
    const method = form.id ? "PUT" : "POST";

    try {
      setSubmitting(true);

      const res = await fetch(endpoint, { method, body: formData });
      const data = await res.json();
      if (data.success) {
        notifySuccess(data.message || "Saved successfully");
        setForm({});
        setMediaFile(null);
        fetchItems();
      } else {
        notifyError(data.message || "Something went wrong");
      }
      setSubmitting(false);
    } catch (err) {
      notifyError("Something went wrong");
      setSubmitting(false);
    }
  };

  const handleEdit = (item: Counselling) => {
    setForm(item);
  };

  const handleDelete = async (id: string) => {
    try {
      setSubmitting(true);

      const res = await fetch(`${base_api}/api/career-counselling/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        notifySuccess("Deleted successfully");
        fetchItems();
      } else {
        notifyError("Delete failed");
      }
      setSubmitting(false);
    } catch (err) {
      notifyError("Delete error");
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
          <h4 className="text-[22px] mb-4">Add / Edit Counselling</h4>
          <input
            type="text"
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            placeholder="Title"
            className="input input-bordered w-full h-[44px] px-4 mb-4"
            required
          />
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            placeholder="Description"
            className="textarea textarea-bordered w-full px-4 mb-4"
          />
          <input
            type="number"
            name="price"
            value={form.price || ""}
            onChange={handleChange}
            placeholder="Price"
            className="input input-bordered w-full h-[44px] px-4 mb-4"
            required
          />
          {/* <input type="file" onChange={handleFileChange} className="mb-4" /> */}
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
                onChange={handleFileChange}
                type="file"
                name="image"
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

          <ReactSelect
            className="w-full mb-4"
            value={
              categoryTypes.find((t) => t.id === form.categoryTypeId) && {
                value: form.categoryTypeId,
                label: categoryTypes.find((t) => t.id === form.categoryTypeId)
                  ?.name,
              }
            }
            onChange={(option) =>
              handleChange({
                target: {
                  name: "categoryTypeId",
                  value: option?.value || "",
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

          <ReactSelect
            className="w-full mb-4"
            value={
              categories.find((c) => c.id === form.categoryId) && {
                value: form.categoryId,
                label: categories.find((c) => c.id === form.categoryId)?.name,
              }
            }
            onChange={(option) =>
              handleChange({
                target: {
                  name: "categoryId",
                  value: option?.value || "",
                },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Select Category"
            isClearable
          />

          <button
            type="submit"
            className="tp-btn px-6 py-2"
            disabled={submitting}
          >
            {form.id ? "Update" : "Add"} 
          </button>
        </form>
      </div>

      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white px-8 py-6 rounded-md">
          <h3 className="text-xl font-semibold mb-4">All Counselling</h3>
          {items.length === 0 ? (
            <p className="text-gray-500">No counselling available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-100 p-4 rounded-md shadow-sm flex flex-col gap-2 mb-4"
                >
                  <div className="flex items-center justify-between">
                    <h4
                      className="text-lg font-semibold truncate max-w-[220px]"
                      title={item.title}
                    >
                      {item.title}
                    </h4>
                    <span className="text-primary font-medium">
                      ₹{item.price}
                    </span>
                  </div>

                  <p
                    className="text-md text-gray-500 truncate max-w-[250px]"
                    title={item.category?.name}
                  >
                    {item.category?.name || "—"}
                  </p>

                  <div className="flex justify-end gap-2">
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounsellingManagement;
