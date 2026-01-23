import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function CreateOrder() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [wasteListings, setWasteListings] = useState([]);
  const [geoError, setGeoError] = useState(false);
  const [formData, setFormData] = useState({
    customerId: 0,
    wasteListingId: 0,
    addressPublic: "",
    latitude: "",
    longitude: "",
    addressFull: "",
  });
  const CAN_THO_WARDS = [
    // ===== Ninh Kiều =====
    "Phường An Hòa",
    "Phường An Nghiệp",
    "Phường An Phú",
    "Phường Cái Khế",
    "Phường Hưng Lợi",
    "Phường Tân An",
    "Phường Thới Bình",
    "Phường Xuân Khánh",

    // ===== Bình Thủy =====
    "Phường An Thới",
    "Phường Bình Thủy",
    "Phường Bùi Hữu Nghĩa",
    "Phường Long Hòa",
    "Phường Long Tuyền",
    "Phường Thới An Đông",
    "Phường Trà An",
    "Phường Trà Nóc",

    // ===== Cái Răng =====
    "Phường Ba Láng",
    "Phường Hưng Phú",
    "Phường Lê Bình",
    "Phường Phú Thứ",
    "Phường Tân Phú",
    "Phường Thường Thạnh",

    // ===== Ô Môn =====
    "Phường Châu Văn Liêm",
    "Phường Long Hưng",
    "Phường Phước Thới",
    "Phường Thới An",
    "Phường Thới Hòa",
    "Phường Thới Long",

    // ===== Thốt Nốt =====
    "Phường Tân Hưng",
    "Phường Tân Lộc",
    "Phường Tân Thạnh",
    "Phường Thạnh Hòa",
    "Phường Thạnh Phước",
    "Phường Thới Thuận",
    "Phường Thuận An",

    // ===== Huyện =====
    "Xã Đông Hiệp",
    "Xã Đông Thắng",
    "Xã Thới Đông",
    "Xã Thới Xuân",
    "Xã Trung An",
    "Xã Trung Hưng",
    "Xã Trung Thạnh",
    "Xã Trường Long",
    "Xã Trường Xuân",
    "Xã Trường Xuân A",
    "Xã Trường Xuân B",
  ];

  // Lấy tọa độ từ geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
          setGeoError(false);
        },
        (error) => {
          console.error("Lỗi lấy vị trí:", error);
          setGeoError(true);
        }
      );
    } else {
      setGeoError(true);
    }
  }, []);

  // Lấy danh sách vật liệu
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/wastelistings/list")
      .then((res) => res.json())
      .then((data) => {
        setWasteListings(data || []);
      })
      .catch((err) => console.error("Lỗi tải danh sách vật liệu:", err));
  }, []);

  // Lấy ID khách hàng từ user đã đăng nhập hoặc query params
  useEffect(() => {
    const wasteListingId = searchParams.get("wasteListingId");
    let customerId = 0;

    if (user && user.id) {
      customerId = user.id;
    } else {
      const storedCustomerId = localStorage.getItem("customerId");
      customerId = storedCustomerId ? parseInt(storedCustomerId) : 0;
    }

    setFormData((prev) => ({
      ...prev,
      customerId,
      wasteListingId: wasteListingId ? parseInt(wasteListingId) : 0,
    }));
  }, [user, searchParams]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Lỗi: đã đăng nhập đâu ????? ${response.statusText}`);
      }

      await response.json();
      setSuccess(
        "🎉 Đặt đơn hàng thành công!\n\n" +
        "Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.\n" +
        "Đơn hàng của bạn đã được tiếp nhận và đang được hệ thống xử lý.\n" +
        "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất, tối đa trong vòng 24 giờ để xác nhận và thu gom."
      );
      setFormData({
        customerId: 0,
        wasteListingId: 0,
        addressPublic: "",
        latitude: "",
        longitude: "",
        addressFull: "",
      });
    } catch (err) {
      console.error("Lỗi khi tạo đơn hàng:", err);
      setError(`❌ ${err.message || "Có lỗi xảy ra. Vui lòng thử lại!"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 mt-2 mb-20">
          <h1 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#2E7D32] via-[#00A8CC] to-[#66BB6A]">
            📦 Tạo Đơn Thu Gom
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Điền thông tin để tạo đơn thu gom vật liệu tái chế
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-8 p-6 bg-green-50 border border-green-300 text-green-800 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-3">🎉 Đặt đơn hàng thành công!</h3>

              <p className="mb-2">
                Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.
              </p>

              <p className="mb-2">
                Đơn hàng của bạn đã được <strong>tiếp nhận</strong> và đang được
                <strong> hệ thống xử lý</strong>.
              </p>

              <p className="mb-4">
                Chúng tôi cam kết sẽ <strong>liên hệ với bạn trong thời gian sớm nhất,
                  tối đa trong vòng 24 giờ</strong> để xác nhận và tiến hành thu gom.
              </p>

              <button
                onClick={() => navigate("/trang-chu")}
                className="mt-2 px-6 py-3 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white font-semibold rounded-lg hover:scale-105 transition-all"
              >
                🏠 Quay về trang chủ
              </button>
            </div>
          )}

          {geoError && (
            <div className="mb-6 p-4 bg-orange-100 border border-orange-400 text-orange-700 rounded-lg">
              <strong>📍 Vui lòng bật định vị</strong>
              <p className="text-sm mt-2">Để tạo đơn hàng, bạn cần cho phép trình duyệt truy cập vị trí của bạn.</p>
              <p className="text-sm mt-2">Hướng dẫn: Kiểm tra thanh địa chỉ trình duyệt → Cho phép truy cập vị trí → Tải lại trang</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Chọn loại vật liệu */}
            <div>
              <label className="block text-sm font-semibold text-[#2E7D32] mb-2">
                Chọn loại vật liệu tái chế *
              </label>
              <select
                name="wasteListingId"
                value={formData.wasteListingId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-[#66BB6A]/50 rounded-lg focus:outline-none focus:border-[#66BB6A] focus:ring-2 focus:ring-[#66BB6A]/20 transition bg-white"
              >
                <option value={0}>-- Chọn loại vật liệu --</option>
                {wasteListings.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} {item.price ? `- ${item.price.toLocaleString()}đ/kg` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Địa chỉ công khai */}
            <div>
              {/* <label className="block text-sm font-semibold text-[#2E7D32] mb-2">
                Địa chỉ công khai *
              </label> */}
              {/* Địa chỉ công khai (Phường / Xã - Cần Thơ) */}
              <div>
                <label className="block text-sm font-semibold text-[#2E7D32] mb-2">
                  Phường / Xã (TP. Cần Thơ) *
                </label>
                <label className="block text-sm font-semibold text-[#f20303] mb-2">
                  Hệ thống hiện chỉ hỗ trợ TP. Cần Thơ
                </label>

                <select
                  name="addressPublic"
                  value={formData.addressPublic}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-[#66BB6A]/50 rounded-lg
      focus:outline-none focus:border-[#66BB6A]
      focus:ring-2 focus:ring-[#66BB6A]/20 transition bg-white"
                >             
                  {CAN_THO_WARDS.map((ward) => (
                    <option key={ward} value={ward}>
                      {ward}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Địa chỉ đầy đủ */}
            <div>
              <label className="block text-sm font-semibold text-[#2E7D32] mb-2">
                Địa chỉ chi tiết *
              </label>
              <textarea
                name="addressFull"
                value={formData.addressFull}
                onChange={handleChange}
                placeholder="VD: 123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
                rows="3"
                required
                className="w-full px-4 py-3 border-2 border-[#66BB6A]/50 rounded-lg focus:outline-none focus:border-[#66BB6A] focus:ring-2 focus:ring-[#66BB6A]/20 transition resize-none"
              ></textarea>
            </div>

            {/* Vĩ độ - Chỉ hiện khi có lỗi */}
            {geoError && (
              <div>
                <label className="block text-sm font-semibold text-[#2E7D32] mb-2">
                  Vĩ độ (Latitude) *
                </label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="VD: 10.7769"
                  required
                  className="w-full px-4 py-3 border-2 border-[#66BB6A]/50 rounded-lg focus:outline-none focus:border-[#66BB6A] focus:ring-2 focus:ring-[#66BB6A]/20 transition"
                />
              </div>
            )}

            {/* Kinh độ - Chỉ hiện khi có lỗi */}
            {geoError && (
              <div>
                <label className="block text-sm font-semibold text-[#2E7D32] mb-2">
                  Kinh độ (Longitude) *
                </label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="VD: 106.6955"
                  required
                  className="w-full px-4 py-3 border-2 border-[#66BB6A]/50 rounded-lg focus:outline-none focus:border-[#66BB6A] focus:ring-2 focus:ring-[#66BB6A]/20 transition"
                />
              </div>
            )}

            {/* Info - Chỉ hiện khi có lỗi */}
            {geoError && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>ℹ️ Thông tin tự động:</strong>
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  • ID khách hàng: {formData.customerId > 0 ? formData.customerId : <span className="text-orange-600">⚠️ Vui lòng đăng nhập</span>}
                </p>
                <p className="text-sm text-blue-600">
                  • ID vật liệu: {formData.wasteListingId > 0 ? formData.wasteListingId : <span className="text-orange-600">⚠️ Chưa chọn</span>}
                </p>
                <p className="text-sm text-blue-600">
                  • Vị trí: {formData.latitude ? "✅ Đã lấy" : <span className="text-orange-600">⚠️ Chưa lấy</span>}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/trang-chu")}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2E7D32] via-[#00A8CC] to-[#66BB6A] text-white font-bold rounded-lg hover:scale-105 disabled:opacity-50 disabled:scale-100 active:scale-95 transition-all"
              >
                {loading ? "Đang xử lý..." : "✅ Tạo đơn hàng"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
