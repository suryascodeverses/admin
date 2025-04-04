import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import ReviewProductArea from "../components/products/review-products/review-product-area";

const OrdersPage = () => {
  return (
    <Wrapper>
    <div className="body-content px-8 py-8 bg-slate-100">
      {/* breadcrumb start */}
      <Breadcrumb title="Reviews" subtitle="Reviews List" />
      {/* breadcrumb end */}

      {/* review area start */}
      <ReviewProductArea />
      {/* review area end */}
    </div>
    </Wrapper>
  );
};

export default OrdersPage;
