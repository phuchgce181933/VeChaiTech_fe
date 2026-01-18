import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function UserLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [hideNav, setHideNav] = useState(false);

  useEffect(() => {
    let lastScroll = 0;

    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll && current > 80) {
        setHideNav(true);     // kéo xuống → ẩn
      } else {
        setHideNav(false);    // kéo lên → hiện
      }
      lastScroll = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="border-[#66BB6A] text-gray-800">
      {/* Header cố định */}
      <header
        className={`backdrop-blur-md bg-white/40 border-[#66BB6A] px-8 py-3 
  flex items-center border border-white/30 shadow-lg fixed top-4 left-1/2 
  -translate-x-1/2 w-[90%] md:w-[80%] rounded-full z-50 transition-transform 
  duration-300 ${hideNav ? "-translate-y-[150%]" : "translate-y-0"}`}
      >
        <Link to="/trang-chu" className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/dcg5wftdq/image/upload/v1760774533/xpknvzz5hfelc4c3qaqc.png"
            alt="VeChaiTech Logo"
            className="w-9 h-9 object-contain drop-shadow"
          />
        </Link>

        {/* MENU Ở GIỮA */}
        <nav className="flex-grow flex justify-center items-center space-x-6 text-sm font-medium">
          <Link className="hover:text-green-600 transition" to="/about">Về chúng tôi</Link>
          <Link className="hover:text-green-600 transition" to="/blog">Tin tức</Link>
          <Link to="/trang-chu" className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-teal-500 to-sky-500 drop-shadow">
            VeChaiTech
          </h1>
          </Link>
          <Link className="hover:text-green-600 transition" to="/policy">Liên hệ</Link>
          <Link className="hover:text-green-600 transition" to="/chatbot">Chị Chat</Link>
        </nav>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <span className="hidden sm:block text-sm text-gray-800">
                Xin chào, <b>{user.fullName}</b>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm font-medium shadow hover:opacity-90 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 bg-white/80 text-green-700 border border-green-500 rounded-full text-sm font-medium hover:bg-white shadow-sm transition"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-full text-sm font-medium hover:opacity-90 shadow transition"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </header>



      {/* Main content có khoảng cách để không bị che bởi header */}
      <main className="min-h-screen overflow-y-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-xl font-semibold mb-3 text-white">VeChaiTech</h3>
            <p className="text-sm opacity-80">
              Nền tảng tái chế thông minh kết nối người dân, nhà thu gom và doanh nghiệp.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-white">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-white" to="/about">Về chúng tôi</Link></li>
              <li><Link className="hover:text-white" to="/services">Dịch vụ</Link></li>
              <li><Link className="hover:text-white" to="/policy">Chính sách</Link></li>
              <li><Link className="hover:text-white" to="/blog">Tin tức</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-white">Liên hệ</h4>
            <p className="text-sm opacity-80">📍 Hồ Chí Minh, Việt Nam</p>
            <p className="text-sm opacity-80">📧 support@vechaitech.vn</p>
            <p className="text-sm opacity-80">☎ 0900 123 456</p>
          </div>
        </div>

        <div className="text-center mt-8 text-xs text-gray-500">
          © {new Date().getFullYear()} VeChaiTech — Chung tay xây dựng tương lai xanh 🌍
        </div>
      </footer>
    </div>
  );
}
