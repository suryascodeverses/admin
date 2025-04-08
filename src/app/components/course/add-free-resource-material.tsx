"use client";
import { notifyError, notifySuccess } from "@/utils/toast";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
// import { notifyError, notifySuccess } from "@/utils/toast";

const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

const FreeResourceMaterialManagement = () => {
  const [form, setForm] = useState<any>({});
  const [materials, setMaterials] = useState<any[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

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

    const res = await fetch(
      `${base_api}/api/free-resource-materials${form.id ? `/${form.id}` : ""}`,
      {
        method: form.id ? "PUT" : "POST",
        body: formData,
      }
    );

    if (res.ok) {
      notifySuccess(`Material ${form.id ? "updated" : "added"} successfully`);
      setForm({});
      setMediaFile(null);
      fetchMaterials();
    } else notifyError("Something went wrong");
  };

  const handleEdit = (mat: any) => setForm(mat);

  const handleDelete = async (id: string) => {
    const res = await fetch(`${base_api}/api/free-resource-materials/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      notifySuccess("Deleted successfully");
      fetchMaterials();
    } else notifyError("Delete failed");
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white px-8 py-8 rounded-md mb-6"
        >
          <h4 className="text-[22px] mb-4">
            Add / Edit Free Resource Material
          </h4>

          <input
            type="text"
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            placeholder="Title"
            className="input input-bordered w-full h-[44px] px-4 mb-4"
            required
          />

          <ReactSelect
            placeholder="Select Category Type"
            className="mb-4"
            value={
              categoryTypes.find((c) => c.id === form.categoryTypeId) && {
                value: form.categoryTypeId,
                label: categoryTypes.find((c) => c.id === form.categoryTypeId)
                  ?.name,
              }
            }
            onChange={(opt) => handleSelectChange("categoryTypeId", opt?.value)}
            options={categoryTypes.map((c) => ({ value: c.id, label: c.name }))}
          />

          <ReactSelect
            placeholder="Select Category"
            className="mb-4"
            value={
              categories.find((c) => c.id === form.categoryId) && {
                value: form.categoryId,
                label: categories.find((c) => c.id === form.categoryId)?.name,
              }
            }
            onChange={(opt) => handleSelectChange("categoryId", opt?.value)}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />

          <ReactSelect
            placeholder="Select Free Resource"
            className="mb-4"
            value={
              freeResources.find((r) => r.id === form.freeResourceId) && {
                value: form.freeResourceId,
                label: freeResources.find((r) => r.id === form.freeResourceId)
                  ?.title,
              }
            }
            onChange={(opt) => handleSelectChange("freeResourceId", opt?.value)}
            options={freeResources.map((r) => ({
              value: r.id,
              label: r.title,
            }))}
          />

          {freeResources.find((r) => r.id === form.freeResourceId)?.type ===
          "video" ? (
            <input
              type="text"
              name="media"
              value={form.media.path || ""}
              onChange={handleChange}
              placeholder="Video URL"
              className="input input-bordered w-full h-[44px] px-4 mb-4"
              required
            />
          ) : (
            <input
              type="file"
              accept="application/pdf"
              onChange={handleMediaUpload}
              className="file-input file-input-bordered w-full mb-4"
              required={!form?.id}
            />
          )}

          <button type="submit" className="tp-btn px-6 py-2">
            {form?.id ? "Update Material" : "Add Material"}
          </button>
        </form>
      </div>

      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white px-8 py-6 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Saved Materials</h3>
          {materials.length === 0 ? (
            <p className="text-gray-500">No materials available.</p>
          ) : (
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="text-left">Title</th>
                  <th className="text-left">Free Resource</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((mat) => (
                  <tr key={mat.id}>
                    <td>{mat.title}</td>
                    <td>
                      {freeResources.find((r) => r.id === mat.freeResourceId)
                        ?.title || "-"}
                    </td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEdit(mat)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(mat.id)}
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

export default FreeResourceMaterialManagement;

// "use client";
// import React, { useEffect, useState } from "react";
// import ReactSelect from "react-select";
// import { notifyError, notifySuccess } from "@/utils/toast";

// const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

// const FreeResourceMaterialManagement = () => {
//   const [form, setForm] = useState<any>({});
//   const [materials, setMaterials] = useState<any[]>([]);
//   const [mediaFile, setMediaFile] = useState<File | null>(null);

//   const [categoryTypes, setCategoryTypes] = useState<any[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [freeResources, setFreeResources] = useState<any[]>([]);

//   const fetchCategoryTypes = async () => {
//     const res = await fetch(`${base_api}/api/category-types`);
//     const data = await res.json();
//     if (data.success) setCategoryTypes(data.data);
//   };

//   const fetchCategories = async (categoryTypeId: string) => {
//     const res = await fetch(
//       `${base_api}/api/categories/category-by-type/${categoryTypeId}`
//     );
//     const data = await res.json();
//     if (data.success) setCategories(data.data);
//   };

//   const fetchFreeResources = async () => {
//     const res = await fetch(`${base_api}/api/free-resources`);
//     const data = await res.json();
//     if (data.success) setFreeResources(data.data);
//   };

//   const fetchMaterials = async () => {
//     const res = await fetch(`${base_api}/api/free-resource-materials`);
//     const data = await res.json();
//     if (data.success) setMaterials(data.data);
//   };

//   useEffect(() => {
//     fetchCategoryTypes();
//     fetchFreeResources();
//     fetchMaterials();
//   }, []);

//   useEffect(() => {
//     if (form.categoryTypeId) fetchCategories(form.categoryTypeId);
//   }, [form.categoryTypeId]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setForm((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setForm((prev: any) => ({ ...prev, [name]: value }));
//     if (name === "categoryTypeId") setForm((prev: any) => ({ ...prev, categoryId: "" }));
//   };

//   const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) setMediaFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const { title, categoryId, categoryTypeId, freeResourceId } = form;
//     if (!title || !categoryId || !categoryTypeId || !freeResourceId) {
//       return notifyError("All fields except media are required.");
//     }

//     const selectedResource = freeResources.find((r) => r.id === freeResourceId);
//     if (!selectedResource) return;

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("categoryId", categoryId);
//     formData.append("categoryTypeId", categoryTypeId);
//     formData.append("freeResourceId", freeResourceId);

//     if (selectedResource.type === "video") {
//       if (!form.media) return notifyError("Video URL is required.");
//       formData.append("media", form.media);
//     } else {
//       if (!mediaFile && !form.id) return notifyError("PDF file is required.");
//       if (mediaFile) formData.append("media", mediaFile);
//     }

//     const res = await fetch(
//       `${base_api}/api/free-resource-materials${form.id ? `/${form.id}` : ""}`,
//       {
//         method: form.id ? "PUT" : "POST",
//         body: formData,
//       }
//     );

//     if (res.ok) {
//       notifySuccess(`Material ${form.id ? "updated" : "added"} successfully`);
//       setForm({});
//       setMediaFile(null);
//       fetchMaterials();
//     } else notifyError("Something went wrong");
//   };

//   const handleEdit = (mat: any) => setForm(mat);

//   const handleDelete = async (id: string) => {
//     const res = await fetch(`${base_api}/api/free-resource-materials/${id}`, {
//       method: "DELETE",
//     });
//     if (res.ok) {
//       notifySuccess("Deleted successfully");
//       fetchMaterials();
//     } else notifyError("Delete failed");
//   };

//   return (
//     <div className="grid grid-cols-12 gap-6">
//       <div className="col-span-12 lg:col-span-4">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white px-8 py-8 rounded-md mb-6"
//         >
//           <h4 className="text-[22px] mb-4">Add / Edit Free Resource Material</h4>

//           <input
//             type="text"
//             name="title"
//             value={form.title || ""}
//             onChange={handleChange}
//             placeholder="Title"
//             className="input input-bordered w-full h-[44px] px-4 mb-4"
//             required
//           />

//           <ReactSelect
//             placeholder="Select Category Type"
//             className="mb-4"
//             value={categoryTypes.find((c) => c.id === form.categoryTypeId) && {
//               value: form.categoryTypeId,
//               label: categoryTypes.find((c) => c.id === form.categoryTypeId)?.title,
//             }}
//             onChange={(opt) => handleSelectChange("categoryTypeId", opt?.value)}
//             options={categoryTypes.map((c) => ({ value: c.id, label: c.title }))}
//           />

//           <ReactSelect
//             placeholder="Select Category"
//             className="mb-4"
//             value={categories.find((c) => c.id === form.categoryId) && {
//               value: form.categoryId,
//               label: categories.find((c) => c.id === form.categoryId)?.title,
//             }}
//             onChange={(opt) => handleSelectChange("categoryId", opt?.value)}
//             options={categories.map((c) => ({ value: c.id, label: c.title }))}
//           />

//           <ReactSelect
//             placeholder="Select Free Resource"
//             className="mb-4"
//             value={freeResources.find((r) => r.id === form.freeResourceId) && {
//               value: form.freeResourceId,
//               label: freeResources.find((r) => r.id === form.freeResourceId)?.title,
//             }}
//             onChange={(opt) => handleSelectChange("freeResourceId", opt?.value)}
//             options={freeResources.map((r) => ({ value: r.id, label: r.title }))}
//           />

//           {freeResources.find((r) => r.id === form.freeResourceId)?.type === "video" ? (
//             <input
//               type="text"
//               name="media"
//               value={form.media || ""}
//               onChange={handleChange}
//               placeholder="Video URL"
//               className="input input-bordered w-full h-[44px] px-4 mb-4"
//               required
//             />
//           ) : (
//             <input
//               type="file"
//               accept="application/pdf"
//               onChange={handleMediaUpload}
//               className="file-input file-input-bordered w-full mb-4"
//               required={!form?.id}
//             />
//           )}

//           <button type="submit" className="tp-btn px-6 py-2">
//             {form?.id ? "Update Material" : "Add Material"}
//           </button>
//         </form>
//       </div>

//       <div className="col-span-12 lg:col-span-8">
//         <div className="bg-white px-8 py-6 rounded-md">
//           <h3 className="text-xl font-semibold mb-4">Saved Materials</h3>
//           {materials.length === 0 ? (
//             <p className="text-gray-500">No materials available.</p>
//           ) : (
//             <table className="table w-full">
//               <thead>
//                 <tr>
//                   <th className="text-left">Title</th>
//                   <th className="text-left">Free Resource</th>
//                   <th className="text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {materials.map((mat) => (
//                   <tr key={mat.id}>
//                     <td>{mat.title}</td>
//                     <td>{freeResources.find((r) => r.id === mat.freeResourceId)?.title || "-"}</td>
//                     <td className="flex gap-2">
//                       <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(mat)}>
//                         Edit
//                       </button>
//                       <button className="btn btn-danger btn-sm" onClick={() => handleDelete(mat.id)}>
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FreeResourceMaterialManagement;
