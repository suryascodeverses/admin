import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import AddCategory from "../components/category/add-category";
import CourseManagement from "../components/course/add-course";

const CategoryPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        {/* breadcrumb start */}
        <Breadcrumb title="Course" subtitle="Course Management" />
        {/* breadcrumb end */}

        {/*add category area start */}
        <CourseManagement />
        {/*add category area end */}
      </div>
    </Wrapper>
  );
};

export default CategoryPage;
