export default function AboutPage() {
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

  return (
    <div className="bg-[#F1F8E9] text-gray-700">
     

      {/* About */}
      <section className="max-w-4xl mx-auto px-6 text-center mt-20">
        <h3 className="text-4xl font-extrabold text-[#2E7D32] mb-6">VeChaiTech là gì?</h3>
        <p className="text-lg md:text-xl leading-relaxed">
          VeChaiTech là nền tảng công nghệ xanh kết nối người dân, điểm thu gom và doanh nghiệp tái chế, xây dựng hệ sinh thái tái chế minh bạch và bền vững tại Việt Nam.
        </p>
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
