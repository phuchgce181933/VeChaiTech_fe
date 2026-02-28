import { useEffect, useState } from "react";

export default function TradersOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/api/v1/orders/status/CONFIRMED`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tải đơn hàng");
      }

      const result = await response.json();
      setOrders(result.data || []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const recyclerId = JSON.parse(localStorage.getItem("user"))?.id;

      const response = await fetch(
        `${API_BASE}/api/v1/orders/${orderId}/assign-recycler?recyclerId=${recyclerId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Nhận đơn thất bại");
      }

      fetchOrders();
    } catch {
      alert("Nhận đơn thất bại, có thể đơn đã được người khác nhận.");
    }
  };

  return (
    <div className="space-y-6 px-4 md:px-0 pb-10">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          📦 Đơn hàng có thể nhận
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Tổng số đơn: <b>{orders.length}</b>
        </p>
      </div>

      {/* ===== NOTE ===== */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl text-sm">
        ℹ️ <b>Lưu ý:</b> Khi <b>nhận đơn</b>, hệ thống sẽ thu
        <b className="mx-1">1.500 VNĐ</b>
        để mở khóa <b>địa chỉ chi tiết</b> của khách hàng.
      </div>

      {/* ===== ERROR ===== */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ===== LOADING ===== */}
      {loading ? (
        <div className="flex items-center justify-center h-72">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">
              Đang tải đơn hàng...
            </p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        /* ===== EMPTY ===== */
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-lg font-semibold text-gray-700">
            Hiện chưa có đơn hàng nào
          </p>
          <p className="text-gray-500 mt-1 text-sm">
            Vui lòng quay lại sau
          </p>
        </div>
      ) : (
        /* ===== RESPONSIVE LIST ===== */
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          {/* ===== DESKTOP TABLE ===== */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Mã đơn
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Loại rác
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Địa chỉ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium">
                      #{order.id}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {order.customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {order.customerId}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {order.wasteListingName || "-"}
                    </td>

                    <td className="px-6 py-4 text-gray-500 italic">
                      🔒 Địa chỉ được ẩn
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        ✅ Đã xác nhận
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => acceptOrder(order.id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
                      >
                        Nhận đơn
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== MOBILE CARD LIST ===== */}
          <div className="md:hidden p-4 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-xl p-4 shadow-sm space-y-3 bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm">
                    Đơn #{order.id}
                  </p>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    Đã xác nhận
                  </span>
                </div>

                <div className="text-sm space-y-1">
                  <p>
                    👤{" "}
                    <span className="font-medium">
                      {order.customerName}
                    </span>
                  </p>
                  <p className="text-gray-500 text-xs">
                    ID: {order.customerId}
                  </p>
                  <p>
                    ♻️ {order.wasteListingName || "-"}
                  </p>
                  <p className="text-gray-500 italic">
                    🔒 Địa chỉ được ẩn
                  </p>
                </div>

                <button
                  onClick={() => acceptOrder(order.id)}
                  className="w-full py-3 bg-green-600 active:scale-[0.98] hover:bg-green-700 text-white rounded-lg font-medium transition"
                >
                  Nhận đơn (1.500 VNĐ)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}