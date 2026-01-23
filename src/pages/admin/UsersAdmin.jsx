import { useEffect, useState } from "react";

export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [editingUser, setEditingUser] = useState(null);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/users/v1", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= UPDATE USER =================
  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        fullName: editingUser.fullName,
        username: editingUser.username,
        email: editingUser.email,
        phone: editingUser.phone,
        status: editingUser.status,
      };

      const res = await fetch(
        `http://localhost:8080/api/users/v1/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      await fetchUsers();
      setEditingUser(null);
    } catch (err) {
      alert("Cập nhật thất bại");
    }
  };

  // ================= HELPER =================
  const getRoleName = (u) =>
    u.roles?.[0]?.roleName?.replace("ROLE_", "") || "UNKNOWN";

  // ================= FILTER =================
  const filteredUsers = users.filter((u) => {
    const keyword =
      u.id.toString().includes(search) ||
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());

    const roleMatch =
      roleFilter === "ALL" || getRoleName(u) === roleFilter;

    return keyword && roleMatch;
  });

  // ================= UI =================
  if (loading) return <p className="text-center">Đang tải...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* ===== TITLE ===== */}
      <h1 className="text-2xl font-bold text-green-600 mb-1 uppercase">
        Quản lý người dùng
      </h1>
      <p className="text-sm text-gray-500 mb-6 uppercase">
        Danh sách toàn bộ tài khoản
      </p>

      {/* ===== FILTER ===== */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          className="border px-4 py-2 rounded-lg w-72"
          placeholder="Tìm ID, tên, username, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded-lg"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">Tất cả vai trò</option>
          <option value="ADMIN">ADMIN</option>
          <option value="CUSTOMER">CUSTOMER</option>
          <option value="TRADERS">TRADERS</option>
        </select>
      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg">
          <thead className="bg-gray-100 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Người dùng</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">SĐT</th>
              <th className="px-6 py-3 text-left">Vai trò</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{u.id}</td>

                <td className="px-6 py-4">
                  <p className="font-semibold">{u.fullName}</p>
                  <p className="text-sm text-gray-500">@{u.username}</p>
                </td>

                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">{u.phone}</td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-200">
                    {getRoleName(u)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {u.status ? (
                    <span className="text-green-600 font-semibold">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="text-gray-400">Bị khoá</span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => setEditingUser({ ...u })}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    ✏ Sửa
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[420px] p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">✏ Cập nhật user</h2>

            <div className="space-y-3">
              <input
                className="border p-2 w-full rounded"
                placeholder="Họ tên"
                value={editingUser.fullName}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, fullName: e.target.value })
                }
              />

              <input
                className="border p-2 w-full rounded"
                placeholder="Username"
                value={editingUser.username}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, username: e.target.value })
                }
              />

              <input
                className="border p-2 w-full rounded"
                placeholder="Email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />

              <input
                className="border p-2 w-full rounded"
                placeholder="Số điện thoại"
                value={editingUser.phone}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, phone: e.target.value })
                }
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingUser.status}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      status: e.target.checked,
                    })
                  }
                />
                Hoạt động
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Huỷ
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
