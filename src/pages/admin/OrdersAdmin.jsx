import { useEffect, useMemo, useState } from "react";

const STATUS_FLOW = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

const STATUS_OPTIONS = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState("");

  // 🔎 FILTER & SEARCH
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/v1/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setOrders(data.data || []);
    } catch {
      setError("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 FILTER + SEARCH LOGIC
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus =
        statusFilter === "ALL" || o.status === statusFilter;

      const keyword = searchTerm.toLowerCase();
      const matchSearch =
        o.id?.toString().includes(keyword) ||
        o.customerName?.toLowerCase().includes(keyword) ||
        o.wasteListingName?.toLowerCase().includes(keyword);

      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, searchTerm]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE}/api/v1/orders/${orderId}/status?status=${newStatus}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Cập nhật thất bại");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      setUpdateSuccess("✅ Cập nhật trạng thái thành công");
      setTimeout(() => setUpdateSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 4000);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "⏳ Đang chờ";
      case "CONFIRMED":
        return "✅ Đã xác nhận";
      case "COMPLETED":
        return "✔️ Hoàn thành";
      case "CANCELLED":
        return "❌ Đã hủy";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">📦 Quản lý Đơn hàng</h1>

      {error && <div className="bg-red-100 p-3 rounded">{error}</div>}
      {updateSuccess && <div className="bg-green-100 p-3 rounded">{updateSuccess}</div>}

      {/* 🔍 FILTER + SEARCH */}
      <div className="bg-white rounded shadow p-4 flex flex-col md:flex-row gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "Tất cả trạng thái" : getStatusLabel(s)}
            </option>
          ))}
        </select>

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Tìm theo ID, khách hàng, vật liệu..."
          className="border rounded px-3 py-2 flex-1"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Khách hàng</th>
              <th className="px-4 py-2 text-left">Vật liệu</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>
              <th className="px-4 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  Không tìm thấy đơn hàng
                </td>
              </tr>
            )}

            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">#{order.id}</td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3">{order.wasteListingName || "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:underline"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-xl p-6 space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">Đơn hàng #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <p><b>Khách:</b> {selectedOrder.customerName}</p>
            <p><b>Địa chỉ:</b> {selectedOrder.addressPublic}</p>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                selectedOrder.status
              )}`}
            >
              {getStatusLabel(selectedOrder.status)}
            </span>

            {/* STATUS FLOW */}
            <div className="border-t pt-4">
              <p className="text-sm mb-2">Cập nhật trạng thái</p>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.filter((s) => s !== "ALL").map((status) => {
                  const canChange =
                    STATUS_FLOW[selectedOrder.status]?.includes(status);

                  return (
                    <button
                      key={status}
                      disabled={!canChange || updatingStatus}
                      onClick={() =>
                        handleUpdateStatus(selectedOrder.id, status)
                      }
                      className={`px-3 py-1 text-xs rounded-lg font-semibold ${
                        canChange
                          ? `${getStatusColor(status)} hover:opacity-80`
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      title={
                        canChange
                          ? "Cập nhật trạng thái"
                          : "Không thể quay ngược trạng thái"
                      }
                    >
                      {getStatusLabel(status)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
