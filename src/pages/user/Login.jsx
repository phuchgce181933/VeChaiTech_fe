// src/pages/Login.jsx

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null); // state thông báo
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const showToast = (message, type = "success") => {
    setToast(message);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Đăng nhập thất bại");
      }

      const data = await res.json();

      if (data.data?.accessToken) {
        const { user, accessToken, roles } = data.data;

        // Lưu user + token vào context
        login(user, accessToken, roles);
        showToast("Đăng nhập thành công!", "success");

        // Check roles (có thể có nhiều)
        const hasAdminRole = roles.includes("ROLE_ADMIN");
        const hasTradersRole = roles.includes("ROLE_TRADERS");

        setTimeout(() => {
          if (hasAdminRole) {
            navigate("/admin");
          } else if (hasTradersRole) {
            navigate("/traders");
          } else {
            navigate("/");
          }
        }, 1500);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-10 -left-10 w-60 h-60 bg-emerald-200 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-300 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-green-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      <div className="w-full max-w-5xl bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-emerald-200 p-8 flex flex-col md:flex-row gap-8">
        {/* Cột trái: Giới thiệu */}
        <div className="flex-1 flex flex-col justify-start">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            VeChaiTech làm gì?
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Ứng dụng Ve Chai Tech - Đặt Lịch Thu Gom Rác là một nền
          </p>
          <p className="text-gray-700 text-sm mt-2">
            tảng hỗ trợ thu gom tái chế phế liệu dành cho người dùng
          </p>
          <p className="text-gray-700 text-sm mt-2">
            cá nhân và hộ gia đình. Mục tiêu chính của ứng dụng là
            khuyến khích người dùng thu gom phế liệu tại nhà và nhận
            điểm thưởng (Rcoin) để đổi quà hoặc tiền. Đây là một dự án
            nhằm thúc đẩy ý thức bảo vệ môi trường và tối ưu hóa quá trình tái chế.
          </p>
          <h3 className="text-2xl font-bold text-green-700 mb-1">
            VeChaiTech gom gì?
          </h3>
          <p className="text-gray-700 text-sm mt-2">
            Vỏ lon nước giải khát (Ví dụ: lon nước ngọt, lon bia, …)
            Nhôm các loại bao gồm các vật dụng bằng nhôm như nồi, lọ, nhôm đà
            Giấy sách báo đã qua sử dụng
            Nhựa tổng hợp bao gồm PETE1, 2/4/5
            Đồng, và Sắt thép
          </p>
        </div>

        {/* Cột phải: Đăng nhập */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col justify-start"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Tên đăng nhập</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập tên đăng nhập..."
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập mật khẩu..."
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded"
          >
            Đăng Nhập
          </button>

          <p className="text-center mt-4 text-gray-600 text-sm">
            Chưa có tài khoản?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Đăng ký
            </span>
          </p>
        </form>

        {/* Toast thông báo */}
        {toast && (
          <div
            className={`fixed top-20 right-5 px-4 py-2 rounded shadow-lg transition-transform transform duration-300 ${toastType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
          >
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
