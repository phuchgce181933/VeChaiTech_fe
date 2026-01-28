import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function UserLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [hideNav, setHideNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  /* ===== DETECT MOBILE ===== */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ===== HIDE HEADER ON SCROLL (DESKTOP ONLY) ===== */
  useEffect(() => {
    if (isMobile) return;

    let lastScroll = 0;
    const onScroll = () => {
      const current = window.scrollY;
      setHideNav(current > lastScroll && current > 120);
      lastScroll = current;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpenMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white text-gray-900">
      {/* ================= HEADER ================= */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          h-14 md:h-20
          bg-white border-b border-gray-200
          transition-transform duration-300
          ${hideNav ? "-translate-y-full" : "translate-y-0"}
        `}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          {/* LOGO */}
          <Link to="/trang-chu" className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/dcg5wftdq/image/upload/v1760774533/xpknvzz5hfelc4c3qaqc.png"
              alt="VeChaiTech"
              className="w-6 h-6"
            />
            <span className="font-bold text-sm md:text-lg">
              VeChaiTech
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
            {[
              ["Trang chủ", "/trang-chu"],
              ["Về chúng tôi", "/about"],
              ["Tin tức", "/blog"],
              ["Đối tác", "/policy"],
              ["Chat", "/chatbot"],
            ].map(([label, path]) => (
              <Link
                key={path}
                to={path}
                className={
                  isActive(path)
                    ? "text-emerald-600 underline underline-offset-8"
                    : "text-gray-700 hover:text-black"
                }
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            {user ? (
              <>
                <span>
                  Xin chào, <b>{user.fullName}</b>
                </span>
                <Link
                  to="/profile"
                  className="px-4 py-2 border border-black font-semibold hover:bg-black hover:text-white transition"
                >
                  Hồ sơ
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-black text-white font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Đăng nhập</Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-black text-white font-semibold"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpenMenu(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      {openMenu && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpenMenu(false)}
        >
          <div
            className="absolute top-0 right-0 w-64 h-full bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="mb-6 text-lg"
              onClick={() => setOpenMenu(false)}
            >
              ✕
            </button>

            {/* USER INFO */}
            {user && (
              <div className="mb-4 border-b pb-4">
                <p className="text-sm text-gray-600">
                  Xin chào, <b>{user.fullName}</b>
                </p>
                <button
                  onClick={handleLogout}
                  className="mt-3 w-full text-left text-red-600"
                >
                  Đăng xuất
                </button>
              </div>
            )}
            {/* ================= MOBILE DRAWER ================= */}
            {openMenu && (
              <div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                onClick={() => setOpenMenu(false)}
              >
                <div
                  className="absolute top-0 right-0 w-72 h-full bg-white p-6 rounded-l-2xl shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Menu</h3>
                    <button
                      className="text-xl text-gray-500"
                      onClick={() => setOpenMenu(false)}
                    >
                      ✕
                    </button>
                  </div>

                  {/* USER INFO */}
                  {user && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">
                        Xin chào
                      </p>
                      <p className="font-semibold text-gray-900">
                        {user.fullName}
                      </p>
                      <button
                        onClick={handleLogout}
                        className="mt-3 text-sm text-red-600"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}

                  {/* AUTH (NOT LOGGED IN) */}
                  {!user && (
                    <div className="mb-6 space-y-3">
                      <Link
                        to="/login"
                        onClick={() => setOpenMenu(false)}
                        className="block w-full py-2 text-center border border-gray-300 rounded-lg font-medium"
                      >
                        Đăng nhập
                      </Link>

                      <Link
                        to="/register"
                        onClick={() => setOpenMenu(false)}
                        className="block w-full py-2 text-center bg-black text-white rounded-lg font-medium"
                      >
                        Đăng ký
                      </Link>
                    </div>
                  )}

                  {/* NAV */}
                  <nav className="flex flex-col gap-2 text-base">
                    {[
                      ["Trang chủ", "/trang-chu"],
                      ["Về chúng tôi", "/about"],
                      ["Tin tức", "/blog"],
                      ["Đối tác", "/policy"],
                      ["Chat", "/chatbot"],
                    ].map(([label, path]) => (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setOpenMenu(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
              ${isActive(path)
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-gray-800 hover:bg-gray-100"
                          }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-gray-400" />
                        {label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            )}


            {/* MOBILE NAV */}
            <nav className="flex flex-col gap-4 text-base">
              {[
                ["Trang chủ", "/trang-chu"],
                ["Về chúng tôi", "/about"],
                ["Tin tức", "/blog"],
                ["Đối tác", "/policy"],
                ["Chat", "/chatbot"],
              ].map(([label, path]) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setOpenMenu(false)}
                  className={
                    isActive(path)
                      ? "text-emerald-600 font-semibold"
                      : "text-gray-800"
                  }
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* ================= MAIN ================= */}
      <main className="pt-14 md:pt-20">
        <Outlet />
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-300 py-10 md:py-16 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              VeChaiTech
            </h3>
            <p className="text-sm opacity-80">
              Nền tảng tái chế thông minh, kết nối cộng đồng
              và giao dịch bền vững.
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
          {/* ngrok start --all */}

          <div>
            <h4 className="font-semibold text-white mb-3">Liên hệ</h4>
            <p className="text-sm">Tân An, TP. Cần Thơ</p>
            <p className="text-sm">📧 g5-se@vechaitech.vn</p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} VeChaiTech
        </p>
      </footer>
    </div>
  );
}
