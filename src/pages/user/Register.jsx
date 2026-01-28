import { useState } from "react";

export default function Register() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verifyMethod, setVerifyMethod] = useState(""); // EMAIL | SMS
  const [loading, setLoading] = useState(false);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= SEND OTP ================= */
  const handleVerify = async (method) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          deliveryMethod: method,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gửi OTP thất bại");

      setVerifyMethod(method);
      setOtpSent(true);
      setMessage(`✅ OTP đã được gửi qua ${method === "EMAIL" ? "Email" : "SMS"}`);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CONFIRM OTP ================= */
  const handleConfirmOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/confirm-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier:
            verifyMethod === "EMAIL" ? formData.email : formData.phone,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "OTP không hợp lệ");

      setMessage("🎉 Đăng ký thành công! Bạn có thể đăng nhập.");
      setOtpSent(false);
      setOtp("");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#aff0b5] via-[#b2e0b6] to-[#17e11e] px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* ================= LEFT (DESKTOP ONLY) ================= */}
        <div className="hidden md:block p-8 bg-green-50">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            VeChaiTech là gì?
          </h2>

          <p className="text-sm text-gray-700 leading-relaxed">
            VeChaiTech là nền tảng hỗ trợ thu gom phế liệu tái chế cho cá nhân
            và hộ gia đình, giúp tích điểm Rcoin và đổi quà hoặc tiền mặt.
          </p>

          <h3 className="text-xl font-bold text-green-700 mt-6 mb-2">
            Thu gom các loại:
          </h3>

          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Lon nhôm, đồ nhôm gia dụng</li>
            <li>Giấy, sách báo cũ</li>
            <li>Nhựa PET, HDPE, PP</li>
            <li>Đồng, sắt, thép</li>
          </ul>
        </div>

        {/* ================= FORM ================= */}
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
            Đăng ký tài khoản
          </h2>

          <div className="space-y-4">
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />

            <input
              className="input"
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              onChange={handleChange}
              required
            />

            <input
              className="input"
              type="text"
              name="fullName"
              placeholder="Họ và tên"
              onChange={handleChange}
              required
            />

            <input
              className="input"
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              onChange={handleChange}
              required
            />

            <input
              className="input"
              type="password"
              name="password"
              placeholder="Mật khẩu"
              onChange={handleChange}
              required
            />

            {/* ================= VERIFY BUTTONS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleVerify("EMAIL")}
                className="btn-primary"
              >
                📧 Xác thực Email
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleVerify("SMS")}
                className="btn-primary"
              >
                📱 Xác thực SMS
              </button>
            </div>

            {/* ================= OTP ================= */}
            {otpSent && (
              <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 space-y-3">
                <input
                  className="input"
                  placeholder="Nhập OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleConfirmOtp}
                  className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60"
                >
                  ✅ Xác nhận OTP
                </button>
              </div>
            )}

            {message && (
              <p className="text-center text-sm font-medium text-red-600 mt-3">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
