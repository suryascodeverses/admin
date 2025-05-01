"use client";

import React, { useState } from 'react';
import { notifySuccess, notifyError } from "@/utils/toast";

const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

const AddAchievement = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim() || !points) {
      notifyError("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${base_api}/api/achievements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          points: parseInt(points),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        notifySuccess("Achievement added successfully!");
        // Reset form
        setName("");
        setDescription("");
        setPoints("");
      } else {
        notifyError(data.message || "Failed to add achievement");
      }
    } catch (error) {
      console.error("Error adding achievement:", error);
      notifyError("Something went wrong while adding the achievement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-[#7C3AED] text-white p-6 rounded-t-lg">
        <div>
          <h1 className="text-2xl font-semibold">Add Achievement</h1>
          <p className="text-sm opacity-80">Create new achievements for your courses</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-b-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Achievement Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              placeholder="Enter achievement name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              placeholder="Enter achievement description"
            />
          </div>

          <div>
            <label htmlFor="points" className="block text-sm font-medium text-gray-700">
              Points
            </label>
            <input
              type="number"
              id="points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              placeholder="Enter points value"
              min="0"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6D28D9] transition-colors disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Achievement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAchievement; 