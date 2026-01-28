import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function CreateOrder() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [wasteListings, setWasteListings] = useState([]);
  const [geoError, setGeoError] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    customerId: 0,
    wasteListingId: "", // ✅ để STRING cho select
    addressPublic: "",
    latitude: "",
    longitude: "",
    addressFull: "",
  });

  const CAN_THO_WARDS = [
    "Phường An Hòa", "Phường An Nghiệp", "Phường An Phú", "Phường Cái Khế",
    "Phường Hưng Lợi", "Phường Tân An", "Phường Thới Bình", "Phường Xuân Khánh",
    "Phường An Thới", "Phường Bình Thủy", "Phường Bùi Hữu Nghĩa", "Phường Long Hòa",
    "Phường Long Tuyền", "Phường Thới An Đông", "Phường Trà An", "Phường Trà Nóc",
    "Phường Ba Láng", "Phường Hưng Phú", "Phường Lê Bình", "Phường Phú Thứ",
    "Phường Tân Phú", "Phường Thường Thạnh",
    "Phường Châu Văn Liêm", "Phường Long Hưng", "Phường Phước Thới",
    "Phường Thới An", "Phường Thới Hòa", "Phường Thới Long",
    "Phường Tân Hưng", "Phường Tân Lộc", "Phường Tân Thạnh",
    "Phường Thạnh Hòa", "Phường Thạnh Phước", "Phường Thới Thuận",
    "Phường Thuận An",
    "Xã Đông Hiệp", "Xã Đông Thắng", "Xã Thới Đông", "Xã Thới Xuân",
    "Xã Trung An", "Xã Trung Hưng", "Xã Trung Thạnh",
    "Xã Trường Long", "Xã Trường Xuân", "Xã Trường Xuân A", "Xã Trường Xuân B",
  ];

  /* ================= GEO ================= */
  useEffect(() => {
    fetch(`${API_BASE}/api/v1/wastelistings/list`, {
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    })
      .then((res) => {
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("API không trả JSON (ngrok warning)");
        }
        return res.json();
      })
      .then((data) => {
        setWasteListings(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("❌ Lỗi load vật liệu:", err);
        setWasteListings([]);
      });
  }, [API_BASE]);


  /* ================= LOAD WASTE ================= */
  useEffect(() => {
    fetch(`${API_BASE}/api/v1/wastelistings/list`)
      .then((res) => res.json())
      .then((data) => {
        setWasteListings(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Lỗi load vật liệu:", err);
        setWasteListings([]);
      });
  }, []);

  /* ================= USER + QUERY ================= */
  useEffect(() => {
    const qWasteId = searchParams.get("wasteListingId");

    let customerId = 0;
    if (user?.id) {
      customerId = user.id;
    } else {
      const stored = localStorage.getItem("customerId");
      customerId = stored ? Number(stored) : 0;
    }

    setFormData((prev) => ({
      ...prev,
      customerId,
      wasteListingId: qWasteId ? String(qWasteId) : prev.wasteListingId,
    }));
  }, [user, searchParams]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value, // ✅ select giữ string
    }));
  };
  {
    geoError && (
      <div className="mb-4 p-3 bg-orange-100 text-orange-700 rounded">
        📍 Vui lòng bật định vị để hệ thống xác định vị trí thu gom
      </div>
    )
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        wasteListingId: Number(formData.wasteListingId), // ✅ ép NUMBER khi gửi
      };

      const res = await fetch(`${API_BASE}/api/v1/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Bạn chưa đăng nhập hoặc dữ liệu sai");

      await res.json();
      setSuccess("🎉 Đặt đơn hàng thành công!");
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((p) => ({
          ...p,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        }));
        setGeoError(false);
      },
      () => setGeoError(true)
    );
  }, []);

  /* ================= RENDER ================= */
  return (
    <div className="max-w-3xl mx-auto mb-20">
      <div className="bg-white rounded-3xl shadow-2xl p-8 mt-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          📦 Tạo Đơn Thu Gom
        </h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}
        {geoError && (
          <div className="p-3 bg-orange-100 text-orange-700 rounded-lg text-sm">
            ⚠️ Không lấy được vị trí, vui lòng bật GPS
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ===== VẬT LIỆU ===== */}
          <div>
            <label className="font-semibold">Loại vật liệu *</label>
            <select
              name="wasteListingId"
              value={formData.wasteListingId}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border rounded"
            >
              <option value="" disabled>
                -- Chọn loại vật liệu --
              </option>

              {wasteListings
                .filter((i) => i.status)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {item.price.toLocaleString()}đ/kg
                  </option>
                ))}
            </select>
          </div>

          {/* ===== PHƯỜNG ===== */}
          <div>
            <label className="font-semibold">Phường / Xã *</label>
            <select
              name="addressPublic"
              value={formData.addressPublic}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border rounded"
            >
              <option value="" disabled>
                -- Chọn phường / xã --
              </option>
              {CAN_THO_WARDS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          {/* ===== ĐỊA CHỈ ===== */}
          <div>
            <label className="font-semibold">Địa chỉ chi tiết *</label>
            <textarea
              name="addressFull"
              value={formData.addressFull}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border rounded"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/trang-chu")}
              className="flex-1 p-3 bg-gray-300 rounded"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 p-3 bg-green-600 text-white rounded"
            >
              {loading ? "Đang xử lý..." : "Tạo đơn"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
