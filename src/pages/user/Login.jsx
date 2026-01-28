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
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const showToast = (message, type = "success") => {
    setToast(message);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
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
  } catch (err) {
    showToast(err.message || "Có lỗi xảy ra", "error");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#aff0b5] via-[#b2e0b6] to-[#17e11e] px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT (DESKTOP ONLY) */}
        <div className="hidden md:block p-10 bg-green-50">
          <h2 className="text-3xl font-bold text-green-700 mb-6">
            VeChaiTech
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Nền tảng hỗ trợ thu gom phế liệu tái chế cho cá nhân & hộ gia đình.
          </p>

          <ul className="list-disc list-inside text-gray-700 mt-6 space-y-2">
            <li>Lon nhôm, giấy, nhựa</li>
            <li>Đồng, sắt, thép</li>
            <li>Tích điểm Rcoin</li>
          </ul>
        </div>

        {/* RIGHT FORM */}
        <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Đăng Nhập
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-green-400 outline-none"
            />

            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-green-400 outline-none"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition"
            >
              Đăng Nhập
            </button>
          </form>

          <button
            onClick={() => setShowForgot(true)}
            className="mt-4 text-sm text-blue-500 hover:underline text-center"
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
          className={`fixed top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 ${
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => {
                setShowForgot(false);
                setStep(1);
              }}
              className="absolute top-3 right-4 text-gray-500"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-5 text-center">
              Quên mật khẩu
            </h3>

            {step === 1 && (
              <>
                <input
                  placeholder="Email hoặc số điện thoại"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 mb-3"
                />

                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 mb-4"
                >
                  <option value="EMAIL">Email</option>
                  <option value="SMS">SMS</option>
                </select>

                <button className="w-full bg-green-500 text-white py-3 rounded-lg">
                  Gửi OTP
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 mb-3"
                />

                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 mb-4"
                />

                <button className="w-full bg-blue-500 text-white py-3 rounded-lg">
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
