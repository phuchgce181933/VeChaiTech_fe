import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verifyMethod, setVerifyMethod] = useState(""); // "EMAIL" hoặc "SMS"


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // Khai báo hàm
  const handleVerify = async (method) => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          deliveryMethod: method, // EMAIL hoặc SMS
        }),
      });

      if (res.ok) {
        setMessage("OTP đã được gửi qua " + (method === "EMAIL" ? "Email" : "SMS"));
        setOtpSent(true);
      } else {
        const err = await res.json();
        setMessage(err.message || "Gửi OTP thất bại!");
      }
    } catch (error) {
      console.error(error);
      setMessage("Lỗi kết nối server!");
    }
  };

  // Xác nhận OTP
  const handleConfirmOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/confirm-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: verifyMethod === "EMAIL" ? formData.email : formData.phone,
          otp: otp,
        }),
      });

      if (res.ok) {
        setMessage("Đăng ký thành công!");
        setOtpSent(false);
        setOtp("");
      } else {
        const err = await res.json();
        setMessage(err.message || "OTP không hợp lệ!");
      }
    } catch (error) {
      console.error(error);
      setMessage("Lỗi kết nối server!");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center from-[#aff0b5] via-[#b2e0b6] to-[#17e11e]">
      <div className="w-full max-w-3xl bg-gradient-to-br from-[#aff0b5] via-[#b2e0b6] to-[#17e11e] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border p-8 flex flex-col md:flex-row gap-8">
        {/* Cột trái: Giới thiệu */}
        <div className="flex-1 flex flex-col justify-start">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            VeChaiTech làm gì?
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Ứng dụng Ve Chai Tech - Đặt Lịch Thu Gom Rác là một nền
          </p>
          <p className="text-gray-700 text-sm mt-2">
            tảng hỗ trợ thu gom tái chế phế liệu dành cho người dùng
          </p>
          <p className="text-gray-700 text-sm mt-2">
            cá nhân và hộ gia đình. Mục tiêu chính của ứng dụng là
            khuyến khích người dùng thu gom phế liệu tại nhà và nhận
            điểm thưởng (Rcoin) để đổi quà hoặc tiền. Đây là một dự án
            nhằm thúc đẩy ý thức bảo vệ môi trường và tối ưu hóa quá trình tái chế.
          </p>
          <h3 className="text-2xl font-bold text-green-700 mb-1">
            VeChaiTech gom gì?
          </h3>
          <p className="text-gray-700 text-sm mt-2">
            Vỏ lon nước giải khát (Ví dụ: lon nước ngọt, lon bia, …)
            Nhôm các loại bao gồm các vật dụng bằng nhôm như nồi, lọ, nhôm đà
            Giấy sách báo đã qua sử dụng
            Nhựa tổng hợp bao gồm PETE1, 2/4/5
            Đồng, và Sắt thép
          </p>
        </div>
        <form style={styles.form}>
          <h2>Đăng ký</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="fullName"
            placeholder="Họ và tên"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          {/* Nhóm button xác thực */}
          <button
            type="button"
            onClick={() => {
              setVerifyMethod("EMAIL");
              handleVerify("EMAIL");
            }}
            className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded"
          >
            Xác thực với email
          </button>

          <button
            type="button"
            onClick={() => {
              setVerifyMethod("SMS");
              handleVerify("SMS");
            }}
            className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded"
          >
            Xác thực với số điện thoại
          </button>

          {/* Nếu OTP đã gửi thì hiển thị ô nhập OTP và nút xác nhận */}
          {otpSent && (
            <>
              <input
                type="text"
                placeholder="Nhập OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={styles.input}
              />

              <button
                type="button"
                style={{ ...styles.button, backgroundColor: "linear-gradient(to bottom right, #d1fae5, #a7f3d0)", color: "linear-gradient(to bottom right, #d1fae5, #a7f3d0)", width: "100%" }}
                onClick={handleConfirmOtp}
              >
                Xác nhận OTP
              </button>
            </>
          )}
          {message && <p style={styles.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

// CSS inline
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #e8fdf5, #ccfbf1)",
  },
  form: {
    background: "#e8fdf5",
    padding: "20px",
    borderRadius: "10px",
    width: "320px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    margin: "10px 0",
  },
  verifyButton: {
    backgroundColor: "#2196F3",
    color: "#e8fdf5",
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "#e8fdf5",
    width: "100%",
    marginTop: "10px",
  },
  message: {
    marginTop: "10px",
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
};

export default Register;
