import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import AddCategory from "../components/category/add-category";
import CourseManagement from "../components/course/add-course";
import FreeResourceManagement from "../components/course/add-free-resource";

const CategoryPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        {/* breadcrumb start */}
        <Breadcrumb title="Free Resources" subtitle="Free Resources" />
        {/* breadcrumb end */}

        {/*add category area start */}
        <FreeResourceManagement />
        {/*add category area end */}
      </div>
    </Wrapper>
  );
};

export default CategoryPage;
