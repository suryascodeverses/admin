import React from "react";
import { IProduct } from "@/types/product-type";
import Image from "next/image";

// prop type 
type IPropType = {
  productData:IProduct[];
  ship_cost:number;
}

const OrderDetailsBottom = ({productData,ship_cost}:IPropType) => {
  const total = productData.reduce((acc,curr) => acc + curr.price,0);
  const grand_total = total + ship_cost;
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 2xl:col-span-8">
        <div className="bg-white rounded-t-md rounded-b-md shadow-xs py-8">
          <div className="relative overflow-x-auto  mx-8">
            <table className="w-[975px] md:w-full text-base text-left text-gray-500">
              <thead className="bg-white">
                <tr className="border-b border-gray6 text-tiny">
                  <th
                    scope="col"
                    className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end"
                  >
                    Unit Price
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {productData.map(p => (
                <tr key={p._id} className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                  <td className="pr-8 py-5 whitespace-nowrap">
                    <a href="#" className="flex items-center space-x-5">
                      <Image
                        className="w-[40px] h-[40px] rounded-md"
                        src={p.img}
                        alt="product-img"
                        width={282}
                        height={300}
                      />
                      <span className="font-medium text-heading text-hover-primary transition">
                        {p.title}
                      </span>
                    </a>
                  </td>
                  <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                    {p.orderQuantity}
                  </td>
                  <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                    ${(p.orderQuantity * p.price).toFixed(2)}
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="col-span-12 2xl:col-span-4">
        <div className="bg-white rounded-t-md rounded-b-md shadow-xs py-8 px-8">
          <h5>Order Price</h5>
          <div className="relative overflow-x-auto">
            <table className="w-full text-base text-left text-gray-500">
              <tbody>
                <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                  <td className="pr-3 py-3 pt-6 font-normal text-[#55585B] text-start">
                    Subtotal
                  </td>
                  <td className="px-3 py-3 pt-6 font-normal text-[#55585B] text-end">
                    ${total.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                  <td className="pr-3 py-3 font-normal text-[#55585B] text-start">
                    Shipping cost:
                  </td>
                  <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                    ${ship_cost.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                  <td className="pr-3 py-3 font-normal text-[#55585B] text-start">
                    Grand total:
                  </td>
                  <td className="px-3 py-3 text-[#55585B] text-end text-lg font-semibold">
                    ${grand_total.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsBottom;
