import { useEffect, useState } from "react";

export default function OrdersAdmin() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [adminLocation, setAdminLocation] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState("");

    useEffect(() => {
        fetchOrders();
        getAdminLocation();
    }, []);

    const getAdminLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setAdminLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Lỗi lấy vị trí admin:", error);
                }
            );
        }
    };

    // Công thức Haversine để tính khoảng cách giữa 2 tọa độ (km)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Bán kính Trái Đất (km)
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Kiểm tra khoảng cách giữa admin và địa chỉ order
    const getDistanceWarning = (order) => {
        if (!adminLocation || !order.latitude || !order.longitude) return null;

        const distance = calculateDistance(
            adminLocation.latitude,
            adminLocation.longitude,
            parseFloat(order.latitude),
            parseFloat(order.longitude)
        );

        return {
            distance: distance.toFixed(2),
            warning: distance > 5, // Cảnh báo nếu cách xa > 5km
        };
    };

    // Hàm cập nhật trạng thái đơn hàng
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            setUpdatingStatus(true);
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:8080/api/v1/orders/${orderId}/status?status=${newStatus}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP ${response.status}: Cập nhật trạng thái thất bại`);
            }

            await response.json();

            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));

            // Update selected order
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }

            setUpdateSuccess(`✅ Cập nhật trạng thái thành công: ${getStatusLabel(newStatus)}`);
            setTimeout(() => setUpdateSuccess(""), 3000);
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
            setError(`❌ Lỗi: ${err.message}`);
            setTimeout(() => setError(""), 5000);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8080/api/v1/orders", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const result = await response.json();

            if (result.data) {
                setOrders(result.data);
            }
            setError("");
        } catch (err) {
            console.error("Lỗi tải danh sách đơn hàng:", err);
            setError("Không thể tải danh sách đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = statusFilter === "ALL"
        ? orders
        : orders.filter(order => order.status === statusFilter);

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "CONFIRMED":
                return "bg-blue-100 text-blue-800";
            case "CLAIMED":
                return "bg-purple-100 text-purple-800";
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
                return "✅ Xác nhận";
            case "CLAIMED":
                return "👤 Đã nhận";
            case "COMPLETED":
                return "✔️ Hoàn thành";
            case "CANCELLED":
                return "❌ Hủy";
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">📦 Quản lý Đơn hàng</h1>
                <p className="text-gray-600">Tổng số đơn: <span className="font-semibold">{orders.length}</span></p>
            </div>

            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {updateSuccess && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    {updateSuccess}
                </div>
            )}

            {/* Bộ lọc trạng thái */}
            <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-2">
                <button
                    onClick={() => setStatusFilter("ALL")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${statusFilter === "ALL"
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    Tất cả ({orders.length})
                </button>
                <button
                    onClick={() => setStatusFilter("PENDING")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${statusFilter === "PENDING"
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    ⏳ Chờ ({orders.filter(o => o.status === "PENDING").length})
                </button>
                <button
                    onClick={() => setStatusFilter("CONFIRMED")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${statusFilter === "CONFIRMED"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    ✅ Xác nhận ({orders.filter(o => o.status === "CONFIRMED").length})
                </button>
                <button
                    onClick={() => setStatusFilter("COMPLETED")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${statusFilter === "COMPLETED"
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    ✔️ Hoàn thành ({orders.filter(o => o.status === "COMPLETED").length})
                </button>
                <button
                    onClick={() => setStatusFilter("CLAIMED")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${statusFilter === "CLAIMED"
                            ? "bg-purple-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    👤 Đã nhận ({orders.filter(o => o.status === "CLAIMED").length})
                </button>
                <button
                    onClick={() => setStatusFilter("CANCELLED")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${statusFilter === "CANCELLED"
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    ❌ Hủy ({orders.filter(o => o.status === "CANCELLED").length})
                </button>
            </div>

            {/* Bảng đơn hàng */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Khách hàng</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vật liệu</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Địa chỉ</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        Không có đơn hàng nào
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="font-medium">{order.customerName}</div>
                                            <div className="text-xs text-gray-500">ID: {order.customerId}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {order.wasteListingName || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="font-medium">{order.addressPublic}</div>
                                            <div className="text-xs text-gray-500">📍 {order.latitude}, {order.longitude}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal chi tiết đơn hàng */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Chi tiết đơn hàng #{selectedOrder.id}</h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-2xl hover:opacity-80 transition"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {(() => {
                                const distanceInfo = getDistanceWarning(selectedOrder);
                                return distanceInfo && distanceInfo.warning ? (
                                    <div className="p-4 bg-orange-100 border-2 border-orange-400 text-orange-800 rounded-lg">
                                        <p className="font-bold text-lg">⚠️ CẢNH BÁO: Địa chỉ cách xa vị trí bạn</p>
                                        <p className="text-sm mt-2">
                                            Khoảng cách: <span className="font-bold">{distanceInfo.distance} km</span>
                                        </p>
                                        <p className="text-sm mt-1">
                                            📍 Vị trí của bạn: ({adminLocation?.latitude?.toFixed(4)}, {adminLocation?.longitude?.toFixed(4)})
                                        </p>
                                        <p className="text-sm mt-1">
                                            📍 Vị trí đơn hàng: ({selectedOrder.latitude}, {selectedOrder.longitude})
                                        </p>
                                        <p className="text-xs mt-2 text-orange-700">
                                            ⚠️ Vui lòng xác nhận khách hàng và địa chỉ trước khi duyệt
                                        </p>
                                    </div>
                                ) : distanceInfo ? (
                                    <div className="p-3 bg-green-100 border border-green-400 text-green-800 rounded-lg text-sm">
                                        ✅ Khoảng cách: {distanceInfo.distance} km (Hợp lý)
                                    </div>
                                ) : null;
                            })()}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Khách hàng</p>
                                    <p className="font-semibold text-gray-800">{selectedOrder.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">ID Khách hàng</p>
                                    <p className="font-semibold text-gray-800">{selectedOrder.customerId}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Vật liệu</p>
                                    <p className="font-semibold text-gray-800">{selectedOrder.wasteListingName || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Trạng thái</p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                                        {getStatusLabel(selectedOrder.status)}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-gray-500 text-sm mb-2">Địa chỉ công khai</p>
                                <p className="font-semibold text-gray-800">{selectedOrder.addressPublic}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-2">Địa chỉ đầy đủ</p>
                                <p className="font-semibold text-gray-800">{selectedOrder.addressFull}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Vĩ độ</p>
                                    <p className="font-semibold text-gray-800">{selectedOrder.latitude}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Kinh độ</p>
                                    <p className="font-semibold text-gray-800">{selectedOrder.longitude}</p>
                                </div>
                            </div>

                            {selectedOrder.status === "CLAIMED" && selectedOrder.recyclerName ? (
                                <div className="border-t pt-4 bg-purple-50 p-3 rounded-lg">
                                    <p className="text-gray-500 text-sm mb-1">👤 Người tái chế đã nhận</p>
                                    <p className="font-semibold text-gray-800">{selectedOrder.recyclerName}</p>
                                    <p className="text-xs text-gray-600 mt-1">ID: {selectedOrder.recyclerId}</p>
                                </div>
                            ) : selectedOrder.recyclerName && (
                                <div className="border-t pt-4">
                                    <p className="text-gray-500 text-sm">Người tái chế</p>
                                    <p className="font-semibold text-gray-800">{selectedOrder.recyclerName}</p>
                                </div>
                            )}

                            {/* Status Update Section */}
                            <div className="border-t pt-4">
                                <p className="text-gray-500 text-sm mb-2">Cập nhật trạng thái</p>
                                <div className="flex gap-2 flex-wrap">
                                    {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                                            disabled={updatingStatus || selectedOrder.status === status}
                                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${selectedOrder.status === status
                                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                    : `${getStatusColor(status)} hover:opacity-80 cursor-pointer`
                                                }`}
                                        >
                                            {getStatusLabel(status)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 pt-4 border-t">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition"
                                >
                                    Đóng
                                </button>
                                <button
                                    onClick={() => {
                                        window.open(`https://maps.google.com/?q=${selectedOrder.latitude},${selectedOrder.longitude}`, '_blank');
                                    }}
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                                >
                                    📍 Xem bản đồ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
