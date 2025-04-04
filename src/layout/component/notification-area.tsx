import Image from "next/image";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { Notification, Close } from "@/svg";
import { useGetStockOutProductsQuery } from "@/redux/product/productApi";
import { IProduct } from "@/types/product-type";

// prop type
type IPropType = {
  nRef: React.RefObject<HTMLDivElement>;
  notificationOpen: boolean;
  handleNotificationOpen: () => void;
};

const NotificationArea = ({nRef,notificationOpen,handleNotificationOpen}: IPropType) => {
  const {data: stockOutProduct,isError,isLoading} = useGetStockOutProductsQuery();
  const [products, setProducts] = useState<IProduct[] | undefined>(
    stockOutProduct?.data
  );

  useEffect(() => {
    if (stockOutProduct?.data) {
      setProducts(stockOutProduct.data);
    }
  }, [stockOutProduct?.data]);

  return (
    <div ref={nRef}>
      <button
        onClick={handleNotificationOpen}
        className="relative w-[40px] h-[40px] leading-[40px] rounded-md text-gray border border-gray hover:bg-themeLight hover:text-theme hover:border-themeLight"
      >
        <Notification />
        <span className="w-[20px] h-[20px] inline-block bg-danger rounded-full absolute -top-[4px] -right-[4px] border-[2px] border-white text-xs leading-[18px] font-medium text-white">
          {products && products.length}
        </span>
      </button>

      {notificationOpen && (
        <div className="absolute w-[280px] sm:w-[350px] h-auto top-full -right-[60px] sm:right-0 shadow-lg rounded-md bg-white py-5 px-5">
          {products &&
            products.slice(0,5).map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between last:border-0 border-b border-gray pb-4 mb-4 last:pb-0 last:mb-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="">
                    <Image
                      className="w-[40px] h-[40px] rounded-md"
                      src={item.img}
                      alt="img"
                      width={40}
                      height={40}
                      priority
                    />
                  </div>
                  <div className="">
                    <h5 className="text-base mb-0 leading-none">
                      {item.title}
                    </h5>
                    <div className="flex items-center mt-2">
                      <span
                        className={`text-[11px] px-2 py-1 rounded-md leading-none text-danger bg-danger/10  font-medium`}
                      >
                        {item.status}
                      </span>

                      <span className="text-tiny leading-none">
                        {dayjs(item.createdAt).format("MMM D, YYYY h:mm A")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="">
                  <button className="hover:text-danger">
                    <Close />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default NotificationArea;
