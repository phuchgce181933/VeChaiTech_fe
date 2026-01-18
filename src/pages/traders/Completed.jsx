import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function TradersCompleted() {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/orders/recycler/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        const doneCanceled = (response.data.data || []).filter(
          (o) => o.status === "COMPLETED" || o.status === "CANCELLED"
        );

        setOrders(doneCanceled);
      } catch (error) {
        console.error("Lỗi tải đơn hoàn thành / hủy", error);
      }
    };

    if (user?.id) fetchOrders();
  }, [user, token]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">📁 Đơn đã hoàn thành / hủy</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-gray-600 text-lg">
            Hiện chưa có đơn hoàn thành hoặc bị hủy
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow rounded-lg p-4 space-y-2">
              <p className="font-semibold">📌 Mã đơn: {order.id}</p>
              <p>👤 Khách: {order.customerName}</p>
              <p>📍 Địa chỉ: {order.addressFull}</p>
              <p>♻️ Loại rác: {order.wasteListingName}</p>
              <p>📞 Số điện thoại: {order.customerPhone}</p>

              <span
                className={`px-3 py-1 rounded-md font-semibold ${
                  order.status === "COMPLETED"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.status === "COMPLETED" ? "✔️ Hoàn thành" : "❌ Đã hủy"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
