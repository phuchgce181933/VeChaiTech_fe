import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.fullName || !form.email || !form.subject || !form.message) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setSuccess("🌱 Gửi thành công! Chúng tôi sẽ phản hồi sớm.");
      setForm({ fullName: "", email: "", subject: "", message: "" });
    } catch {
      setError("❌ Không thể gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-2 items-start">

        {/* LEFT CONTENT */}
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-emerald-800">
            Liên hệ & Hỗ trợ
          </h2>

          <p className="text-base md:text-3xl text-gray-700 leading-relaxed">
            Bạn cần hỗ trợ, góp ý hay báo lỗi? VeChaiTech luôn sẵn sàng
            lắng nghe để xây dựng một hệ sinh thái tái chế xanh hơn.
          </p>

          <ul className="text-sm md:text-2xl space-y-2 text-gray-600">
            <li>⏱️ Thời gian phản hồi: trong 24h</li>
          </ul>
        </div>

        {/* FORM CARD */}
        <div
          className="
            bg-white/90 backdrop-blur-xl
            rounded-3xl shadow-2xl
            border border-emerald-200
            p-6 md:p-10
          "
        >
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">

            <div>
              <label className="text-sm font-medium text-gray-700">
                Họ và tên
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="
                  mt-1 w-full rounded-xl border border-gray-300
                  px-4 py-3
                  focus:outline-none focus:ring-2
                  focus:ring-emerald-400
                "
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="
                  mt-1 w-full rounded-xl border border-gray-300
                  px-4 py-3
                  focus:outline-none focus:ring-2
                  focus:ring-emerald-400
                "
                placeholder="email@gmail.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Chủ đề
              </label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="
                  mt-1 w-full rounded-xl border border-gray-300
                  px-4 py-3 bg-white
                  focus:outline-none focus:ring-2
                  focus:ring-emerald-400
                "
              >
                <option value="">-- Chọn chủ đề --</option>
                <option value="Hỗ trợ đăng nhập">Hỗ trợ đăng nhập</option>
                <option value="Báo lỗi hệ thống">Báo lỗi hệ thống</option>
                <option value="Góp ý cải tiến">Góp ý cải tiến</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Nội dung
              </label>
              <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                className="
                  mt-1 w-full rounded-xl border border-gray-300
                  px-4 py-3
                  focus:outline-none focus:ring-2
                  focus:ring-emerald-400
                "
                placeholder="Nhập nội dung cần hỗ trợ..."
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            {success && (
              <p className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-xl font-semibold text-white
                bg-gradient-to-r from-emerald-500 to-green-500
                hover:opacity-90 transition
                shadow-lg disabled:opacity-60
              "
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
