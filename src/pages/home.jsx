import { Link } from "react-router-dom";
import { FaUser, FaTruck, FaRecycle } from "react-icons/fa"; // icon cho 3 ô lợi ích

function Home() {
  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <header className="bg-green-600 text-white px-8 py-4 flex justify-between items-center shadow-md">
        {/* Logo */}
        <h1 className="text-2xl font-bold">VeChaiTech</h1>

        {/* Menu */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          <Link to="/" className="hover:text-gray-200">
            Về chúng tôi
          </Link>
          <Link to="/" className="hover:text-gray-200">
            Dịch vụ
          </Link>
          <Link to="/" className="hover:text-gray-200">
            Tin tức
          </Link>
          <Link to="/" className="hover:text-gray-200">
            Liên hệ
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="space-x-3">
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
        </div>
      </header>

      {/* Hero */}
      <section className="bg-green-50 text-center py-20 relative">
        <h2 className="text-4xl md:text-5xl font-extrabold text-green-700 leading-snug">
          Công nghệ xanh cho nền kinh tế tuần hoàn
        </h2>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          VeChaiTech kết nối người bán rác, người thu mua và nhà máy tái chế,
          tạo ra một hệ sinh thái bền vững và hiệu quả.
        </p>
        <button className="mt-8 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
          Tìm hiểu thêm
        </button>
      </section>

      {/* Lợi ích */}
      <section className="py-20 px-6 bg-white">
        <h3 className="text-2xl font-bold text-center mb-12">
          Lợi ích của VeChaiTech
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-green-50 rounded-lg shadow hover:shadow-md transition text-center">
            <FaUser className="text-green-600 text-4xl mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Người bán</h4>
            <p className="text-gray-600">
              Dễ dàng tìm người thu mua gần nhất với giá tốt nhất, minh bạch và
              nhanh chóng.
            </p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg shadow hover:shadow-md transition text-center">
            <FaTruck className="text-green-600 text-4xl mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Người thu mua</h4>
            <p className="text-gray-600">
              Mở rộng mạng lưới, tăng doanh thu, quản lý đơn hàng hiệu quả và tối
              ưu lợi nhuận.
            </p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg shadow hover:shadow-md transition text-center">
            <FaRecycle className="text-green-600 text-4xl mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Nhà máy tái chế</h4>
            <p className="text-gray-600">
              Đảm bảo nguồn cung nguyên liệu đều đặn, chất lượng và có truy xuất
              nguồn gốc.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-50 text-center">
        <h3 className="text-2xl font-bold mb-6">Tham gia cùng VeChaiTech</h3>
        <p className="text-gray-600 mb-8">
          Hãy chọn vai trò của bạn và bắt đầu hành trình vì một tương lai xanh
          hơn.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
            Tôi là người bán
          </button>
          <button className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
            Tôi là người thu mua
          </button>
          <button className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
            Tôi là nhà máy tái chế
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          {/* Info */}
          <div>
            <h4 className="text-lg font-bold mb-3 text-green-700">
              VeChaiTech
            </h4>
            <p className="text-gray-600">
              Công nghệ xanh cho nền kinh tế tuần hoàn.
            </p>
          </div>
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3">Khám phá</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/">Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/">Dịch vụ</Link>
              </li>
              <li>
                <Link to="/">Tin tức</Link>
              </li>
              <li>
                <Link to="/">Liên hệ</Link>
              </li>
            </ul>
          </div>
          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3">Pháp lý</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/">Điều khoản sử dụng</Link>
              </li>
              <li>
                <Link to="/">Chính sách bảo mật</Link>
              </li>
            </ul>
          </div>
          {/* Social */}
          <div>
            <h4 className="font-semibold mb-3">Kết nối</h4>
            <div className="flex space-x-4 text-xl">
              <a href="#">🌐</a>
              <a href="#">🐦</a>
              <a href="#">📘</a>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-10">
          © 2025 VeChaiTech. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
