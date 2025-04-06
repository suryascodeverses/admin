import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import AddCategoryType from "../components/category/add-category-type";

const CategoryPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        {/* breadcrumb start */}
        <Breadcrumb title="Category" subtitle="Category Type" />
        {/* breadcrumb end */}

        {/*add category area start */}
        <AddCategoryType />
        {/*add category area end */}
      </div>
    </Wrapper>
  );
};

export default CategoryPage;
