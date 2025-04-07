"use client";

import React, { useEffect, useState } from "react";
import { notifyError } from "@/utils/toast";

interface CounsellingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  description?: string;
  categoryId: string;
  category?: {
    name: string;
  };
  createdAt: string;
}

const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

const CareerCounsellingRequests: React.FC = () => {
  const [requests, setRequests] = useState<CounsellingRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${base_api}/api/career-counselling-form`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      } else {
        notifyError(data.message || "Failed to fetch requests.");
      }
    } catch (err) {
      notifyError("Failed to fetch requests.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h3 className="text-xl font-semibold mb-4">Career Counselling Requests</h3>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No requests submitted yet.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-sm text-left border border-gray-200 rounded-md">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 border-b">Name</th>
                <th className="px-4 py-3 border-b">Email</th>
                <th className="px-4 py-3 border-b">Phone</th>
                <th className="px-4 py-3 border-b">Category</th>
                <th className="px-4 py-3 border-b">Description</th>
                <th className="px-4 py-3 border-b">Submitted On</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{req.name}</td>
                  <td className="px-4 py-3 border-b">{req.email}</td>
                  <td className="px-4 py-3 border-b">{req.phone}</td>
                  <td className="px-4 py-3 border-b">
                    {req.category?.name || "—"}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {req.description || "—"}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CareerCounsellingRequests;
