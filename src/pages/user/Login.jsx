// src/pages/Login.jsx

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");

  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState(1);

  const [identifier, setIdentifier] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("EMAIL");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  /* ================= TOAST ================= */
  const showToast = (message, type = "success") => {
    setToast(message);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  /* ================= LOGIN ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Đăng nhập thất bại");

      const data = await res.json();

      if (data.data?.accessToken) {
        const { user, accessToken, roles } = data.data;

        login(user, accessToken, roles);
        showToast("Đăng nhập thành công!", "success");

        setTimeout(() => {
          if (roles.includes("ROLE_ADMIN")) navigate("/admin");
          else if (roles.includes("ROLE_TRADERS")) navigate("/traders");
          else navigate("/");
        }, 1200);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  /* ================= FORGOT PASSWORD ================= */
  const sendOtp = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, deliveryMethod }),
      });

      if (!res.ok) throw new Error("Gửi OTP thất bại");

      showToast("OTP đã được gửi", "success");
      setStep(2);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const resetPassword = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp, newPassword }),
      });

      if (!res.ok) throw new Error("Đổi mật khẩu thất bại");

      showToast("Đổi mật khẩu thành công!", "success");
      setShowForgot(false);
      setStep(1);
      setIdentifier("");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center from-[#aff0b5] via-[#b2e0b6] to-[#17e11e]">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT CONTENT */}
        <div className="p-10 bg-green-50">
          <h2 className="text-3xl font-bold text-green-700 mb-6">
            VeChaiTech
          </h2>

          <p className="text-gray-700 leading-relaxed">
            VeChaiTech là nền tảng hỗ trợ thu gom phế liệu tái chế
            dành cho cá nhân và hộ gia đình.
          </p>

          <p className="text-gray-700 mt-4 leading-relaxed">
            Người dùng có thể đặt lịch thu gom, tích điểm
            <span className="font-semibold text-green-700"> Rcoin </span>
            và đổi quà hoặc tiền mặt.
          </p>

          <h3 className="text-xl font-bold text-green-700 mt-8 mb-3">
            VeChaiTech thu gom:
          </h3>

          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Lon nhôm, đồ nhôm gia dụng</li>
            <li>Giấy, sách báo cũ</li>
            <li>Nhựa PET, HDPE, PP</li>
            <li>Đồng, sắt, thép</li>
          </ul>
        </div>

        {/* RIGHT FORM */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-8">
            Đăng Nhập
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Đăng Nhập
            </button>
          </form>

          <button
            onClick={() => setShowForgot(true)}
            className="mt-3 text-sm text-blue-500 hover:underline"
          >
            Quên mật khẩu?
          </button>

          <p className="mt-6 text-sm text-center">
            Chưa có tài khoản?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Đăng ký
            </span>
          </p>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-20 right-6 px-4 py-2 rounded-lg shadow-lg ${
            toastType === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast}
        </div>
      )}

      {/* FORGOT MODAL */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => {
                setShowForgot(false);
                setStep(1);
              }}
              className="absolute top-3 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-5 text-center">
              Quên mật khẩu
            </h3>

            {step === 1 && (
              <>
                <input
                  type="text"
                  placeholder="Email hoặc số điện thoại"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 mb-3"
                />

                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 mb-4"
                >
                  <option value="EMAIL">Gửi qua Email</option>
                  <option value="SMS">Gửi qua SMS</option>
                </select>

                <button
                  onClick={sendOtp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                >
                  Gửi OTP
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  type="text"
                  placeholder="Nhập OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 mb-3"
                />

                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 mb-4"
                />

                <button
                  onClick={resetPassword}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                >
                  Đổi mật khẩu
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
