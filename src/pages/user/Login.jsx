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

        setTimeout(() => {
          if (hasAdminRole) {
            navigate("/admin");
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg border border-gray-300 p-8 flex flex-col md:flex-row gap-8">

        {/* Cột trái: Giới thiệu */}
        <div className="flex-1 flex flex-col justify-start">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            🌱 Tại sao nên tạo tài khoản TerraCycle?
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Tài khoản TerraCycle cho phép bạn tham gia các chương trình tái chế miễn phí của chúng tôi. Bạn có thể sử dụng tài khoản để tái chế cho bản thân, gia đình, bạn bè, doanh nghiệp và thậm chí cả cộng đồng của bạn. Tham gia các chương trình, nhận nhãn vận chuyển trả trước và theo dõi các lô hàng tái chế cũng như tác động của chúng thông qua tài khoản của bạn. Chương trình của chúng tôi có sẵn tại 48 tiểu bang liên kề, bao gồm Washington, D.C.
          </p>
          <p className="text-gray-700 text-sm mt-2">
            Nếu bạn chọn giải pháp tái chế trả phí Zero Waste Box của chúng tôi, việc tạo tài khoản là không bắt buộc. Tuy nhiên, tài khoản sẽ cho phép bạn theo dõi lịch sử tái chế và thiết lập các đơn hàng định kỳ.
          </p>
          <p className="text-red-700 text-sm mt-2">
            Quan trọng:
          </p>
          <p className="text-red-600 text-sm font-medium mt-4">
            🔔 Lưu ý: Hãy thêm <span className="font-mono">brigades-no-reply@terracycle.com</span> vào danh bạ email để không bỏ lỡ thông tin quan trọng từ chúng tôi.
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
