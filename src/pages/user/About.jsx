export default function MinimalLanding() {
  return (
    <div className="bg-white text-gray-900">

      {/* ================= HERO ================= */}
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Tài nguyên cũ.
          <br />
          Giá trị mới.
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-xl">
          Nền tảng giao dịch tài nguyên tái chế và hàng đã qua sử dụng,
          kết nối con người – doanh nghiệp – đơn vị tái chế.
        </p>

        <div className="mt-10 flex gap-8 text-sm font-semibold">
          <button className="underline underline-offset-4">Bắt đầu</button>
          <button className="underline underline-offset-4">Marketplace</button>
        </div>
      </section>

      {/* ================= HERO IMAGE ================= */}
      <section className="w-full">
        <img
          src="https://images.unsplash.com/photo-1611270629569-8b357cb88da9"
          alt="Recycling industry"
          className="w-full h-[70vh] object-cover"
        />
      </section>

      {/* ================= METRICS ================= */}
      <section className="max-w-6xl mx-auto px-6 py-28 grid grid-cols-2 md:grid-cols-4 gap-16">
        {[
          ["12,4 tấn", "Vật liệu đã thu gom"],
          ["320+", "Sản phẩm giao dịch"],
          ["1.200+", "Người dùng hoạt động"],
          ["18", "Đối tác tái chế"],
        ].map(([value, label], i) => (
          <div key={i}>
            <div className="text-4xl font-bold tracking-tight">{value}</div>
            <div className="text-sm text-gray-500 mt-2">{label}</div>
          </div>
        ))}
      </section>

      {/* ================= STORY SECTION ================= */}
      <section className="max-w-5xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Một hệ thống đang vận hành thật
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            VeChaiTech không chỉ dừng lại ở việc thu gom rác.
            Chúng tôi xây dựng một hệ thống dữ liệu giúp theo dõi,
            định giá và đưa tài nguyên đã qua sử dụng quay trở lại thị trường.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Mỗi giao dịch đều minh bạch, có thể kiểm chứng và tạo ra giá trị
            kinh tế thực tế cho các bên tham gia.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1581090700227-1e37b190418e"
          alt="Industrial recycling"
          className="w-full h-[420px] object-cover"
        />
      </section>

      {/* ================= PROCESS ================= */}
      <section className="max-w-4xl mx-auto px-6 py-28">
        <h2 className="text-2xl font-semibold mb-10">
          Cách nền tảng vận hành
        </h2>
        <ul className="space-y-4 text-gray-600 text-lg">
          <li>Thu gom → Phân loại → Định giá → Giao dịch</li>
          <li>Dữ liệu cập nhật theo thời gian thực</li>
          <li>Kết nối trực tiếp người bán – người mua – đơn vị tái chế</li>
        </ul>
      </section>

      {/* ================= MARKETPLACE PREVIEW ================= */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <h2 className="text-3xl font-bold mb-14">
          Marketplace tài nguyên tái chế
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            "https://images.unsplash.com/photo-1593941707882-a5bba14938c7",
            "https://images.unsplash.com/photo-1602526219045-2b47c3fbc21a",
            "https://images.unsplash.com/photo-1586864387789-628af9feed72",
          ].map((src, i) => (
            <div key={i}>
              <img
                src={src}
                alt="Marketplace item"
                className="w-full h-[300px] object-cover mb-4"
              />
              <div className="text-sm text-gray-500">Sản phẩm tái chế</div>
              <div className="font-semibold mt-1">Vật liệu đã qua sử dụng</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FULL IMAGE BREAK ================= */}
      <section className="w-full">
        <img
          src="https://images.unsplash.com/photo-1611270629569-8b357cb88da9"
          alt="Warehouse"
          className="w-full h-[60vh] object-cover"
        />
      </section>

      {/* ================= CTA ================= */}
      <section className="max-w-4xl mx-auto px-6 py-40">
        <h2 className="text-4xl font-bold mb-8 leading-tight">
          Rác thải chỉ là tài nguyên
          <br />
          bị đặt sai chỗ.
        </h2>
        <button className="underline underline-offset-4 text-lg font-semibold">
          Tham gia nền tảng
        </button>
      </section>

    </div>
  );
}
