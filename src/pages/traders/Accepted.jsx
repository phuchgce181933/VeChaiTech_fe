import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function TradersAccepted() {
    const [orders, setOrders] = useState([]);
    const [adminLocation, setAdminLocation] = useState(null);

    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    // 📍 Lấy vị trí admin
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setAdminLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => console.error("Lỗi lấy vị trí admin:", error)
            );
        }
    }, []);

    // 📦 Lấy đơn hàng đã nhận
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/v1/orders/recycler/${user.id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setOrders(response.data.data || []);
            } catch (error) {
                console.error("Lỗi tải đơn đã nhận", error);
            }
        };

        if (user?.id) fetchOrders();
    }, [user, token]);

    // 🌍 Công thức Haversine
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // ⚠️ Kiểm tra khoảng cách order
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
            warning: distance > 5,
        };
    };

    // 🚀 Gọi API cập nhật trạng thái
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(
                `http://localhost:8080/api/v1/orders/${orderId}/status?status=${newStatus}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update state
            setOrders((prev) =>
                prev.map((o) =>
                    o.id === orderId ? { ...o, status: newStatus } : o
                )
            );

        } catch (error) {
            console.error("Lỗi cập nhật trạng thái", error);
            alert("Cập nhật thất bại!");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">🔄 Đơn hàng đã nhận</h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-4xl mb-4">📭</p>
                    <p className="text-gray-600 text-lg">Bạn chưa nhận đơn hàng nào</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {orders.map((order) => {
                        const distanceInfo = getDistanceWarning(order);

                        return (
                            <div
                                key={order.id}
                                className="bg-white shadow rounded-lg p-4 space-y-2"
                            >
                                {distanceInfo && distanceInfo.warning ? (
                                    <div className="p-3 bg-orange-100 border border-orange-400 text-orange-800 rounded-md text-sm">
                                        ⚠️ CẢNH BÁO: Khoảng cách hệ thống tính {distanceInfo.distance} km — coi chừng cook!
                                    </div>
                                ) : distanceInfo ? (
                                    <div className="p-3 bg-green-100 border border-green-400 text-green-800 rounded-md text-sm">
                                        ✅ Khoảng cách hợp lý: {distanceInfo.distance} km
                                    </div>
                                ) : null}

                                <p className="font-semibold">📌 Mã đơn: {order.id}</p>
                                <p>👤 Khách: {order.customerName}</p>
                                <p>📍 Địa chỉ: {order.addressFull}</p>
                                <p>♻️ Loại rác: {order.wasteListingName}</p>
                                <p>📞 SĐT: {order.customerPhone}</p>

                                <span className="text-green-600 font-semibold">
                                    {order.status}
                                </span>

                                <div className="mt-3 space-x-2">
                                    <button
                                        onClick={() =>
                                            window.open(
                                                `https://www.google.com/maps/dir/?api=1&destination=${order.latitude},${order.longitude}`,
                                                "_blank"
                                            )
                                        }
                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                                    >
                                        🗺️ Dẫn đường
                                    </button>

                                    <button
                                        onClick={() => updateOrderStatus(order.id, "COMPLETED")}
                                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                                        disabled={order.status === "COMPLETED"}
                                    >
                                        ✔️ Hoàn thành
                                    </button>

                                    <button
                                        onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                                        disabled={order.status === "CANCELLED"}
                                    >
                                        ❌ Hủy
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
