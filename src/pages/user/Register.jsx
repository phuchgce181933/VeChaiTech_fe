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
    <div style={styles.container}>
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg border border-gray-300 p-8 flex flex-col md:flex-row gap-8">
      {/* Cột trái: Giới thiệu */}
        <div className="flex-1 flex flex-col justify-start">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            🌱 Tại sao nên tạo tài khoản TerraCycle?
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Tài khoản TerraCycle cho phép bạn tham gia các chương trình tái chế miễn phí của chúng tôi. Bạn có thể sử dụng tài khoản để tái chế cho bản thân, gia đình, bạn bè, doanh nghiệp và thậm chí cả cộng đồng của bạn. Tham gia các chương trình, nhận nhãn vận chuyển trả trước và theo dõi các lô hàng tái chế cũng như tác động của chúng thông qua tài khoản của bạn. Chương trình của chúng tôi có sẵn tại 48 tiểu bang liên kề, bao gồm Washington, D.C.
          </p>
          <p className="text-gray-700 text-sm mt-2">
            Nếu bạn chọn giải pháp tái chế trả phí Zero Waste Box của chúng tôi, việc tạo tài khoản là không bắt buộc. Tuy nhiên, tài khoản sẽ cho phép bạn theo dõi lịch sử tái chế và thiết lập các đơn hàng định kỳ.
          </p>
          <p className="text-red-700 text-sm mt-2">
            Quan trọng:
          </p>
          <p className="text-red-600 text-sm font-medium mt-4">
            🔔 Lưu ý: Hãy thêm <span className="font-mono">brigades-no-reply@terracycle.com</span> vào danh bạ email để không bỏ lỡ thông tin quan trọng từ chúng tôi.
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
              style={{ ...styles.button, backgroundColor: "orange", color: "white", width: "100%" }}
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
    background: "#f3f3f3",
  },
  form: {
    background: "white",
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
    color: "white",
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "white",
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
