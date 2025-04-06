"use client";
import React, { useEffect, useState } from "react";

const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

const AddCategoryType = () => {
  const [typeList, setTypeList] = useState<string[]>([""]);
  const [allTypes, setAllTypes] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");

  // Fetch all category types on mount
  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const res = await fetch(`${base_api}/api/category-types/`);
      const data = await res.json();
      if (res.ok) setAllTypes(data.data);
    } catch (err) {
      console.error("Failed to fetch category types:", err);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newTypes = [...typeList];
    newTypes[index] = value;
    setTypeList(newTypes);
  };

  const handleAddType = () => {
    setTypeList([...typeList, ""]);
  };

  const handleDeleteTypeInput = (index: number) => {
    if (typeList.length > 1) {
      setTypeList(typeList.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validTypes = typeList.filter((type) => type.trim() !== "");
    if (validTypes.length === 0) return;

    try {
      const response = await fetch(`${base_api}/api/category-types/add-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ types: validTypes }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Submitted:", result);
        setTypeList([""]);
        fetchTypes();
      } else {
        console.error("Submission failed:", result.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleEdit = (type: any) => {
    setEditingId(type.id);
    setEditedName(type.name);
  };

  const handleUpdate = async (id: number) => {
    if (!editedName.trim()) return;

    try {
      const res = await fetch(`${base_api}/api/category-types/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedName }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Updated:", data);
        setEditingId(null);
        fetchTypes();
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${base_api}/api/category-types/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Deleted:", data);
        fetchTypes();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left: Add Form */}
      <div className="col-span-12 lg:col-span-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-6 bg-white px-8 py-8 rounded-md">
            <label className="block text-base font-medium text-black mb-2">
              Category Type Name
            </label>
            {typeList.map((type, index) => (
              <div key={index} className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter type name"
                  value={type}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
                {index === typeList.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleAddType}
                  >
                    +
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => handleDeleteTypeInput(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button className="tp-btn px-7 py-2 mt-2" type="submit">
              Submit Types
            </button>
          </div>
        </form>
      </div>

      {/* Right: List Types */}
      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white px-8 py-6 rounded-md">
          <h3 className="text-xl font-semibold mb-4">All Category Types</h3>
          {allTypes.length === 0 ? (
            <p className="text-gray-500">No types available.</p>
          ) : (
            <ul className="space-y-4">
              {allTypes.map((type) => (
                <li
                  key={type.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  {editingId === type.id ? (
                    <>
                      <input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(type.id)}
                          className="btn btn-success btn-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn btn-outline btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-black text-base">{type.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(type)}
                          className="btn btn-outline btn-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(type.id)}
                          className="btn btn-error btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCategoryType;
