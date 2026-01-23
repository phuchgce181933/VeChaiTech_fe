import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function TradersAccepted() {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    const [orders, setOrders] = useState([]);
    const [adminLocation, setAdminLocation] = useState(null);

    // ===== FILTER =====
    const [filter, setFilter] = useState("ALL");

    // ===== CANCEL STATES =====
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelFile, setCancelFile] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    // 📍 Lấy vị trí recycler
    useEffect(() => {
        navigator.geolocation?.getCurrentPosition(
            (pos) =>
                setAdminLocation({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                }),
            () => {}
        );
    }, []);

    // 📦 Lấy đơn đã nhận
    useEffect(() => {
        if (!user?.id) return;

        axios
            .get(`http://localhost:8080/api/v1/orders/recycler/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setOrders(res.data.data || []))
            .catch((err) => console.error(err));
    }, [user, token]);

    // 🌍 Haversine
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    const getDistanceWarning = (order) => {
        if (!adminLocation) return null;
        const d = calculateDistance(
            adminLocation.latitude,
            adminLocation.longitude,
            order.latitude,
            order.longitude
        );
        return { distance: d.toFixed(2), warning: d > 5 };
    };

    // ===== OPEN CANCEL =====
    const openCancelModal = (orderId) => {
        setSelectedOrderId(orderId);
        setCancelReason("");
        setCancelFile(null);
        setShowCancelModal(true);
    };

    // ===== CANCEL ORDER =====
    const cancelOrder = async () => {
        if (!cancelReason || !cancelFile) {
            alert("Vui lòng nhập lý do và chọn ảnh/video");
            return;
        }

        try {
            setCancelLoading(true);

            const formData = new FormData();
            formData.append("file", cancelFile);
            formData.append("reason", cancelReason);
            formData.append("userId", user.id);

            await axios.post(
                `http://localhost:8080/api/v1/orders/${selectedOrderId}/cancel`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setOrders((prev) =>
                prev.map((o) =>
                    o.id === selectedOrderId
                        ? { ...o, status: "CANCELLED" }
                        : o
                )
            );

            setShowCancelModal(false);
        } catch {
            alert("Hủy đơn thất bại");
        } finally {
            setCancelLoading(false);
        }
    };

    // ===== COMPLETE ORDER =====
    const completeOrder = async (orderId) => {
        try {
            await axios.patch(
                `http://localhost:8080/api/v1/orders/${orderId}/status?status=COMPLETED`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setOrders((prev) =>
                prev.map((o) =>
                    o.id === orderId ? { ...o, status: "COMPLETED" } : o
                )
            );
        } catch {
            alert("Hoàn thành thất bại");
        }
    };

    // ===== FILTER ORDERS =====
    const filteredOrders =
        filter === "ALL"
            ? orders
            : orders.filter((o) => o.status === filter);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">🔄 Đơn hàng đã nhận</h1>

            {/* ===== FILTER BUTTONS ===== */}
            <div className="flex gap-2">
                {["ALL", "CLAIMED", "CANCELLED"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            filter === f
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {filteredOrders.length === 0 ? (
                <div className="bg-white shadow p-10 text-center">
                    📭 Không có đơn
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredOrders.map((order) => {
                        const d = getDistanceWarning(order);

                        return (
                            <div
                                key={order.id}
                                className="bg-white shadow rounded-lg p-4 space-y-2"
                            >
                                {d && (
                                    <div
                                        className={`p-2 text-sm rounded ${
                                            d.warning
                                                ? "bg-orange-100 text-orange-800"
                                                : "bg-green-100 text-green-800"
                                        }`}
                                    >
                                        {d.warning
                                            ? `⚠️ ${d.distance} km`
                                            : `✅ ${d.distance} km`}
                                    </div>
                                )}

                                <p>📌 Mã đơn: {order.id}</p>
                                <p>👤 {order.customerName}</p>
                                <p>📍 {order.addressFull}</p>
                                <p>♻️ {order.wasteListingName}</p>

                                <span className="font-semibold">
                                    {order.status}
                                </span>

                                {/* ===== ACTION BUTTONS ===== */}
                                <div className="flex gap-2 mt-3">
                                    {order.status === "CLAIMED" && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    completeOrder(order.id)
                                                }
                                                className="px-3 py-2 bg-green-600 text-white rounded-lg"
                                            >
                                                ✔️ Hoàn thành
                                            </button>
                                            <button
                                                onClick={() =>
                                                    openCancelModal(order.id)
                                                }
                                                className="px-3 py-2 bg-red-600 text-white rounded-lg"
                                            >
                                                ❌ Hủy
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ===== CANCEL MODAL ===== */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold text-red-600 mb-4">
                            Hủy đơn
                        </h2>

                        <textarea
                            value={cancelReason}
                            onChange={(e) =>
                                setCancelReason(e.target.value)
                            }
                            placeholder="Lý do hủy..."
                            className="w-full border rounded p-3 mb-3"
                        />

                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) =>
                                setCancelFile(e.target.files[0])
                            }
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={cancelOrder}
                                disabled={cancelLoading}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                {cancelLoading
                                    ? "Đang hủy..."
                                    : "Xác nhận"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
