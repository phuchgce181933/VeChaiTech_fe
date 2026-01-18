import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";

export default function TradersLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header ngang toàn màn hình */}
      <header className="h-16 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white border-b flex items-center justify-between px-6 shadow-lg">
        {/* Logo bên trái */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">♻️</span>
          <h1 className="text-2xl font-bold">VeChaiTech Traders</h1>
        </div>

        {/* User info bên phải */}
        <div className="flex items-center gap-4">
          <div className="text-right text-sm">
            <p className="font-semibold">{user?.username || "Traders"}</p>
            <p className="text-green-100">👤 {user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Layout dưới: Sidebar + Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-md flex flex-col">
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <NavItem to="/traders" label="📊 Tổng quan" />
              <NavItem to="/traders/orders" label="📦 Đơn hàng" />            
              <NavItem to="/traders/accepted" label="🔄 Đơn đã nhận" />
              <NavItem to="/traders/completed" label="✔️ Đơn hoàn thành" />
              <NavItem to="/traders/profile" label="👤 Hồ sơ" />
              <NavItem to="/traders/settings" label="⚙️ Cài đặt" />
            </ul>
          </nav>
          <div className="p-4 border-t text-sm text-gray-500">
            <p>📍 Bạn là người tái chế</p>
            <p className="text-xs mt-2">Quản lý các đơn hàng của bạn tại đây</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Component NavItem cho gọn
function NavItem({ to, label }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `block px-4 py-2 rounded-lg font-medium transition ${
            isActive
              ? "bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white"
              : "text-gray-700 hover:bg-green-100"
          }`
        }
      >
        {label}
      </NavLink>
    </li>
  );
}

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
