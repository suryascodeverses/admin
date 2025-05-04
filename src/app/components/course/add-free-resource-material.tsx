"use client";
import { notifyError, notifySuccess } from "@/utils/toast";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import DefaultUploadImg from "../products/add-product/default-upload-img";
// import { notifyError, notifySuccess } from "@/utils/toast";

const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

const FreeResourceMaterialManagement = () => {
  const [form, setForm] = useState<any>({});
  const [edit, setEdit] = useState<any>(false);
  const [materials, setMaterials] = useState<any[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [categoryTypes, setCategoryTypes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [freeResources, setFreeResources] = useState<any[]>([]);

  const fetchCategoryTypes = async () => {
    const res = await fetch(`${base_api}/api/category-types`);
    const data = await res.json();
    if (data.success) setCategoryTypes(data.data);
  };

  const fetchCategories = async (categoryTypeId: string) => {
    const res = await fetch(
      `${base_api}/api/categories/category-by-type/${categoryTypeId}`
    );
    const data = await res.json();
    if (data.success) setCategories(data.data);
  };

  const fetchFreeResources = async () => {
    const res = await fetch(`${base_api}/api/free-resources`);
    const data = await res.json();
    if (data.success) setFreeResources(data.data);
  };

  const fetchMaterials = async () => {
    const res = await fetch(`${base_api}/api/free-resource-materials`);
    const data = await res.json();
    if (data.success) setMaterials(data.data);
  };

  useEffect(() => {
    fetchCategoryTypes();
    fetchFreeResources();
    fetchMaterials();
  }, []);

  useEffect(() => {
    if (form.categoryTypeId) fetchCategories(form.categoryTypeId);
  }, [form.categoryTypeId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [name]: value }));
    if (name === "categoryTypeId")
      setForm((prev: any) => ({ ...prev, categoryId: "" }));
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setMediaFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, categoryId, categoryTypeId, freeResourceId } = form;
    if (!title || !categoryId || !categoryTypeId || !freeResourceId) {
      return notifyError("All fields except media are required.");
    }

    const selectedResource = freeResources.find((r) => r.id === freeResourceId);
    if (!selectedResource) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("categoryId", categoryId);
    formData.append("categoryTypeId", categoryTypeId);
    formData.append("freeResourceId", freeResourceId);
    formData.append("type", selectedResource.type);

    if (selectedResource.type === "video") {
      if (!form.media) return notifyError("Video URL is required.");
      formData.append("media", form.media);
    } else {
      if (!mediaFile && !form.id) return notifyError("PDF file is required.");
      if (mediaFile) formData.append("media", mediaFile);
    }
    setSubmitting(true);

    const res = await fetch(
      `${base_api}/api/free-resource-materials${form.id ? `/${form.id}` : ""}`,
      {
        method: form.id ? "PUT" : "POST",
        body: formData,
      }
    );
    setSubmitting(false);
    const retult = await res.json();
    // debugger
    if (res.ok) {
      notifySuccess(`Material ${form.id ? "updated" : "added"} successfully`);
      setForm({});
      setMediaFile(null);
      fetchMaterials();
      setEdit(false);
    } else notifyError(retult.message ?? "Something went wrong");
  };

  const handleEdit = (mat: any) => {
    setEdit(true);
    setForm(mat);
  };

  const handleDelete = async (id: string) => {
    setSubmitting(true);

    const res = await fetch(`${base_api}/api/free-resource-materials/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      notifySuccess("Deleted successfully");
      fetchMaterials();
    } else notifyError("Delete failed");
    setSubmitting(false);
  };

  const handleAddNew = () => {
    setForm({});
    setMediaFile(null);
    setEdit(true);
  };

  return (
    <div>
      {/* Header Section */}
      {/* <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>Home</span>
        <span>•</span>
        <span>Course Material</span>
      </div> */}

      {/* Course Materials Header */}
      <div className="bg-[#7C3AED] rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">Free Resources Materials</h2>
        <p className="text-white/80 mb-4">Manage and organize your Free Resources Materials</p>
        
        <div className="flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white/10 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
            onClick={handleAddNew}
            className="bg-white text-[#7C3AED] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/90 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Material
          </button>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Free Resource</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {materials
              .filter(mat => mat.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((mat) => (
                <tr key={mat.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mat.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mat.materialFreeResource?.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(mat)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(mat.id)}
                        disabled={submitting}
                        className="text-red-600 hover:text-red-800"
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

      {/* Add/Edit Form Modal */}
      {edit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold">{form?.id ? 'Edit' : 'Add'} Material</h4>
              <button
                onClick={() => setEdit(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={form.title || ""}
                onChange={handleChange}
                placeholder="Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                required
              />

              <ReactSelect
                placeholder="Select Category Type"
                className="mb-4"
                value={form.categoryTypeId ? {
                  value: form.categoryTypeId,
                  label: categoryTypes.find((c) => c.id === form.categoryTypeId)?.name,
                } : null}
                onChange={(opt) => handleSelectChange("categoryTypeId", opt?.value)}
                options={categoryTypes.map((c) => ({ value: c.id, label: c.name }))}
              />

              <ReactSelect
                placeholder="Select Category"
                className="mb-4"
                value={form.categoryId ? {
                  value: form.categoryId,
                  label: categories.find((c) => c.id === form.categoryId)?.name,
                } : null}
                onChange={(opt) => handleSelectChange("categoryId", opt?.value)}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />

              <ReactSelect
                placeholder="Select Free Resource"
                className="mb-4"
                value={form.freeResourceId ? {
                  value: form.freeResourceId,
                  label: freeResources.find((r) => r.id === form.freeResourceId)?.title,
                } : null}
                onChange={(opt) => handleSelectChange("freeResourceId", opt?.value)}
                options={freeResources.map((r) => ({ value: r.id, label: r.title }))}
              />

              {freeResources.find((r) => r.id === form.freeResourceId)?.type === "video" ? (
                <input
                  type="text"
                  name="media"
                  value={edit ? form.media?.path : form.media}
                  onChange={handleChange}
                  placeholder="Video URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                  required
                />
              ) : freeResources.find((r) => r.id === form.freeResourceId)?.type === "pdf" ? (
                <div className="space-y-2">
                  <input
                    onChange={handleMediaUpload}
                    type="file"
                    accept="application/pdf"
                    id="product_img"
                    className="hidden"
                    required={!form?.id}
                  />
                  <label
                    htmlFor="product_img"
                    className="block w-full px-4 py-2 text-center border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    Upload PDF
                  </label>
                  {form?.id && form.media?.path && !mediaFile && (
                    <p className="text-sm text-gray-600">
                      Current file: {form.media.path.split('/').pop()}
                    </p>
                  )}
                  {mediaFile && (
                    <p className="text-sm text-gray-600">
                      New file selected: {mediaFile.name}
                    </p>
                  )}
                </div>
              ) : null}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setEdit(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#7C3AED] text-white px-6 py-2 rounded-lg hover:bg-[#6D28D9] disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : form?.id ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeResourceMaterialManagement;
