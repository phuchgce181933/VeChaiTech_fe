export default function ServicePage() {
  const services = [
    {
      title: "Thu mua & tái chế thông minh",
      icon: "♻️",
      desc: "Kết nối người dân với các điểm thu gom gần nhất thông qua bản đồ thông minh, giúp rác thải được xử lý đúng quy trình và tái chế hiệu quả.",
    },
    {
      title: "Ứng dụng tích điểm & phần thưởng",
      icon: "🎯",
      desc: "Mỗi khi bạn bán rác hoặc tham gia hoạt động xanh, hệ thống sẽ tự động tích điểm và cho phép đổi quà hấp dẫn qua chương trình gamification.",
    },
    {
      title: "Kết nối doanh nghiệp tái chế",
      icon: "🏭",
      desc: "VeChaiTech đóng vai trò trung gian giúp doanh nghiệp tái chế, cơ sở thu gom và người dân hợp tác trong chuỗi cung ứng minh bạch.",
    },
    {
      title: "Giải pháp cho cộng đồng & trường học",
      icon: "🏫",
      desc: "Chúng tôi cung cấp giải pháp thu gom tái chế định kỳ cho trường học, khu dân cư, nhằm giáo dục ý thức bảo vệ môi trường cho thế hệ trẻ.",
    },
  ];

  const steps = [
    { step: "1", title: "Đăng ký tài khoản", desc: "Tạo tài khoản miễn phí trên website hoặc ứng dụng VeChaiTech để bắt đầu hành trình xanh." },
    { step: "2", title: "Chọn loại rác cần bán", desc: "Hệ thống gợi ý giá thu mua theo thời gian thực và các điểm thu gom gần vị trí của bạn." },
    { step: "3", title: "Giao rác & nhận điểm", desc: "Người thu gom đến tận nơi, bạn nhận tiền và điểm thưởng để đổi quà hoặc nâng cấp hạng thành viên." },
  ];

  const benefits = [
    { icon: "💰", title: "Giá thu mua minh bạch", desc: "Người dùng luôn biết giá rác thải theo thời gian thực, không lo bị ép giá." },
    { icon: "🌍", title: "Góp phần bảo vệ môi trường", desc: "Mỗi kg rác được tái chế là một bước tiến đến tương lai bền vững hơn cho hành tinh." },
    { icon: "⚙️", title: "Tự động & tiện lợi", desc: "Chỉ cần vài cú chạm – hệ thống tự động tìm người thu mua, thanh toán và cộng điểm cho bạn." },
    { icon: "🤝", title: "Kết nối cộng đồng xanh", desc: "Tham gia mạng lưới người dùng và doanh nghiệp cùng hướng đến mục tiêu phát triển bền vững." },
  ];

  return (
    <section className="py-16 px-6 bg-[#F1F8E9] text-center">
      {/* 1️⃣ Phần tiêu đề */}
      <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#A5D6A7] to-[#2E7D32] mb-6">
        Dịch vụ của VeChaiTech
      </h1>
      <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
        VeChaiTech mang đến các giải pháp công nghệ giúp **biến rác thải thành tài nguyên**,
        tối ưu chuỗi thu gom, tái chế và thưởng người dùng thông qua hệ thống điểm thưởng thông minh.
      </p>

      {/* 2️⃣ Các dịch vụ chính */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {services.map((s, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-2xl shadow-md border border-[#A5D6A7]/40 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">{s.icon}</div>
            <h3 className="text-xl font-semibold text-[#2E7D32] mb-2">{s.title}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* 3️⃣ Quy trình hoạt động */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-[#2E7D32] mb-8">Quy trình hoạt động</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-md border border-[#A5D6A7]/40 hover:shadow-lg transition"
            >
              <div className="bg-[#A5D6A7] text-white w-10 h-10 flex items-center justify-center rounded-full mx-auto mb-4 font-bold">
                {s.step}
              </div>
              <h3 className="text-lg font-semibold text-[#2E7D32]">{s.title}</h3>
              <p className="text-gray-700 text-sm mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4️⃣ Lợi ích */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-[#2E7D32] mb-8">Lợi ích khi sử dụng VeChaiTech</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-md border border-[#A5D6A7]/40 hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{b.icon}</div>
              <h3 className="text-lg font-semibold text-[#2E7D32] mb-2">{b.title}</h3>
              <p className="text-gray-700 text-sm">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5️⃣ CTA */}
      <div className="bg-gradient-to-r from-[#A5D6A7] to-[#81C784] py-12 px-6 rounded-2xl shadow-lg text-white max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-4">Bắt đầu hành trình xanh của bạn ngay hôm nay 🌱</h2>
        <p className="text-lg mb-6">
          Đăng ký tài khoản VeChaiTech để tham gia hệ thống tái chế thông minh,
          kiếm điểm thưởng và cùng chúng tôi bảo vệ hành tinh!
        </p>
        <button className="bg-white text-[#2E7D32] font-semibold px-8 py-3 rounded-full hover:bg-[#F1F8E9] transition">
          Đăng ký ngay
        </button>
      </div>
      {/* 6️⃣ Dịch vụ dành cho doanh nghiệp & đối tác tái chế */}
      <section className="mt-20 bg-white rounded-2xl shadow-lg py-16 px-6 border border-[#A5D6A7]/40">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-[#2E7D32] mb-4">
            Dịch vụ dành cho Doanh nghiệp & Đối tác Tái chế
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            VeChaiTech cung cấp các giải pháp **tái chế thông minh** cho doanh nghiệp – từ quản lý dòng rác,
            thu mua phế liệu số hóa đến theo dõi chuỗi cung ứng tái chế minh bạch.
          </p>
        </div>

        {/* Gói dịch vụ cho doanh nghiệp */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Gói Cơ bản",
              price: "Miễn phí",
              features: [
                "Theo dõi lượng rác thu gom hằng tháng",
                "Truy cập bản đồ thu mua thông minh",
                "Nhận báo cáo định kỳ qua email",
              ],
            },
            {
              title: "Gói Nâng cao",
              price: "599.000đ / tháng",
              features: [
                "Tích hợp API theo dõi chuỗi tái chế",
                "Tạo báo cáo carbon footprint cho doanh nghiệp",
                "Cảnh báo & đề xuất tối ưu thu gom",
              ],
            },
            {
              title: "Gói Doanh nghiệp lớn",
              price: "Liên hệ",
              features: [
                "Hệ thống quản lý rác thải nội bộ (B2B)",
                "Dashboard quản lý đa chi nhánh",
                "Tích hợp IoT cảm biến & báo cáo môi trường",
              ],
            },
          ].map((plan, i) => (
            <div
              key={i}
              className="bg-[#F1F8E9] rounded-2xl shadow-md border border-[#A5D6A7]/50 p-8 hover:shadow-xl transition transform hover:-translate-y-2"
            >
              <h3 className="text-2xl font-semibold text-[#2E7D32] mb-2">{plan.title}</h3>
              <p className="text-lg text-gray-600 mb-4">{plan.price}</p>
              <ul className="text-gray-700 space-y-2 text-left">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#2E7D32] font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="mt-6 bg-[#A5D6A7] hover:bg-[#81C784] text-white px-6 py-2 rounded-full font-semibold transition">
                Đăng ký ngay
              </button>
            </div>
          ))}
        </div>

        {/* Biểu đồ minh họa quy trình thu gom */}
        <div className="mt-12 text-center">
          <h3 className="text-3xl font-bold text-[#2E7D32] mb-6">Biểu đồ quy trình thu gom & tái chế thông minh</h3>
          <p className="text-gray-700 mb-8 max-w-3xl mx-auto">
            Quy trình khép kín của VeChaiTech giúp đảm bảo rác thải được thu gom, phân loại và xử lý đúng cách —
            đồng thời doanh nghiệp có thể theo dõi hiệu quả tái chế theo thời gian thực.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {[
              { icon: "🏠", label: "Người dân / Nguồn rác" },
              { icon: "🚛", label: "Điểm thu gom" },
              { icon: "🏭", label: "Doanh nghiệp tái chế" },
              { icon: "📊", label: "Báo cáo & Dữ liệu môi trường" },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="bg-[#A5D6A7] w-16 h-16 flex items-center justify-center rounded-full text-white text-3xl mb-3 shadow-md">
                  {step.icon}
                </div>
                <p className="text-sm text-gray-700 font-medium w-32">{step.label}</p>
                {i < 3 && (
                  <div className="hidden md:block w-20 h-[2px] bg-[#A5D6A7] mx-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA cho doanh nghiệp */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-[#2E7D32] mb-4">Trở thành đối tác của VeChaiTech</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Hãy cùng chúng tôi xây dựng chuỗi cung ứng tái chế minh bạch và bền vững.
            Liên hệ ngay để nhận tư vấn giải pháp phù hợp cho doanh nghiệp của bạn.
          </p>
          <button className="bg-[#A5D6A7] hover:bg-[#81C784] text-white font-semibold px-8 py-3 rounded-full transition">
            Liên hệ hợp tác
          </button>
        </div>
      </section>
    </section>
  );
}
