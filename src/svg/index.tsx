import Categories from "./categories";
import Coupons from "./coupons";
import Customers from "./customers";
import Dashboard from "./dashboard";
import DownArrow from "./down-arrow";
import Orders from "./orders";
import Pages from "./pages";
import Products from "./products";
import Profile from "./profile";
import Reviews from "./reviews";
import Setting from "./setting";
import Menu from "./menu";
import Search from "./search";
import Notification from "./notification";
import Close from "./close";
import Received from "./received";
import TotalOrders from "./total-orders";
import MonthSales from "./month-sales";
import Sales from "./sales";
import Prev from "./prev";
import Next from "./next";
import Drug from "./drug";
import SmClose from "./sm-close";
import Invoice from "./invoice";
import View from "./view";
import CloseTwo from "./close-2";
import Camera from "./camera";
import CameraTwo from "./camera-2";
import Leaf from "./leaf";
import StuffUser from "./stuff-user";
import DeleteNew from "./delete-new";
import EditNew from "./edit-new";

interface SVGProps {
  className?: string;
}

export const Upload: React.FC<SVGProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className || "w-6 h-6"}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  );
};

export const Plus: React.FC<SVGProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className || "w-6 h-6"}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};

export {
  Categories,
  Coupons,
  Customers,
  Camera,
  CameraTwo,
  CloseTwo,
  Dashboard,
  Invoice,
  View,
  DownArrow,
  Orders,
  Pages,
  Products,
  Profile,
  Reviews,
  Setting,
  StuffUser,
  Leaf,
  Drug,
  Menu,
  Search,
  Notification,
  Close,
  MonthSales,
  Received,
  Sales,
  TotalOrders,
  Next,
  Prev,
  SmClose,
};

export const Delete = DeleteNew;
export const Edit = EditNew;