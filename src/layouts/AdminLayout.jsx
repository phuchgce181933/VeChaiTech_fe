import { Outlet, NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col shadow-sm">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="text-xl font-extrabold text-green-600 tracking-wide">
            VeChaiTech
          </h1>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <NavItem to="/admin" label="📊 Tổng quan" />
            <NavItem to="/admin/banner" label="🖼 Banner" />
            <NavItem to="/admin/chatthaitaiche" label="♻️ Chất thải tái chế" />
            <NavItem to="/admin/thumua" label="🛒 Thu mua" />
            <NavItem to="/admin/tintuc" label="📰 Tin tức" />
            <NavItem to="/admin/users" label="👥 Quản lý" />
            <NavItem to="/admin/quanlydoanhthu" label="📊 Quản lý doanh thu" />
          </ul>
        </nav>

        <div className="p-4 border-t text-xs text-gray-500">
          © VeChaiTech Admin
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
          <div />

          <div className="flex items-center gap-4">
            {/* User info */}
            <div className="flex items-center gap-3">
              {/* <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700">
                {user?.username?.charAt(0)?.toUpperCase() || "A"}
              </div> */}

              <div className="text-right leading-tight">
                <p className="font-semibold text-sm">
                  {user?.username || "Admin"}
                </p>
                {/* <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">
                  {user?.role}
                </span> */}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
  
}
NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

function NavItem({ to, label }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition
          ${
            isActive
              ? "bg-green-500 text-white shadow"
              : "text-gray-700 hover:bg-green-100"
          }`
        }
      >
        {label}
      </NavLink>
    </li>
  );
}
