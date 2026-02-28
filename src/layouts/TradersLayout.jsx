import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";

export default function TradersLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleLabelMap = {
    ROLE_ADMIN: "Quản trị viên",
    ROLE_CUSTOMER: "Khách hàng",
    ROLE_TRADERS: "Người thu gom",
    ROLE_RECYCLER: "Người tái chế",
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* ===== HEADER ===== */}
      <header className="h-16 bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-500 text-white flex items-center justify-between px-4 sm:px-6 shadow-md">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-2xl"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>

          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-xl">
            ♻️
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-wide">
            VeChaiTech <span className="font-light hidden sm:inline">Traders</span>
          </h1>
        </div>

        {/* USER */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right leading-tight hidden sm:block">
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
            className="bg-red-500/90 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1.5 rounded-lg transition"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* ===== BODY ===== */}
      <div className="flex flex-1 overflow-hidden">

        {/* ===== SIDEBAR ===== */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-lg transform transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            lg:static lg:translate-x-0 lg:w-72
          `}
        >
          {/* Close button mobile */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase">
              Quản lý
            </p>

            <ul className="space-y-1">
              <NavItem to="/traders" label="📊 Tổng quan" close={() => setIsOpen(false)} />
              <NavItem to="/traders/orders" label="📦 Đơn có thể nhận" close={() => setIsOpen(false)} />
              <NavItem to="/traders/accepted" label="🔄 Đơn đã nhận" close={() => setIsOpen(false)} />
              <NavItem to="/traders/completed" label="✅ Hoàn thành" close={() => setIsOpen(false)} />
              <NavItem to="/traders/cancelled" label="❌ Đã hủy" close={() => setIsOpen(false)} />
            </ul>

            <p className="px-3 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase">
              Tài khoản
            </p>

            <ul className="space-y-1">
              <NavItem to="/traders/profile" label="👤 Hồ sơ" close={() => setIsOpen(false)} />
              <NavItem to="/traders/settings" label="⚙️ Cài đặt" close={() => setIsOpen(false)} />
            </ul>
          </nav>
        </aside>

        {/* Overlay mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* ===== MAIN ===== */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ===== NAV ITEM ===== */
function NavItem({ to, label, close }) {
  return (
    <li>
      <NavLink
        to={to}
        onClick={close}
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
  close: PropTypes.func,
};