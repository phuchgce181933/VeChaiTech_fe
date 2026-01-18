import { Outlet, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
export default function AdminLayout() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header ngang toàn màn hình */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-6">
        {/* Logo bên trái */}
        <h1 className="text-xl font-bold text-green-600">VeChaiTech</h1>

        {/* Menu bên phải */}
        {/* <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
          <Link to="/about" className="hover:text-green-600">Về chúng tôi</Link>
          <Link to="/services" className="hover:text-green-600">Dịch vụ</Link>
          <Link to="/blog" className="hover:text-green-600">Tin tức</Link>
          <Link to="/policy" className="hover:text-green-600">Liên hệ</Link>
          <Link to="/chatbot" className="hover:text-green-600">Trợ lý ảo</Link>
        </nav> */}
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
              <NavItem to="/admin/baocao" label="Báo cáo" />
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