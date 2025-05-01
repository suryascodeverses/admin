import Wrapper from "@/layout/wrapper";
import OrdersTable from "../components/orders/orders-table";

const OrdersPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <div className="bg-white rounded-lg p-6">
          <OrdersTable />
        </div>
      </div>
    </Wrapper>
  );
};

export default OrdersPage;
