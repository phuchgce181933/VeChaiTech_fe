import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import PropTypes from "prop-types";
export default function Profile() {
  const { user, setUser } = useContext(AuthContext);

  const [isEdit, setIsEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  if (!user) {
    return <div className="pt-32 text-center text-red-500">Bạn chưa đăng nhập</div>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setIsSaving(true);
      const res = await axios.put(
        `${API_BASE}/api/users/v1/${user.id}`,
        form
      );

      setUser(res.data);
      setIsEdit(false);
    } catch {
      alert("Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pt-32 flex justify-center">
      <div className="w-full max-w-lg bg-green-50 rounded-3xl shadow-lg p-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Hồ sơ cá nhân
          </h1>
          <p className="text-sm text-gray-500">
            Quản lý thông tin tài khoản của bạn
          </p>
        </div>

        {/* CONTENT */}
        <div className="space-y-6">
          <Field
            label="Họ và tên"
            editable={isEdit}
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            display={user.fullName}
          />

          <Field
            label="Email"
            editable={isEdit}
            name="email"
            value={form.email}
            onChange={handleChange}
            display={user.email}
          />

          <Field
            label="Số điện thoại"
            editable={isEdit}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            display={user.phone || "Chưa cập nhật"}
          />
        </div>

        {/* ACTION BAR */}
        <div className="mt-10 flex justify-end gap-3 border-t pt-6">
          {isEdit ? (
            <>
              <button
                onClick={() => setIsEdit(false)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
              >
                Huỷ
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSaving}
                className="px-6 py-2 rounded-lg bg-black text-white disabled:opacity-60"
              >
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-6 py-2 rounded-lg bg-black text-white"
            >
              Chỉnh sửa hồ sơ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */

function Field({ label, editable, name, value, onChange, display }) {
  return (
    <div className="flex justify-between items-center border-b py-2">
      <label className="text-gray-600 font-medium">{label}</label>

      {editable ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="border px-2 py-1 rounded w-1/2"
        />
      ) : (
        <span className="text-gray-800">{display ?? value}</span>
      )}
    </div>
  );
}

/* ================= PROPTYPES ================= */

Field.propTypes = {
  label: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.any,
  display: PropTypes.node,
  onChange: PropTypes.func,
};




