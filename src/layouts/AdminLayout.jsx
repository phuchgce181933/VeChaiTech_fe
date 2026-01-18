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
    <div className="flex flex-col h-screen">
      {/* Header ngang toàn màn hình */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-6">
        {/* Logo bên trái */}
        <h1 className="text-xl font-bold text-green-600">VeChaiTech</h1>
       <div className="flex items-center gap-4">
          <div className="text-right text-sm">
            <p className="font-semibold">{user?.username || "Traders"}</p>
            <p className="text-red-600">👤 {user?.role}</p>
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
        <aside className="w-64 bg-white border-r flex flex-col">
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <NavItem to="/admin" label="Tổng quan" />
              <NavItem to="/admin/banner" label="Banner" />
              <NavItem to="/admin/chatthaitaiche" label="Chất thải tái chế" />
              <NavItem to="/admin/thumua" label="Thu mua" />
              <NavItem to="/admin/tintuc" label="Tin tức" />
              <NavItem to="/admin/quanly" label="Quản lý" />
              <NavItem to="/admin/caidat" label="Cài đặt" />
            </ul>
          </nav>
          <div className="p-4 border-t text-sm text-gray-500">Trợ giúp & Hỗ trợ</div>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
// ✅ Khai báo kiểu dữ liệu cho props
NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

// Component NavItem cho gọn
function NavItem({ to, label }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `block px-4 py-2 rounded-lg font-medium ${isActive ? "bg-green-500 text-white" : "text-gray-700 hover:bg-green-100"
          }`
        }
      >
        {label}
      </NavLink>
    </li>
  );
}