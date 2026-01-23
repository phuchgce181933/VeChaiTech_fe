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
  const roleLabelMap = {
    ROLE_ADMIN: "Quản trị viên",
    ROLE_CUSTOMER: "Khách hàng",
    ROLE_TRADERS: "Người thu gom",
    ROLE_RECYCLER: "Người thu gom",
  };
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* ===== HEADER ===== */}
      <header className="h-16 bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-500 text-white flex items-center justify-between px-6 shadow-md">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-xl">
            ♻️
          </div>
          <h1 className="text-xl font-bold tracking-wide">
            VeChaiTech <span className="font-light">Traders</span>
          </h1>
        </div>

        {/* User */}
        <div className="flex items-center gap-4">
          <div className="text-right leading-tight">
            <p className="font-semibold text-sm">
              {user?.username || "Trader"}
            </p>
            <p className="text-xs text-green-100">
              {roleLabelMap[user?.role] || "Người dùng"}
            </p>
          </div>

          <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center text-sm font-bold">
            {user?.username?.charAt(0)?.toUpperCase() || "T"}
          </div>

          <button
            onClick={handleLogout}
            className="ml-2 bg-red-500/90 hover:bg-red-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* ===== BODY ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/* ===== SIDEBAR ===== */}
        <aside className="w-72 bg-white border-r shadow-sm flex flex-col">
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase">
              Quản lý
            </p>

            <ul className="space-y-1">
              <NavItem to="/traders" label="📊 Tổng quan" />
              <NavItem to="/traders/orders" label="📦 Đơn có thể nhận" />
              <NavItem to="/traders/accepted" label="🔄 Đơn đã nhận" />
              <NavItem to="/traders/completed" label="✅ Hoàn thành" />
              <NavItem to="/traders/cancelled" label="❌ Đã hủy" />
            </ul>

            <p className="px-3 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase">
              Tài khoản
            </p>

            <ul className="space-y-1">
              <NavItem to="/traders/profile" label="👤 Hồ sơ" />
              <NavItem to="/traders/settings" label="⚙️ Cài đặt" />
            </ul>
          </nav>

          <div className="p-4 border-t text-xs text-gray-500">
            <p>♻️ Vai trò: Người tái chế</p>
            <p className="mt-1">Quản lý đơn hàng hiệu quả</p>
          </div>
        </aside>

        {/* ===== MAIN ===== */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ===== NAV ITEM ===== */
function NavItem({ to, label }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `relative flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
          ${isActive
            ? "bg-emerald-50 text-emerald-700 font-semibold before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-emerald-600 before:rounded-r"
            : "text-gray-700 hover:bg-gray-100"
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
