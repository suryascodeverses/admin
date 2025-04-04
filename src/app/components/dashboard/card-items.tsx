"use client";
import React, { useEffect, useState } from "react";
import { MonthSales, Received, Sales, TotalOrders } from "@/svg";
import { useGetDashboardAmountQuery } from "@/redux/order/orderApi";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isBetween from "dayjs/plugin/isBetween";
import ErrorMsg from "../common/error-msg";
dayjs.extend(isToday, isYesterday);
dayjs.extend(isBetween);

type IPropType = {
  title: string;
  amount: number | undefined;
  cash?: number;
  card?: number;
  icon: React.ReactNode;
  clr: string;
  clr2: string;
};

function CardItem({ title, amount, cash, card, icon, clr, clr2 }: IPropType) {
  return (
    <div className="widget-item bg-white p-6 flex justify-between rounded-md">
      <div>
        <h4 className="text-xl font-semibold text-slate-700 mb-1 leading-none">
          {amount && amount.toFixed(2)}
        </h4>
        <p className="text-tiny leading-4">{title}</p>
        {(title === "Today Orders" || title === "Yesterday Orders") && (
          <div className={`badge space-x-1 ${clr}`}>
            <div className="flex text-center font-normal text-gray-50">
              {cash !== undefined && (
                <div className="px-1">Cash: {cash.toFixed(2)}</div>
              )}
              {card !== undefined && (
                <div className="px-1">Card: {card.toFixed(2)}</div>
              )}
            </div>
          </div>
        )}
      </div>
      <div>
        <span
          className={`text-lg text-white rounded-full flex items-center justify-center h-12 w-12 shrink-0 ${clr2}`}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}

const CardItems = () => {
  const {
    data: dashboardOrderAmount,
    isError,
    isLoading,
  } = useGetDashboardAmountQuery();

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError) {
    content = (
      <>
        <CardItem
          title="Today Orders"
          amount={dashboardOrderAmount?.todayOrderAmount} 
          card={dashboardOrderAmount?.todayCardPaymentAmount} 
          cash={dashboardOrderAmount?.todayCashPaymentAmount} 
          icon={<Received />}
          clr=""
          clr2="bg-success"
        />
        <CardItem
          title="Yesterday Orders"
          amount={dashboardOrderAmount?.yesterdayOrderAmount}
          card={dashboardOrderAmount?.yesterDayCardPaymentAmount}
          cash={dashboardOrderAmount?.yesterDayCashPaymentAmount}
          icon={<Sales />}
          clr="text-purple bg-purple/10"
          clr2="bg-purple"
        />
        <CardItem
          title="Monthly Orders"
          amount={dashboardOrderAmount?.monthlyOrderAmount}
          icon={<MonthSales />}
          clr="text-info bg-info/10"
          clr2="bg-info"
        />
        <CardItem
          title="Total Orders"
          amount={dashboardOrderAmount?.totalOrderAmount}
          icon={<TotalOrders />}
          clr="text-warning bg-warning/10"
          clr2="bg-warning"
        />
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {content}
    </div>
  );
};

export default CardItems;
