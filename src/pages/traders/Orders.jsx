import { useEffect, useState } from "react";

export default function TradersOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("CONFIRMED");

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("token");

            let url = "http://localhost:8080/api/v1/orders";

            // If not filtering by ALL, fetch by status
            if (filter !== "ALL") {
                url = `http://localhost:8080/api/v1/orders/status/${filter}`;
            }

            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Không thể tải đơn hàng`);
            }

            const result = await response.json();
            if (result.data) {
                setOrders(result.data);
            }
        } catch (err) {
            console.error("Lỗi tải danh sách đơn hàng:", err);
            setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const acceptOrder = async (orderId) => {
        try {
            const token = localStorage.getItem("token");
            const recyclerId = JSON.parse(localStorage.getItem("user"))?.id; // hoặc props tùy bạn lấy ở đâu
            console.log("userId:", localStorage.getItem("userId"));

            const response = await fetch(`http://localhost:8080/api/v1/orders/${orderId}/assign-recycler?recyclerId=${recyclerId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Không thể nhận đơn");
            }

            const result = await response.json();
            console.log("Đã nhận đơn:", result);

            fetchOrders(); // Reload danh sách
        } catch (err) {
            alert("Nhận đơn thất bại, có thể đã có người khác nhận!");
        }
    };


    const filteredOrders = orders.filter(order => order.status === "CONFIRMED");


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">📦 Quản lý đơn hàng</h1>
                <p className="text-gray-600">Tổng số đơn: <span className="font-semibold">{orders.length}</span></p>
            </div>

            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Bộ lọc */}
            <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-2">
                <button
                    onClick={() => setFilter("ALL")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${filter === "ALL"
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    Tất cả ({orders.length})
                </button>
            </div>

            {/* Empty State */}
            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
                    </div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-4xl mb-4">📭</p>
                    <p className="text-gray-600 text-lg">Chưa có đơn hàng nào</p>
                    <p className="text-gray-500 text-sm mt-2">Hãy chờ các đơn hàng từ khách hàng</p>
                </div>
            ) : (
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
                                {filteredOrders.map(order => (
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
                                            <button className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                                                Chi tiết
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {order.status === "CONFIRMED" ? (
                                                <button
                                                    onClick={() => acceptOrder(order.id)}
                                                    className="text-green-600 hover:text-green-800 font-medium hover:underline"
                                                >
                                                    Nhận đơn
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">Không khả dụng</span>
                                            )}
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

    function getStatusColor(status) {
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
    }

    function getStatusLabel(status) {
        switch (status) {
            case "PENDING":
                return "⏳ Chờ xác nhận";
            case "CONFIRMED":
                return "✅ Đã xác nhận";
            case "COMPLETED":
                return "✔️ Hoàn thành";
            case "CANCELLED":
                return "❌ Hủy";
            default:
                return status;
        }
    }
}
