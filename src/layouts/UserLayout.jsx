import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

export default function UserLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [hideNav, setHideNav] = useState(false);

  /* ===== Hide header on scroll ===== */
  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const current = window.scrollY;
      setHideNav(current > lastScroll && current > 80);
      lastScroll = current;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ===== Scroll to top when change page ===== */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col
      bg-gradient-to-b from-[#aff0b5] via-[#b2e0b6] to-[#17e11e]">

      {/* ================= HEADER ================= */}
      <header
        className={`
          fixed top-4 left-1/2 -translate-x-1/2 z-50
          w-[92%] md:w-[85%]
          px-8 py-3 flex items-center
          backdrop-blur-xl bg-white/70
          border border-emerald-200
          rounded-full shadow-lg
          transition-transform duration-300
          ${hideNav ? "-translate-y-[150%]" : "translate-y-0"}
        `}
      >
        <Link to="/trang-chu" className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/dcg5wftdq/image/upload/v1760774533/xpknvzz5hfelc4c3qaqc.png"
            alt="VeChaiTech"
            className="w-9 h-9"
          />
        </Link>

        <nav className="flex-grow flex justify-center items-center gap-8 text-sm font-medium">
          <Link className="hover:text-emerald-600 transition" to="/about">
            Về chúng tôi
          </Link>
          <Link className="hover:text-emerald-600 transition" to="/blog">
            Tin tức
          </Link>

          <Link to="/trang-chu">
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent
              bg-gradient-to-r from-green-600 via-teal-500 to-sky-500">
              VeChaiTech
            </h1>
          </Link>

          <Link className="hover:text-emerald-600 transition" to="/policy">
            Đối tác
          </Link>
          <Link className="hover:text-emerald-600 transition" to="/chatbot">
             Chat
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:block text-sm">
                Xin chào, <b>{user.fullName}</b>
              </span>

              <Link
                to="/profile"
                className="px-4 py-1.5 rounded-full border border-emerald-400
                text-emerald-700 bg-white/80 hover:bg-emerald-50 text-sm transition"
              >
                Hồ sơ
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-full
                bg-gradient-to-r from-red-500 to-red-600
                text-white text-sm shadow hover:opacity-90 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn-outline" to="/login">Đăng nhập</Link>
              <Link className="btn-primary" to="/register">Đăng ký</Link>
            </>
          )}
        </div>
      </header>

      {/* ================= MAIN (ANIMATION HERE) ================= */}
      <main className="flex-1 pt-24 px-4 md:px-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ x: 80, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              damping: 20,
              // ease: [0.16, 1, 0.3, 1], // mượt, không gắt
            }}
          >
            <Outlet />
          </motion.div>

        </AnimatePresence>
      </main>


      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              VeChaiTech
            </h3>
            <p className="text-sm opacity-80">
              Nền tảng tái chế thông minh kết nối cộng đồng.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Liên kết</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about">Về chúng tôi</Link></li>
              <li><Link to="/policy">Chính sách</Link></li>
              <li><Link to="/blog">Tin tức</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Liên hệ</h4>
            <p className="text-sm">Tân An, Thành Phố Cần Thơ</p>
            <p className="text-sm">📧 g5-se@vechaitech.vn</p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} VeChaiTech 🌱
        </p>
      </footer>
    </div>
  );
}
