
export default function PolicyPage() {
  const coreValues = [
    { title: "Minh bạch", icon: "🔍", desc: "Công khai thông tin và quy trình vận hành." },
    { title: "Bền vững", icon: "🌱", desc: "Góp phần bảo vệ môi trường lâu dài." },
    { title: "Trách nhiệm", icon: "🤝", desc: "Chịu trách nhiệm với cộng đồng." },
    { title: "Đổi mới", icon: "💡", desc: "Liên tục cải tiến công nghệ và quy trình." },
  ];

  const benefits = [
    "Người dùng: Hưởng quyền lợi từ tích điểm, quà tặng và hỗ trợ trực tiếp.",
    "Doanh nghiệp: Tiết kiệm chi phí, tăng uy tín và minh bạch dữ liệu.",
    "Người thu gom: Nhận đào tạo và hỗ trợ công cụ thu gom hiệu quả.",
  ];

  const responsibilities = [
    "Cung cấp thông tin chính xác và cập nhật.",
    "Tuân thủ quy trình phân loại rác và giao dịch.",
    "Bảo vệ dữ liệu cá nhân và tuân thủ chính sách cộng đồng.",
  ];

  const privacyPolicy = [
    "Bảo mật thông tin cá nhân và giao dịch.",
    "Dữ liệu minh bạch, công khai theo quy định.",
    "Tuân thủ pháp luật về bảo vệ dữ liệu và quyền riêng tư.",
  ];

  const impactStats = [
    { label: "Tấn rác tái chế", value: "1000+" },
    { label: "Người tham gia", value: "50,000+" },
    { label: "Doanh nghiệp hợp tác", value: "30+" },
  ];

  const faq = [
    { q: "Thông tin cá nhân có được bảo mật không?", a: "Có. Chúng tôi cam kết bảo mật dữ liệu và chỉ sử dụng cho mục đích vận hành hệ thống." },
    { q: "Điểm thưởng có hết hạn không?", a: "Điểm thưởng có giá trị trong 12 tháng kể từ ngày phát sinh và có thể đổi quà hoặc ưu đãi." },
  ];

  const timeline = [
    { date: "Q1/2025", event: "Ra mắt chính sách minh bạch." },
    { date: "Q2/2025", event: "Triển khai đánh giá dữ liệu thu gom." },
    { date: "Q3/2025", event: "Cập nhật báo cáo công khai." },
    { date: "Q4/2025", event: "Mở rộng áp dụng cho doanh nghiệp & chính quyền." },
  ];

  return (
    <section className="py-16 px-6 bg-[#F1F8E9] text-center space-y-20">

      {/* Hero Section + CTA */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#A5D6A7] to-[#2E7D32]">
          Chính sách & Điều khoản
        </h1>
        <p className="text-lg text-gray-700">
          Khi sử dụng dịch vụ <strong>VeChaiTech</strong>, bạn đồng ý tuân thủ các chính sách của chúng tôi. Chúng tôi cam kết mang lại lợi ích kinh tế, xã hội và môi trường cho cộng đồng.
        </p>
        <button className="bg-[#2E7D32] text-white px-8 py-3 rounded-full hover:bg-[#81C784] transition">
          Tìm hiểu thêm
        </button>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {coreValues.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-md border border-[#A5D6A7]/40 hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="text-5xl mb-4">{c.icon}</div>
            <h3 className="text-xl font-semibold text-[#2E7D32] mb-2">{c.title}</h3>
            <p className="text-gray-700 text-sm">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Benefits & Responsibilities */}
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto text-left">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-[#2E7D32]">Quyền lợi</h2>
          <ul className="list-disc pl-6 space-y-2">
            {benefits.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-[#2E7D32]">Trách nhiệm</h2>
          <ul className="list-disc pl-6 space-y-2">
            {responsibilities.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      </div>

      {/* Privacy & Transparency */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl mx-auto border border-[#A5D6A7]/40">
        <h2 className="text-2xl font-bold mb-4 text-[#2E7D32]">Chính sách bảo mật & minh bạch</h2>
        <ul className="list-disc pl-6 space-y-2 text-left">
          {privacyPolicy.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto text-center">
        {impactStats.map((s, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl shadow-md border border-[#A5D6A7]/40">
            <div className="text-4xl font-extrabold text-[#2E7D32] mb-2">{s.value}</div>
            <div className="text-gray-700 font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto text-left space-y-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#2E7D32]">Câu hỏi thường gặp</h2>
        {faq.map((f, i) => (
          <details key={i} className="bg-white p-6 rounded-xl shadow border border-[#A5D6A7]/40">
            <summary className="font-semibold text-[#2E7D32] cursor-pointer">{f.q}</summary>
            <p className="text-gray-700 text-sm mt-2">{f.a}</p>
          </details>
        ))}
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto text-left">
        <h2 className="text-3xl font-bold mb-6 text-[#2E7D32] text-center">Timeline áp dụng chính sách</h2>
        <div className="relative border-l-2 border-gray-300 ml-4">
          {timeline.map((t, i) => (
            <div key={i} className="mb-8 ml-6 relative">
              <span className="absolute -left-5 top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
              <p className="font-semibold">{t.date}</p>
              <p className="text-gray-700">{t.event}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Kép */}
      <div className="flex flex-col md:flex-row gap-6 justify-center max-w-4xl mx-auto mt-16">
        <button className="bg-green-500 text-white font-semibold px-8 py-4 rounded-full hover:bg-green-600 transition">
          Dành cho cá nhân
        </button>
        <button className="bg-blue-500 text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-600 transition">
          Dành cho doanh nghiệp
        </button>
      </div>

    </section>
  );
}
