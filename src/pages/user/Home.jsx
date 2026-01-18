import BannerSlide from "./Banner";
import WasteListings from "./WasteListings";
import RecyclerDemands from "./RecyclerDemands";
import MapDirection from "./MapDirection";

export default function About() {
  return (
    <div className="bg-gradient-to-b from-white via-[#E8F5E9] to-[#C8E6C9]">
      {/* Banner */}
      <section className="relative w-full h-screen overflow-hidden m-0 p-0">
        <div className="absolute inset-0 w-full h-full z-0">
          <BannerSlide className="w-full h-full" />
        </div>
      </section>

      {/* Waste & Recycler */}
      <section className="mt-0 px-6">
        <div className="w-full h-full">
          <WasteListings />
          <div className="my-4">
            <RecyclerDemands />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="mt-24 px-6 relative">
        <div className="text-center mb-10">
          <h3 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#2E7D32] to-[#00A8CC]">
            Tìm điểm thu gom gần bạn
          </h3>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Xác định vị trí nhanh chóng, tìm điểm thu gom hoặc nhà tái chế gần nhất để tiết kiệm thời gian và chi phí.
          </p>
        </div>

        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-[rgba(76,175,80,0.25)] border border-[#66BB6A]/40">
          <MapDirection />
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#E8F5E9] via-[#C8E6C9]/70 to-[#B2DFDB] relative overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#2E7D32] via-[#00A8CC] to-[#66BB6A]">
            Liên hệ & Hỗ trợ
          </h2>
          <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
            Bạn có câu hỏi, góp ý hoặc cần hỗ trợ? Hãy gửi yêu cầu cho VeChaiTech!
            Chúng tôi luôn sẵn sàng đồng hành cùng bạn.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl shadow-[rgba(0,168,204,0.15)] border border-[#66BB6A]/30">
          <form className="space-y-6">
            <div className="text-left">
              <label className="block text-[#2E7D32] font-semibold mb-2">Họ và tên</label>
              <input
                type="text"
                placeholder="Nhập họ và tên của bạn"
                className="w-full border border-[#C8E6C9] rounded-xl p-3 focus:ring-2 focus:ring-[#66BB6A] outline-none bg-[#F9FBF8]"
              />
            </div>

            <div className="text-left">
              <label className="block text-[#2E7D32] font-semibold mb-2">Email</label>
              <input
                type="email"
                placeholder="Nhập địa chỉ email"
                className="w-full border border-[#C8E6C9] rounded-xl p-3 focus:ring-2 focus:ring-[#66BB6A] outline-none bg-[#F9FBF8]"
              />
            </div>

            <div className="text-left">
              <label className="block text-[#2E7D32] font-semibold mb-2">Nội dung liên hệ</label>
              <textarea
                rows="5"
                placeholder="Nhập nội dung..."
                className="w-full border border-[#C8E6C9] rounded-xl p-3 focus:ring-2 focus:ring-[#66BB6A] outline-none resize-none bg-[#F9FBF8]"
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="
                  bg-gradient-to-r from-[#66BB6A] via-[#00A8CC] to-[#2E7D32]
                  hover:opacity-90
                  text-white px-10 py-3 rounded-full font-bold tracking-wide
                  shadow-md hover:shadow-lg transition-all duration-300
                "
              >
                Gửi yêu cầu
              </button>
            </div>
          </form>
        </div>
      </section>
      {/* Footer nằm ở layout */}
    </div>
  );
}
