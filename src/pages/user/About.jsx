import BannerSlide from "./Banner";
export default function AboutPage() {
  const members = [
    {
      name: "Huỳnh Gia Phúc",
      role: "CEO – Giám đốc điều hành",
      img: "https://i.imgur.com/XXXXXXX.png",
      desc: "Là người sáng lập và điều phối dự án VeChaiTech, phụ trách chiến lược tổng thể và định hướng phát triển sản phẩm.",
      contact: "ceo@vechaitech.vn",
    },
    {
      name: "Nguyễn Thanh Phú",
      role: "CTO – Giám đốc công nghệ",
      img: "https://i.imgur.com/XXXXXXX.png",
      desc: "Đảm bảo hệ thống hoạt động ổn định, tối ưu hiệu năng và phát triển các tính năng mới.",
      contact: "cto@vechaitech.vn",
    },
    {
      name: "Trần Thị Như Ý",
      role: "CMO – Giám đốc marketing",
      img: "https://i.imgur.com/XXXXXXX.png",
      desc: "Phụ trách truyền thông, xây dựng thương hiệu và kết nối cộng đồng người dùng.",
      contact: "marketing@vechaitech.vn",
    },
    {
      name: "Ngô Trọng Phi",
      role: "CSO – Giám đốc chiến lược thị trường",
      img: "https://i.imgur.com/XXXXXXX.png",
      desc: "Nghiên cứu xu hướng tái chế, hành vi người dùng và đối tác tiềm năng.",
      contact: "strategy@vechaitech.vn",
    },
    {
      name: "Lê Huỳnh Quang Long",
      role: "COO – Giám đốc vận hành",
      img: "https://i.imgur.com/XXXXXXX.png",
      desc: "Giám sát vận hành hàng ngày, phối hợp các nhóm để đảm bảo hệ thống trơn tru.",
      contact: "operations@vechaitech.vn",
    },
  ];

  const coreValues = [
    { icon: "♻️", title: "Bền vững", desc: "Mỗi hành động đều hướng đến môi trường xanh và tái chế hiệu quả." },
    { icon: "🤝", title: "Kết nối", desc: "Liên kết người dân, doanh nghiệp và chính quyền để cùng xây dựng nền kinh tế tuần hoàn." },
    { icon: "🚀", title: "Đổi mới", desc: "Cải tiến công nghệ, AI & bản đồ thông minh để tối ưu hệ thống thu gom." },
  ];

  const timeline = [
    { year: "2023", event: "Ý tưởng VeChaiTech ra đời trong Hackathon Đại học FPT." },
    { year: "2024", event: "Ra mắt bản thử nghiệm VeChaiTech Beta – kết nối thu gom rác thông minh." },
    { year: "2025", event: "Phát triển Gamification & Bản đồ thu mua thông minh, mở rộng hợp tác doanh nghiệp." },
    { year: "Tương lai", event: "Triển khai toàn quốc và xuất khẩu mô hình ra Đông Nam Á." },
  ];

  const partners = [
    "https://cdn-icons-png.flaticon.com/512/5968/5968231.png",
    "https://cdn-icons-png.flaticon.com/512/3443/3443338.png",
    "https://cdn-icons-png.flaticon.com/512/1006/1006366.png",
  ];

  return (
    <div className="bg-[#F1F8E9] text-gray-700">
      {/* Hero Section */}
      <section className="text-center py-20 px-6 relative">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#A5D6A7] to-[#2E7D32] mb-4 drop-shadow-md">
          VeChaiTech
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#33691E] mb-8">
          Biến rác thải thành tài nguyên – Tham gia hành trình xanh ngay hôm nay 🌱
        </h2>
        <BannerSlide />
        <div className="mt-8">
          <button className="bg-[#81C784] hover:bg-[#66BB6A] text-white px-8 py-3 rounded-full font-semibold shadow-lg transition transform hover:-translate-y-1">
            Bắt đầu hành trình xanh
          </button>
        </div>
      </section>

      {/* About */}
      <section className="max-w-4xl mx-auto px-6 text-center mt-20">
        <h3 className="text-4xl font-extrabold text-[#2E7D32] mb-6">VeChaiTech là gì?</h3>
        <p className="text-lg md:text-xl leading-relaxed">
          VeChaiTech là nền tảng công nghệ xanh kết nối người dân, điểm thu gom và doanh nghiệp tái chế, xây dựng hệ sinh thái tái chế minh bạch và bền vững tại Việt Nam.
        </p>
      </section>

      {/* Team Members */}
      <section className="mt-20 px-6">
        <h2 className="text-3xl font-bold text-[#2E7D32] text-center mb-12">Đội ngũ sáng lập</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          {members.map((m, i) => (
            <div key={i} className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm border border-[#A5D6A7]/40 hover:shadow-2xl transition transform hover:-translate-y-2">
              <img src={m.img} alt={m.name} className="w-40 h-40 rounded-full object-cover border-4 border-[#A5D6A7] mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-[#2E7D32]">{m.name}</h3>
              <p className="text-sm text-gray-600 mb-3 font-medium">{m.role}</p>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">{m.desc}</p>
              <p className="text-[#2E7D32] text-sm font-medium">📧 {m.contact}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="mt-20 bg-gradient-to-r from-[#A5D6A7]/20 to-[#F1F8E9] py-12 rounded-2xl text-center px-6">
        <h2 className="text-3xl font-bold text-[#2E7D32] mb-6">Tầm nhìn & Sứ mệnh</h2>
        <div className="max-w-4xl mx-auto text-gray-700 leading-relaxed">
          <p className="mb-4"><strong>Tầm nhìn:</strong> Trở thành nền tảng công nghệ hàng đầu Việt Nam trong việc thu gom, tái chế rác thải, xây dựng xã hội xanh – sạch – bền vững.</p>
          <p><strong>Sứ mệnh:</strong> Kết nối người dân, điểm thu gom và doanh nghiệp tái chế qua công nghệ số – giúp rác thải được quản lý minh bạch và khuyến khích cộng đồng hành động vì môi trường.</p>
        </div>
      </section>

      {/* Core Values */}
      <section className="mt-20 text-center px-6">
        <h2 className="text-3xl font-bold text-[#2E7D32] mb-8">Giá trị cốt lõi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {coreValues.map((v, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-8 border border-[#A5D6A7]/40 hover:shadow-2xl transition">
              <div className="text-5xl mb-4">{v.icon}</div>
              <h3 className="text-xl font-semibold text-[#2E7D32]">{v.title}</h3>
              <p className="text-gray-700 mt-3">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mt-20 bg-white py-12 rounded-2xl shadow-inner border border-[#A5D6A7]/30">
        <h2 className="text-3xl font-bold text-[#2E7D32] text-center mb-10">Hành trình phát triển</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {timeline.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="bg-[#A5D6A7] text-white font-bold text-lg px-4 py-2 rounded-full">{item.year}</div>
              <p className="text-gray-700 text-lg">{item.event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="mt-20 text-center px-6">
        <h2 className="text-3xl font-bold text-[#2E7D32] mb-8">Đối tác & Nhà tài trợ</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {partners.map((logo, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-4 w-40 h-40 flex items-center justify-center border border-[#A5D6A7]/40">
              <img src={logo} alt="Partner logo" className="w-20 h-20 object-contain" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 bg-gradient-to-r from-[#A5D6A7] to-[#81C784] py-12 rounded-2xl text-center text-white shadow-lg px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Cùng VeChaiTech Xây Dựng Tương Lai Xanh 🌱</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">Mỗi hành động nhỏ đều có thể tạo nên thay đổi lớn. Hãy cùng chúng tôi biến rác thải thành nguồn tài nguyên quý giá!</p>
        <button className="bg-white text-[#2E7D32] font-semibold px-8 py-3 rounded-full hover:bg-[#F1F8E9] transition">
          Tham gia cộng đồng VeChaiTech
        </button>
      </section>
    </div>
  );
}
