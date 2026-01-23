import { useEffect, useState } from "react";

export default function TradersOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/v1/orders/status/CONFIRMED",
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
        `http://localhost:8080/api/v1/orders/${orderId}/assign-recycler?recyclerId=${recyclerId}`,
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
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          📦 Đơn hàng có thể nhận
        </h1>
        <p className="text-gray-600 mt-1">
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
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* ===== LOADING ===== */}
      {loading ? (
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải đơn hàng...</p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        /* ===== EMPTY ===== */
        <div className="bg-white rounded-2xl shadow p-14 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-lg font-semibold text-gray-700">
            Hiện chưa có đơn hàng nào
          </p>
          <p className="text-gray-500 mt-1">
            Vui lòng quay lại sau
          </p>
        </div>
      ) : (
        /* ===== TABLE ===== */
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Mã đơn
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Loại rác
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Địa chỉ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
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

                    {/* ADDRESS HIDDEN */}
                    <td className="px-6 py-4 text-gray-500 italic">
                      🔒 Địa chỉ được ẩn
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        ✅ Đã xác nhận
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center space-y-1">
                      <button
                        onClick={() => acceptOrder(order.id)}
                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
                      >
                        Nhận đơn
                      </button>
                      <p className="text-xs text-gray-500">
                        Phí mở địa chỉ:{" "}
                        <span className="font-semibold">
                          1.500 VNĐ
                        </span>
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
