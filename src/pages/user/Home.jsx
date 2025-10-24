import BannerSlide from "./Banner";
import WasteListings from "./WasteListings";
import RecyclerDemands from "./RecyclerDemands";
import MapDirection from "./MapDirection";
export default function About() {
  return (
    <div className="bg-gradient-to-b from-white via-[#F1F8E9] to-[#E8F5E9]">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24 px-6 relative overflow-hidden">
        {/* Hiệu ứng nền */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8F5E9]/60 to-transparent"></div>

        {/* Tiêu đề chính */}
        <div className="relative z-10">
          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-[#66BB6A] to-[#2E7D32] bg-clip-text text-transparent drop-shadow-md mb-3">
            VeChaiTech
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-[#33691E] mb-8">
            Biến rác thành tài nguyên – Kiếm thưởng xanh dễ dàng 🌱
          </h2>

          {/* Banner */}
          <div className="max-w-5xl mx-auto mt-10">
            <BannerSlide />
          </div>

          {/* CTA */}
          <div className="mt-10 flex justify-center">
            <button className="bg-[#81C784] hover:bg-[#66BB6A] text-white px-8 py-4 rounded-full font-semibold shadow-lg transition transform hover:-translate-y-1">
              Bắt đầu hành trình xanh
            </button>
          </div>
        </div>
      </section>

      {/* Giới thiệu */}
      <section className="text-center mt-16 px-6 max-w-4xl mx-auto">
        <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#A5D6A7] to-[#2E7D32] bg-clip-text text-transparent drop-shadow-md">
          Cùng nhau, chúng ta biến rác thải thành tài nguyên quý giá
        </h3>
        <p className="mt-6 text-lg md:text-xl text-gray-700 leading-relaxed">
          Tham gia VeChaiTech — nền tảng kết nối người dân, doanh nghiệp và nhà tái chế,
          giúp phân loại – thu gom – đổi thưởng rác thải nhanh chóng, minh bạch và bền vững.
        </p>

        {/* Hành động phụ */}
        <div className="mt-8 flex justify-center gap-4">
          <button className="border-2 border-[#81C784] text-[#2E7D32] px-6 py-3 rounded-full font-semibold hover:bg-[#A5D6A7]/10 transition">
            Tìm hiểu thêm
          </button>
          <button className="bg-[#A5D6A7] hover:bg-[#81C784] text-white px-6 py-3 rounded-full font-semibold transition">
            Tham gia ngay
          </button>
        </div>
      </section>

      {/* Danh sách rác thải / nhu cầu thu gom */}
      <section className="mt-24 px-6">
        <h3 className="text-center text-4xl font-bold text-[#2E7D32] mb-8">
          ♻️ Danh mục tái chế & Nhu cầu thu gom
        </h3>
        <div className="max-w-6xl mx-auto">
          <WasteListings />
          <div className="my-10">
            <RecyclerDemands />
          </div>
        </div>
      </section>

      {/* Bản đồ */}
      <section className="mt-24 px-6 relative">
        <div className="text-center mb-10">
          <h3 className="text-4xl md:text-5xl font-bold text-[#2E7D32]">
             Tìm điểm thu gom gần bạn
          </h3>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Xác định vị trí nhanh chóng, tìm điểm thu gom hoặc nhà tái chế gần nhất để tiết kiệm thời gian và chi phí.
          </p>
        </div>
        <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-[#A5D6A7]/50">
          <MapDirection />
        </div>
      </section>

      {/* A5 */}
      {/*  HỆ THỐNG ĐIỂM XANH & ĐỔI GIÁ TRỊ */}
      <section className="py-12 px-6 bg-gradient-to-b from-[#F1F8E9] to-white text-center">
        <h2 className="text-5xl font-extrabold bg-gradient-to-r from-[#A5D6A7] to-[#2E7D32] bg-clip-text text-transparent">
          Nền kinh tế điểm xanh 🌿
        </h2>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
          Mỗi hành động xanh của bạn đều mang lại giá trị thật — tiết kiệm tiền, nhận ưu đãi, và khẳng định vị thế trong cộng đồng bền vững.
        </p>

        {/* Thông tin điểm hiện có */}
        <div className="bg-white mt-10 rounded-2xl shadow-lg max-w-lg mx-auto p-8 border border-[#A5D6A7]/40">
          <h3 className="text-2xl font-semibold text-[#2E7D32] mb-4">
            Điểm hiện có: <span className="text-3xl font-bold text-[#81C784]">720</span> điểm
          </h3>

          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
            <div className="bg-[#81C784] h-4 w-[72%] rounded-full"></div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Cấp độ hiện tại: <b>Nhà thu gom tích cực</b> — bạn đang tiết kiệm trung bình <b>~70.000đ mỗi tháng</b> qua hoạt động tái chế!
          </p>

          <button className="bg-[#2E7D32] hover:bg-[#388E3C] text-white px-6 py-3 rounded-full font-semibold transition">
            Đổi ưu đãi ngay 💚
          </button>
        </div>

        {/*  Gói đổi điểm thực tế */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-[#2E7D32] mb-6">
            🎫 Đổi điểm – Nhận giá trị thật
          </h3>
          <p className="text-gray-700 mb-10 max-w-2xl mx-auto">
            Điểm xanh của bạn có thể dùng để giảm giá, mua hàng, hoặc mở khóa quyền lợi độc quyền từ các đối tác VeChaiTech.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
            {[
              {
                title: "Eco Coupon",
                desc: "200 điểm = Giảm 15% khi mua sản phẩm xanh tại Greenmart, Refill Station...",
                icon: "https://cdn-icons-png.flaticon.com/512/3081/3081648.png",
              },
              {
                title: "Adopt a Tree",
                desc: "500 điểm = Trồng 1 cây thật mang tên bạn, theo dõi qua bản đồ xanh 🌳",
                icon: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
              },
              {
                title: "Green Experience",
                desc: "800 điểm = Tham gia workshop chế tạo sản phẩm tái chế miễn phí",
                icon: "https://cdn-icons-png.flaticon.com/512/1046/1046869.png",
              },
              {
                title: "Eco Trip Pass",
                desc: "1500 điểm = Tham gia chuyến du lịch sinh thái hoặc khu bảo tồn thiên nhiên",
                icon: "https://cdn-icons-png.flaticon.com/512/2303/2303938.png",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg hover:-translate-y-1 transition"
              >
                <img src={item.icon} alt={item.title} className="w-16 h-16 mb-3" />
                <h4 className="text-xl font-bold text-[#2E7D32]">{item.title}</h4>
                <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 🏆 TOP NGƯỜI DẪN ĐẦU */}
        <div className="mt-20 bg-gradient-to-r from-[#A5D6A7]/20 to-[#81C784]/30 py-10 px-6 rounded-2xl shadow-inner border border-[#A5D6A7]/30">
          <h3 className="text-3xl font-bold text-[#2E7D32] mb-6">
            🏆 Bảng Vàng Nhà Xanh – Top Cống Hiến Hàng Tháng
          </h3>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Cống hiến càng nhiều – nhận càng nhiều giá trị. Người đứng đầu bảng xếp hạng mỗi tháng sẽ nhận thưởng thực tế từ VeChaiTech và các đối tác.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                rank: "Top 1",
                reward:
                  "🎉 Phiếu mua hàng 1.000.000đ + Cúp vàng + Hỗ trợ truyền thông cho dự án cá nhân",
                icon: "https://cdn-icons-png.flaticon.com/512/2583/2583329.png",
              },
              {
                rank: "Top 2",
                reward:
                  "🥈 Voucher 700.000đ + Huy hiệu Bạc + Ưu tiên xuất hiện trên bảng tin cộng đồng",
                icon: "https://cdn-icons-png.flaticon.com/512/2583/2583345.png",
              },
              {
                rank: "Top 3",
                reward:
                  "🥉 Voucher 400.000đ + Huy hiệu Đồng + 1 Workshop miễn phí",
                icon: "https://cdn-icons-png.flaticon.com/512/2583/2583316.png",
              },
              {
                rank: "Top 10",
                reward:
                  "🎟️ Voucher giảm 20% tại các đối tác + Cơ hội tham gia thử thách xanh đặc biệt",
                icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg hover:-translate-y-1 transition"
              >
                <img src={item.icon} alt={item.rank} className="w-16 h-16 mb-3" />
                <h4 className="text-xl font-bold text-[#2E7D32]">{item.rank}</h4>
                <p className="text-gray-600 text-sm mt-2 text-center">{item.reward}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <button className="border border-[#A5D6A7] text-[#2E7D32] px-6 py-3 rounded-full font-medium hover:bg-[#A5D6A7]/10 transition">
              🔍 Xem bảng xếp hạng & cách leo hạng
            </button>
          </div>
        </div>
      </section>


      {/* A6 */}
      <section className="py-16 px-6 bg-[#F1F8E9] relative overflow-hidden">
        {/* Tiêu đề */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#A5D6A7] to-[#2E7D32]">
            Liên hệ & Hỗ trợ
          </h2>
          <p className="mt-3 text-lg text-gray-700 max-w-2xl mx-auto">
            Nếu bạn có bất kỳ thắc mắc, góp ý hoặc cần hỗ trợ, vui lòng gửi yêu cầu qua biểu mẫu bên dưới.
            Đội ngũ VeChaiTech luôn sẵn sàng lắng nghe và hỗ trợ bạn!
          </p>
        </div>

        {/* Biểu mẫu liên hệ */}
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-[#A5D6A7]/40">
          <form className="space-y-6">
            <div className="text-left">
              <label className="block text-[#2E7D32] font-medium mb-2">Họ và tên</label>
              <input
                type="text"
                placeholder="Nhập họ và tên của bạn"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#A5D6A7] outline-none"
              />
            </div>

            <div className="text-left">
              <label className="block text-[#2E7D32] font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="Nhập địa chỉ email của bạn"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#A5D6A7] outline-none"
              />
            </div>

            <div className="text-left">
              <label className="block text-[#2E7D32] font-medium mb-2">Nội dung liên hệ</label>
              <textarea
                rows="5"
                placeholder="Nhập nội dung cần liên hệ..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#A5D6A7] outline-none resize-none"
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-[#A5D6A7] hover:bg-[#81C784] text-white px-8 py-3 rounded-full font-semibold transition"
              >
                Gửi yêu cầu
              </button>
            </div>
          </form>
        </div>

        {/* Khung chat trực tuyến */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white shadow-2xl rounded-2xl border border-[#A5D6A7]/40 p-4 w-72">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/219/219970.png"
                alt="Hỗ trợ viên"
                className="w-10 h-10 rounded-full border border-[#A5D6A7]"
              />
              <div className="text-left">
                <p className="font-semibold text-[#2E7D32]">Hỗ trợ viên VeChaiTech</p>
                <p className="text-xs text-gray-500">Đang hoạt động</p>
              </div>
            </div>

            <div className="bg-[#F1F8E9] rounded-lg p-3 text-left mb-3">
              <p className="text-sm text-gray-700">
                Xin chào! Tôi có thể giúp gì cho bạn hôm nay?
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="flex-1 border border-gray-300 rounded-full p-2 px-3 text-sm focus:ring-1 focus:ring-[#A5D6A7] outline-none"
              />
              <button className="bg-[#A5D6A7] hover:bg-[#81C784] text-white rounded-full p-2 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
    </div>
  );
}
