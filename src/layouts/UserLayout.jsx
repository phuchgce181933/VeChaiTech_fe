import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./css/UserLayout.css";

export default function UserLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [hideNav, setHideNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  /* Detect mobile */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Hide header on scroll (desktop only) */
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

  const navItems = [
    ["Trang chủ", "/trang-chu"],
    ["Về chúng tôi", "/about"],
    ["Tin tức", "/blog"],
    ["Đối tác", "/policy"],
    ["Chat", "/chatbot"],
  ];

  return (
    <div className="layout-wrapper">
      {/* ================= HEADER ================= */}
      <header className={`header ${hideNav ? "header-hide" : ""}`}>
        <div className="header-container">
          <Link to="/trang-chu" className="logo">
            <img
              src="https://res.cloudinary.com/dcg5wftdq/image/upload/v1760774533/xpknvzz5hfelc4c3qaqc.png"
              alt="VeChaiTech"
            />
            <span>VeChaiTech</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav-desktop">
            {navItems.map(([label, path]) => (
              <Link
                key={path}
                to={path}
                className={isActive(path) ? "nav-link active" : "nav-link"}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="actions-desktop">
            {user ? (
              <>
                <span className="welcome">
                  Xin chào, <b>{user.fullName}</b>
                </span>
                <Link to="/profile" className="btn-outline">
                  Hồ sơ
                </Link>
                <button onClick={handleLogout} className="btn-dark">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn-dark">
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile button */}
          <button className="menu-btn" onClick={() => setOpenMenu(true)}>
            ☰
          </button>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      <div className={`drawer-overlay ${openMenu ? "show" : ""}`} onClick={() => setOpenMenu(false)}>
        <div className="drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <h3>Menu</h3>
            <button onClick={() => setOpenMenu(false)}>✕</button>
          </div>

          {user && (
            <div className="drawer-user">
              <p>Xin chào</p>
              <strong>{user.fullName}</strong>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          )}

          {!user && (
            <div className="drawer-auth">
              <Link to="/login" onClick={() => setOpenMenu(false)}>
                Đăng nhập
              </Link>
              <Link to="/register" onClick={() => setOpenMenu(false)}>
                Đăng ký
              </Link>
            </div>
          )}

          <nav className="drawer-nav">
            {navItems.map(([label, path]) => (
              <Link
                key={path}
                to={path}
                onClick={() => setOpenMenu(false)}
                className={isActive(path) ? "active" : ""}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-container">
          <div>
            <h3>VeChaiTech</h3>
            <p>
              Nền tảng tái chế thông minh, kết nối cộng đồng
              và giao dịch bền vững.
            </p>
          </div>

          <div>
            <h4>Liên kết</h4>
            <ul>
              <li><Link to="/about">Về chúng tôi</Link></li>
              <li><Link to="/policy">Chính sách</Link></li>
              <li><Link to="/blog">Tin tức</Link></li>
            </ul>
          </div>

          <div>
            <h4>Liên hệ</h4>
            <p>Tân An, TP. Cần Thơ</p>
            <p>g5-se@vechaitech.vn</p>
          </div>
        </div>

        <p className="copyright">
          © {new Date().getFullYear()} VeChaiTech
        </p>
      </footer>
    </div>
  );
}