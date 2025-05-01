import { ISidebarMenus } from "./../types/menu-types";
import {
  Dashboard,
  Categories,
  Coupons,
  Orders,
  Pages,
  Products,
  Profile,
  Reviews,
  Setting,
  Leaf,
  StuffUser,
  Upload,
} from "@/svg";

const sidebar_menu: Array<ISidebarMenus> = [
  // {
  //   id: 1,
  //   icon: Dashboard,
  //   link: "/dashboard",
  //   title: "Dashboard",
  // },
  // {
  //   id: 2,
  //   icon: Products,
  //   link: "/product-list",
  //   title: "Products",
  //   subMenus: [
  //     { title: "Product List", link: "/product-list" },
  //     { title: "Product Grid", link: "/product-grid" },
  //     { title: "Add Product", link: "/add-product" }
  //   ],
  // },
  {
    id: 31,
    icon: Categories,
    link: "/category",
    title: "Category",
    subMenus: [
      { title: "Category Type", link: "/category-type" },
      { title: "Category", link: "/category" },
    ],
  },
  {
    id: 3,
    icon: Categories,
    link: "/course",
    title: "Course",
    subMenus: [
      { title: "Course", link: "/course" },
      { title: "Course Material", link: "/course/course-material" },
    ],
  },
  {
    id: 4,
    icon: Orders,
    link: "/free-resources",
    title: "Free Resources",
    subMenus: [
      { title: "Free Resources", link: "/free-resources" },
      { title: "Free Resources Material", link: "/free-resources/free-resources-material" },
    ],
  },
  {
    id: 5,
    icon: Leaf,
    link: "/achievements",
    title: "Achievements",
  },
  {
    id: 6,
    icon: Reviews,
    link: "/counselling",
    title: "Counselling",
    subMenus: [
      { title: "Counselling", link: "/counselling" },
      { title: "Counselling Form", link: "/counselling/counselling-form" },
    ],
  },
  // {
  //   id: 7,
  //   icon: Coupons,
  //   link: "/coupon",
  //   title: "Coupons",
  // },
  {
    id: 8,
    icon: Profile,
    link: "/profile",
    title: "Profile",
  },
  // {
  //   id: 9,
  //   icon: Setting,
  //   link: "#",
  //   title: "Online store",
  // },
  // {
  //   id: 10,
  //   icon: StuffUser,
  //   link: "/our-staff",
  //   title: "Our Staff",
  // },
  // {
  //   id: 11,
  //   icon: Pages,
  //   link: "/dashboard",
  //   title: "Pages",
  //   subMenus: [
  //     { title: "Register", link: "/register" },
  //     { title: "Login", link: "/login" },
  //     { title: "Forgot Password", link: "/forgot-password" }
  //   ],
  // },
  {
    id: 12,
    icon: Leaf,
    link: "/banner",
    title: "Banner Management",
  },
];

export default sidebar_menu;
