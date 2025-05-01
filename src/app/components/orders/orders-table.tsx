import React, { useState } from 'react';
import Image from 'next/image';

interface Order {
  id: string;
  billingName: string;
  date: string;
  total: number;
  paymentStatus: 'Paid' | 'Chargeback' | 'Refunded';
  paymentMethod: 'Mastercard' | 'Visa';
}

const OrdersTable = () => {
  const [entries, setEntries] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - in a real app this would come from an API
  const orders: Order[] = [
    {
      id: '#0001',
      billingName: 'Brian Smith',
      date: '2023-12-04',
      total: 353.00,
      paymentStatus: 'Paid',
      paymentMethod: 'Mastercard',
    },
    {
      id: '#0002',
      billingName: 'Patrick Babcock',
      date: '2023-12-05',
      total: 939.00,
      paymentStatus: 'Chargeback',
      paymentMethod: 'Visa',
    },
    // Add more sample data as needed
  ];

  const getStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-600';
      case 'Chargeback':
        return 'bg-red-100 text-red-600';
      case 'Refunded':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="w-full">
      <div className="text-xl font-semibold mb-6">Orders</div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select 
            value={entries}
            onChange={(e) => setEntries(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span>Search:</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-1"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">#</th>
              <th className="text-left py-3 px-4">Billing Name</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-left py-3 px-4">Total</th>
              <th className="text-left py-3 px-4">Payment Status</th>
              <th className="text-left py-3 px-4">Payment Method</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{order.id}</td>
                <td className="py-3 px-4">{order.billingName}</td>
                <td className="py-3 px-4">{order.date}</td>
                <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Image 
                      src={`/images/${order.paymentMethod.toLowerCase()}.png`}
                      alt={order.paymentMethod}
                      width={24}
                      height={16}
                    />
                    {order.paymentMethod}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      View
                    </button>
                    <button className="bg-blue-100 text-blue-500 px-3 py-1 rounded hover:bg-blue-200">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable; 