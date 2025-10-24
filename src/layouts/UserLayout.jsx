import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export default function UserLayout() {
  const { user, logout } = useContext(AuthContext); // lấy user và logout từ context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // dùng logout của context
    navigate("/login");
  };

  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <header className="bg-green-600 text-white px-8 py-4 flex justify-between items-center shadow-md">
        <Link to="/trang-chu">
        <h1 className="text-2xl font-bold">VeChaiTech</h1>
        </Link>
        {/* Menu */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          <Link to="/about" className="hover:text-gray-200">
            Về chúng tôi
          </Link>
          <Link to="/services" className="hover:text-gray-200">
            Dịch vụ
          </Link>
          <Link to="/blog" className="hover:text-gray-200">
            Tin tức
          </Link>
          <Link to="/policy" className="hover:text-gray-200">
            Liên hệ
          </Link>
            <Link to="/chatbot" className="hover:text-gray-200">
            Chị Chat 
          </Link>
        </nav>

        {/* Auth buttons hoặc User */}
        <div className="space-x-3">
          {user ? (
            <div className="flex items-center space-x-4">
              <span>
                Xin chào, <b>{user.fullName}</b>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-green-600 rounded-md text-sm font-medium hover:bg-gray-100"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-green-800 text-white rounded-md text-sm font-medium hover:bg-green-700"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-gray-100 text-gray-700 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8"> {/* Info */} <div>
          <h4 className="text-lg font-bold mb-3 text-green-700"> VeChaiTech </h4>
          <p className="text-gray-600"> Công nghệ xanh cho nền kinh tế tuần hoàn. </p>
        </div> {/* Links */} <div>
            <h4 className="font-semibold mb-3">Khám phá</h4>
            <ul className="space-y-2 text-gray-600"> <li> <Link to="/about">Về chúng tôi</Link> </li>
              <li> <Link to="/services">Dịch vụ</Link> </li>
              <li> <Link to="/blog">Tin tức</Link> </li>
              <li> <Link to="/policy">Liên hệ</Link> </li>
              <li> <Link to="/chatbot">Chị Chat ngu như con bò</Link> </li>
            </ul>
          </div> {/* Legal */} <div> <h4 className="font-semibold mb-3">Pháp lý</h4>
            <ul className="space-y-2 text-gray-600"> <li> <Link to="/">Điều khoản sử dụng</Link> </li>
              <li> <Link to="/">Chính sách bảo mật</Link> </li> </ul> </div> {/* Social */} <div>
            <h4 className="font-semibold mb-3">Kết nối</h4> <div className="flex space-x-4 text-xl"> <a href="#">🌐</a>
              <a href="#">🐦</a> <a href="#">📘</a> </div>
          </div> </div> <div className="text-center text-gray-500 mt-10"> © 2025 VeChaiTech. All rights reserved. </div>
      </footer>
    </div>
  );
}
