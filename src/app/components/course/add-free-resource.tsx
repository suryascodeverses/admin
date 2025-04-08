"use client";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useEffect, useState } from "react";

const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

type FreeResource = {
  id?: string;
  title: string;
  type: "pdf" | "video";
};

export default function FreeResourcesPage() {
  const [resources, setResources] = useState<FreeResource[]>([
    { title: "", type: "pdf" },
  ]);
  const [savedResources, setSavedResources] = useState<FreeResource[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<FreeResource>({
    title: "",
    type: "pdf",
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch(`${base_api}/api/free-resources`);
      const data = await res.json();
      if (res.ok) {
        setSavedResources(data.data);
      } else {
        notifyError(data.message || "Failed to fetch resources.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      notifyError("An error occurred while fetching resources.");
    }
  };
  
  const handleInputChange = (index: number, field: keyof FreeResource, value: string) => {
    const updated = [...resources];
    updated[index][field] = value as any;
    setResources(updated);
  };

  const handleAddRow = () => {
    setResources([...resources, { title: "", type: "pdf" }]);
  };

  const handleRemoveRow = (index: number) => {
    if (resources.length > 1) {
      setResources(resources.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = resources.filter(r => r.title.trim() && r.type);
    if (valid.length === 0) {
      notifyError("Please fill in all required fields.");
      return;
    }
  
    try {
      const res = await fetch(`${base_api}/api/free-resources/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( resources ),
      });
  
      const data = await res.json();
      if (res.ok) {
        notifySuccess("Resources added successfully.");
        setResources([{ title: "", type: "pdf" }]);
        fetchResources();
      } else {
        notifyError(data.message || "Failed to add resources.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      notifyError("An error occurred while submitting resources.");
    }
  };
  

  const handleEdit = (res: FreeResource) => {
    setEditingId(res.id || "");
    setEditData({ title: res.title, type: res.type });
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`${base_api}/api/free-resources/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
  
      const data = await res.json();
      if (res.ok) {
        notifySuccess("Resource updated successfully.");
        setEditingId(null);
        fetchResources();
      } else {
        notifyError(data.message || "Failed to update resource.");
      }
    } catch (err) {
      console.error("Update error:", err);
      notifyError("An error occurred while updating resource.");
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${base_api}/api/free-resources/${id}`, {
        method: "DELETE",
      });
  
      const data = await res.json();
      if (res.ok) {
        notifySuccess("Resource deleted successfully.");
        fetchResources();
      } else {
        notifyError(data.message || "Failed to delete resource.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      notifyError("An error occurred while deleting resource.");
    }
  };
  

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Form Section */}
      <div className="col-span-12 lg:col-span-4">
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-6 rounded-md shadow">
            <h3 className="text-lg font-bold mb-4">Add Free Resources</h3>
            {resources.map((res, i) => (
              <div key={i} className="mb-4">
                <input
                  type="text"
                  placeholder="Resource title"
                  className="input input-bordered w-full mb-2"
                  value={res.title}
                  onChange={(e) => handleInputChange(i, "title", e.target.value)}
                />
                <select
                  className="select select-bordered w-full mb-2"
                  value={res.type}
                  onChange={(e) => handleInputChange(i, "type", e.target.value)}
                >
                  <option value="pdf">PDF</option>
                  <option value="video">Video</option>
                </select>
                <div className="flex justify-between">
                  {i === resources.length - 1 ? (
                    <button type="button" className="btn btn-outline btn-sm" onClick={handleAddRow}>
                      + Add Another
                    </button>
                  ) : (
                    <button type="button" className="text-red-500" onClick={() => handleRemoveRow(i)}>
                      × Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="submit" className="btn btn-primary w-full mt-4">
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white p-6 rounded-md shadow">
          <h3 className="text-xl font-semibold mb-4">All Free Resources</h3>
          {savedResources.length === 0 ? (
            <p className="text-gray-500">No free resources available.</p>
          ) : (
            <table className="table w-full">
              <thead className="thead-dark">
                {" "}
                <tr>
                  {" "}
                  <th scope="col" style={{ width: "50%", textAlign: "start" }}>
                    Title
                  </th>{" "}
                  <th scope="col" style={{ width: "25%", textAlign: "start" }}>
                    Type
                  </th>{" "}
                  <th scope="col" style={{ width: "25%", textAlign: "start" }}>
                    Actions
                  </th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody>
                {savedResources.map((res) => (
                  <tr key={res.id}>
                    {editingId === res.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            className="input input-bordered w-full"
                            value={editData.title}
                            onChange={(e) =>
                              setEditData({ ...editData, title: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <select
                            className="select select-bordered w-full"
                            value={editData.type}
                            onChange={(e) =>
                              setEditData({ ...editData, type: e.target.value as any })
                            }
                          >
                            <option value="pdf">PDF</option>
                            <option value="video">Video</option>
                          </select>
                        </td>
                        <td className="flex gap-2">
                          <button className="btn btn-sm btn-success" onClick={() => handleUpdate(res.id!)}>
                            Save
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{res.title}</td>
                        <td>{res.type}</td>
                        <td className="flex gap-2">
                          <button className="btn btn-sm btn-outline" onClick={() => handleEdit(res)}>
                            Edit
                          </button>
                          <button className="btn btn-sm btn-error" onClick={() => handleDelete(res.id!)}>
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
