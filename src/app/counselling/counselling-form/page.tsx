import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import AddCategory from "../../components/category/add-category";
import CourseManagement from "../../components/course/add-course";
import CourseMaterialManagement from "@/app/components/course/add-course-material";
import CareerCounsellingRequests from "@/app/components/course/counsellingFormManagement";

const CategoryPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        {/* breadcrumb start */}
        <Breadcrumb title="Counselling" subtitle="Counselling Form" />
        {/* breadcrumb end */}

        {/*add category area start */}
        <CareerCounsellingRequests />
        {/*add category area end */}
      </div>
    </Wrapper>
  );
};

export default CategoryPage;
