"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Upload, Delete, Edit, Plus } from "@/svg";
import Sidebar from "@/layout/sidebar";

interface BannerFormData {
  title: string;
  description: string;
  image: File | null;
  link: string;
  status: boolean;
}

interface Banner {
  id: string;
  title: string;
  description: string;
  image: string; // base64 string
  link: string;
  status: boolean;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [sideMenu, setSideMenu] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BannerFormData>();

  useEffect(() => {
    fetch('/api/banner')
      .then(res => res.json())
      .then(data => setBanners(Array.isArray(data) ? data : []));
  }, []);

  const openAddModal = () => {
    setEditBanner(null);
    reset();
    setImagePreview("");
    setShowModal(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditBanner(banner);
    setValue("title", banner.title);
    setValue("description", banner.description);
    setValue("link", banner.link);
    setValue("status", banner.status);
    setImagePreview(banner.image);
    setShowModal(true);
  };

  const onSubmit = async (data: BannerFormData) => {
    let base64Image = imagePreview;
    if (data.image) {
      base64Image = await toBase64(data.image);
    }
    if (editBanner) {
      setBanners((prev) =>
        Array.isArray(prev)
          ? prev.map((b) =>
              b.id === editBanner.id
                ? {
                    ...b,
                    title: data.title,
                    description: data.description,
                    link: data.link,
                    status: data.status,
                    image: base64Image,
                  }
                : b
            )
          : []
      );
    } else {
      setBanners((prev) => [
        ...(Array.isArray(prev) ? prev : []),
        {
          id: generateId(),
          title: data.title,
          description: data.description,
          link: data.link,
          status: data.status,
          image: base64Image,
        },
      ]);
    }
    setShowModal(false);
    setEditBanner(null);
    reset();
    setImagePreview("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        console.log('Preview:', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }
  };

  function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  return (
    <div className="flex">
      <Sidebar sideMenu={sideMenu} setSideMenu={setSideMenu} />
      <div className="flex-1 p-6 ml-[300px]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Banner Management</h2>
            <p className="text-gray-600">Add, edit, and delete website banners</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="w-5 h-5" />
            Add Banner
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {banners.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      No banners found.
                    </td>
                  </tr>
                )}
                {Array.isArray(banners) && banners.map((banner) => (
                  <tr key={banner.id}>
                    <td className="px-4 py-3">
                      {banner.image ? (
                        <div className="w-16 h-10 relative">
                          <Image
                            src={banner.image}
                            alt={banner.title}
                            fill
                            unoptimized
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-300">No Image</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{banner.title}</td>
                    <td className="px-4 py-3 text-gray-700">{banner.description}</td>
                    <td className="px-4 py-3 text-blue-600 underline break-all">
                      {banner.link ? (
                        <a href={banner.link} target="_blank" rel="noopener noreferrer">{banner.link}</a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${banner.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {banner.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(banner)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Delete className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editBanner ? "Edit Banner" : "Add Banner"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditBanner(null);
                      reset();
                      setImagePreview("");
                    }}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("title", { required: "Title is required" })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter banner title"
                    />
                    {errors.title && (
                      <p className="mt-1.5 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      rows={3}
                      placeholder="Enter banner description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Image <span className="text-red-500">*</span>
                    </label>
                    <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg transition-colors ${imagePreview ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                      <div className="space-y-2 text-center">
                        {imagePreview ? (
                          <div className="relative w-full h-48 bg-white rounded-lg overflow-hidden">
                            <Image
                              src={imagePreview}
                              alt="Banner preview"
                              fill
                              unoptimized
                              className="object-contain"
                            />
                            <img src={imagePreview} alt="Banner preview fallback" style={{ maxHeight: 192, maxWidth: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0, zIndex: 10, pointerEvents: 'none' }} />
                            <button
                              type="button"
                              onClick={() => setImagePreview("")}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600 justify-center">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link
                    </label>
                    <input
                      type="text"
                      {...register("link")}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter banner link (optional)"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("status")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditBanner(null);
                      reset();
                      setImagePreview("");
                    }}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  >
                    {editBanner ? "Update Banner" : "Save Banner"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 