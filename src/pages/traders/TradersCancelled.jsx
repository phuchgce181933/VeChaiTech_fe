import { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function TradersCancelled() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/v1/orders/recycler/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const cancelled = (res.data.data || []).filter(
          (o) => o.status === "CANCELLED"
        );

        setOrders(cancelled);
      } catch (err) {
        console.error("Lỗi tải đơn đã hủy", err);
      }
    };

    if (user?.id && token) fetchOrders();
  }, [user, token]);

  /* ===== SEARCH FILTER ===== */
  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.id.toString().includes(search) ||
        o.customerName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  return (
    <div className="space-y-8">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            ❌ Đơn hàng đã bị hủy
          </h1>
          <p className="text-gray-500 mt-1">
            Các đơn hàng không thể thực hiện hoặc đã bị khách hủy
          </p>
        </div>
      </div>

      {/* ===== STATS + SEARCH ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat card */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-2xl">
            ❌
          </div>
          <div>
            <p className="text-sm text-gray-500">Tổng đơn đã hủy</p>
            <p className="text-2xl font-bold text-gray-800">
              {orders.length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="md:col-span-2 bg-white rounded-2xl border shadow-sm p-6">
          <label className="text-sm text-gray-500">Tìm kiếm đơn</label>
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc tên khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
      </div>

      {/* ===== LIST ===== */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border shadow-sm p-20 text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl font-semibold text-gray-700">
            Không có đơn hàng bị hủy
          </p>
          <p className="text-gray-500 mt-2">
            Rất tốt! Bạn đang xử lý đơn hàng hiệu quả 🎉
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="relative bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition"
            >
              {/* Left accent */}
              <div className="absolute left-0 top-0 h-full w-1 bg-red-500 rounded-l-2xl" />

              {/* Top */}
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-gray-800">
                  Đơn #{order.id}
                </p>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                  ĐÃ HỦY
                </span>
              </div>

              {/* Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700">
                <div>
                  <p className="text-gray-400 text-xs">Khách hàng</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Số điện thoại</p>
                  <p className="font-medium">{order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Địa chỉ</p>
                  <p className="font-medium truncate">{order.addressFull}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Loại rác</p>
                  <p className="font-medium">{order.wasteListingName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
