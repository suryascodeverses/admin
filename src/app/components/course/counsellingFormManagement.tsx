"use client";

import React, { useEffect, useState } from "react";
import { notifyError, notifySuccess } from "@/utils/toast";

interface CounsellingRequest {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  careerGoals?: string;
  appointmentDate: string;
  appointmentTime: string;
  createdAt: string;
}

const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

const CareerCounsellingRequests: React.FC = () => {
  const [requests, setRequests] = useState<CounsellingRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRequest, setSelectedRequest] = useState<CounsellingRequest | null>(null);

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

  const deleteRequest = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        const res = await fetch(`${base_api}/api/career-counselling-form/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete request.");
        setRequests((prev) => prev.filter((req) => req.id !== id));
        notifySuccess("Request deleted successfully.");
      } catch (error) {
        console.error(error);
        notifyError("Failed to delete request. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-[#7C3AED] px-6 py-8 rounded-lg mx-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Career Counselling Requests</h1>
            <p className="text-white/80">Manage and review career counselling requests</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg mx-6 p-6">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No requests submitted yet.</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 text-lg font-bold text-gray-600">Full Name</th>
                  <th className="text-left py-4 px-4 text-lg font-bold text-gray-600">Email</th>
                  <th className="text-left py-4 px-4 text-lg font-bold text-gray-600">Phone</th>
                  <th className="text-left py-4 px-4 text-lg font-bold text-gray-600">Preferred Date</th>
                  <th className="text-left py-4 px-4 text-lg font-bold text-gray-600">Preferred Time</th>
                  <th className="text-left py-4 px-4 text-lg font-bold text-gray-600">Submitted On</th>
                  <th className="text-left py-4 px-4 text-lg font-bold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {requests.map((req) => (
                  <tr key={req.id} className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedRequest(req)}>
                    <td className="py-4 px-4">{req.firstName} {req.lastName || ""}</td>
                    <td className="py-4 px-4">{req.email}</td>
                    <td className="py-4 px-4">{req.phone}</td>
                    <td className="py-4 px-4">{req.appointmentDate}</td>
                    <td className="py-4 px-4">{req.appointmentTime}</td>
                    <td className="py-4 px-4">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRequest(req.id);
                        }}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Request Details
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRequest(null);
                    }}
                    className="text-gray-400 hover:text-gray-500 transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><strong>Full Name:</strong> <span className="block text-gray-700 mt-1">{selectedRequest.firstName} {selectedRequest.lastName || ""}</span></div>
                  <div><strong>Email:</strong> <span className="block text-gray-700 mt-1">{selectedRequest.email}</span></div>
                  <div><strong>Phone:</strong> <span className="block text-gray-700 mt-1">{selectedRequest.phone}</span></div>
                  <div><strong>Preferred Date:</strong> <span className="block text-gray-700 mt-1">{selectedRequest.appointmentDate}</span></div>
                  <div><strong>Preferred Time:</strong> <span className="block text-gray-700 mt-1">{selectedRequest.appointmentTime}</span></div>
                  <div><strong>Submitted On:</strong> <span className="block text-gray-700 mt-1">{new Date(selectedRequest.createdAt).toLocaleDateString()}</span></div>
                </div>
                <div><strong>Career Goals:</strong> <span className="block text-gray-700 mt-1 whitespace-pre-wrap">{selectedRequest.careerGoals || "—"}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerCounsellingRequests;
