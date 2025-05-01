import React, { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
// internal
import OrderActions from "./order-actions";
import { Search } from "@/svg";
import ErrorMsg from "../common/error-msg";
import Pagination from "../ui/Pagination";
import OrderStatusChange from "./status-change";
import {useGetAllOrdersQuery} from "@/redux/order/orderApi";
import usePagination from "@/hooks/use-pagination";

const OrderTable = () => {
  const { data: orders, isError, isLoading, error } = useGetAllOrdersQuery();
  const [searchVal,setSearchVal] = useState<string>("");
  const [selectVal,setSelectVal] = useState<string>("");
  const paginationData = usePagination(orders?.data || [], 10);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && orders?.data.length === 0) {
    content = <ErrorMsg msg="No Orders Found" />;
  }

  if (!isLoading && !isError && orders?.success) {
    let orderItems = [...currentItems];
    if(searchVal){
      orderItems = orderItems.filter(v => v.invoice.toString().includes(searchVal))
    }
    if(selectVal){
      orderItems = orderItems.filter(v => v.status.toLowerCase() === selectVal.toLowerCase())
    }

    content = (
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-gray-600 font-semibold">
                Invoice No
              </th>
              <th scope="col" className="px-6 py-4 text-gray-600 font-semibold">
                Customer
              </th>
              <th scope="col" className="px-6 py-4 text-gray-600 font-semibold">
                Date
              </th>
              <th scope="col" className="px-6 py-4 text-gray-600 font-semibold">
                Total
              </th>
              <th scope="col" className="px-6 py-4 text-gray-600 font-semibold">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-gray-600 font-semibold">
                Payment Method
              </th>
              <th scope="col" className="px-6 py-4 text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item) => (
              <tr key={item._id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                    #{item.invoice}
                  </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                      {item.user?.imageURL && (
                        <Image
                        className="w-10 h-10 rounded-full"
                          src={item.user.imageURL}
                        alt={item.user?.name || ""}
                        width={40}
                        height={40}
                      />
                    )}
                    <span className="font-medium text-gray-900">{item.user?.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {dayjs(item.createdAt).format("MMM D, YYYY")}
                  </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ${item.cart.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}
                  </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.status === "delivered" ? "bg-green-100 text-green-800" :
                    item.status === "cancel" ? "bg-red-100 text-red-800" :
                    item.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                    item.status === "pending" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                      {item.status}
                    </span>
                  </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {item.paymentMethod?.toLowerCase() === "visa" ? (
                      <svg className="h-8 w-auto" viewBox="0 0 36 24" fill="none">
                        <rect width="36" height="24" rx="4" fill="#1A1F71"/>
                        <path d="M15.4 15.5H13.3L14.8 8.5H16.9L15.4 15.5ZM11.5 8.5L9.5 13.1L9.2 12.1L9.2 12.1L8.4 9C8.4 9 8.2 8.5 7.6 8.5H4.2L4.2 8.7C5 8.9 5.9 9.2 6.5 9.5L8.3 15.5H10.4L13.7 8.5H11.5ZM27.5 15.5H29.4L27.6 8.5H26C25.5 8.5 25.1 8.8 24.9 9.2L21.7 15.5H23.8L24.3 14.3H27.2L27.5 15.5ZM24.9 12.7L26.1 9.9L26.8 12.7H24.9ZM20.8 10.2L21.1 8.7C20.5 8.5 19.8 8.3 18.9 8.3C17.1 8.3 15.8 9.2 15.8 10.5C15.8 11.5 16.8 12 17.5 12.3C18.3 12.6 18.5 12.8 18.5 13.1C18.5 13.5 18 13.7 17.4 13.7C16.6 13.7 16.1 13.6 15.3 13.3L15 14.9C15.8 15.2 16.7 15.3 17.5 15.3C19.5 15.3 20.7 14.4 20.7 13C20.7 11.8 19.9 11.2 18.8 10.8C18 10.5 17.8 10.3 17.8 10C17.8 9.7 18.2 9.4 19 9.4C19.7 9.4 20.3 9.6 20.8 9.8V10.2Z" fill="white"/>
                      </svg>
                    ) : item.paymentMethod?.toLowerCase() === "mastercard" ? (
                      <svg className="h-8 w-auto" viewBox="0 0 36 24" fill="none">
                        <rect width="36" height="24" rx="4" fill="#000"/>
                        <circle cx="13" cy="12" r="6" fill="#EB001B"/>
                        <circle cx="23" cy="12" r="6" fill="#F79E1B"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M18 16.6C19.6 15.2 20.6 13.2 20.6 11C20.6 8.8 19.6 6.8 18 5.4C16.4 6.8 15.4 8.8 15.4 11C15.4 13.2 16.4 15.2 18 16.6Z" fill="#FF5F00"/>
                      </svg>
                    ) : null}
                    <span className="text-gray-600">{item.paymentMethod}</span>
                  </div>
                  </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      View
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Edit
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Orders</h3>
            <p className="mt-1 text-sm text-gray-500">
              A list of all orders including their details
            </p>
        </div>
          <div className="mt-4 flex sm:mt-0 sm:ml-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={selectVal}
                  onChange={(e) => setSelectVal(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
                  <option value="cancel">Cancelled</option>
            </select>
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search orders..."
                  onChange={(e) => setSearchVal(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {content}
        
        {!isLoading && !isError && orders?.success && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{currentItems.length}</span> of{" "}
              <span className="font-medium">{orders?.data.length}</span> results
            </div>
            <div className="pagination">
              <Pagination handlePageClick={handlePageClick} pageCount={pageCount} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTable;
