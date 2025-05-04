"use client";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";

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
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const typeOptions = [
    { value: "pdf", label: "PDF" },
    { value: "video", label: "Video" },
  ];

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

  const handleInputChange = (
    index: number,
    field: keyof FreeResource,
    value: string
  ) => {
    const updated = [...resources];
    updated[index][field] = value as any;
    setResources(updated);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setResources([{ title: "", type: "pdf" }]);
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
    const valid = resources.filter((r) => r.title.trim() && r.type);
    if (valid.length === 0) {
      notifyError("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${base_api}/api/free-resources/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resources),
      });
      const data = await res.json();
      setSubmitting(false);

      if (res.ok) {
        notifySuccess("Resources added successfully.");
        setResources([{ title: "", type: "pdf" }]);
        setShowAddForm(false);
        fetchResources();
      } else {
        notifyError(data.message || "Failed to add resources.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      notifyError("An error occurred while submitting resources.");
      setSubmitting(false);
    }
  };

  const handleEdit = (res: FreeResource) => {
    setEditingId(res.id || "");
    setEditData({ title: res.title, type: res.type });
  };

  const handleUpdate = async (id: string) => {
    try {
      setSubmitting(true);
      const res = await fetch(`${base_api}/api/free-resources/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      setSubmitting(false);

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
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSubmitting(true);
      const res = await fetch(`${base_api}/api/free-resources/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setSubmitting(false);

      if (res.ok) {
        notifySuccess("Resource deleted successfully.");
        fetchResources();
      } else {
        notifyError(data.message || "Failed to delete resource.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      notifyError("An error occurred while deleting resource.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="bg-[#7C3AED] rounded-2xl p-6 mb-6">
        <h2 className="text-white text-2xl font-semibold">Free Resources</h2>
        <p className="text-white/80 mb-4">Manage and organize your Free Resources</p>
        <div className="flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search materials..."
              className="w-full bg-white/10 text-white placeholder-white/60 border-0 rounded-lg py-2 px-4 pl-10"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button 
            onClick={handleAddClick}
            className="bg-white text-[#7C3AED] px-4 py-2 rounded-lg flex items-center gap-2 ml-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Material
          </button>
        </div>
      </div>

      {/* Form Section */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add New Material</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            {resources.map((res, i) => (
              <div key={i} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter resource title"
                    className="input input-bordered w-full py-3 px-4 rounded-lg"
                    value={res.title}
                    onChange={(e) => handleInputChange(i, "title", e.target.value)}
                  />
                  <ReactSelect
                    className="w-full"
                    value={typeOptions.find(option => option.value === res.type)}
                    onChange={(selectedOption: any) =>
                      handleInputChange(i, "type", selectedOption?.value)
                    }
                    options={typeOptions}
                    placeholder="Select Resource Type"
                    styles={{
                      control: (base) => ({
                        ...base,
                        padding: '4px',
                        borderRadius: '0.5rem',
                        borderColor: '#e5e7eb'
                      })
                    }}
                  />
                </div>
                <div className="flex justify-between mt-4">
                  {resources.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                      onClick={() => handleRemoveRow(i)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Remove
                    </button>
                  )}
                  {i === resources.length - 1 && (
                    <button
                      type="button"
                      className="text-[#7C3AED] hover:text-[#6D28D9] transition-colors flex items-center gap-1 ml-auto"
                      onClick={handleAddRow}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Another
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] disabled:opacity-50 transition-colors flex items-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-6 text-gray-600 font-medium">TITLE</th>
              <th className="text-left py-4 px-6 text-gray-600 font-medium">TYPE</th>
              <th className="text-left py-4 px-6 text-gray-600 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {savedResources.map((resource) => (
              <tr key={resource.id} className="border-b last:border-b-0">
                <td className="py-4 px-6">{resource.title}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    resource.type === 'pdf' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {resource.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(resource)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(resource.id!)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {savedResources.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No materials available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Resource</h3>
            <input
              type="text"
              className="input input-bordered w-full mb-4"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            />
            <ReactSelect
              className="mb-4"
              value={typeOptions.find((option) => option.value === editData.type)}
              onChange={(selectedOption) =>
                setEditData({
                  ...editData,
                  type: selectedOption?.value as "pdf" | "video",
                })
              }
              options={typeOptions}
              placeholder="Select Type"
            />
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleUpdate(editingId)}
                disabled={submitting}
              >
                Save
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
