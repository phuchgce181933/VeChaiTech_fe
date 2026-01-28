import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function TradersProfile() {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">👤 Hồ sơ của tôi</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] rounded-full flex items-center justify-center text-4xl">
            ♻️
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user?.username || "Traders"}</h2>
            <p className="text-gray-600">ID: {user?.id}</p>
            <p className="text-green-600 font-semibold mt-2">👤 {user?.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t">
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-semibold text-gray-800">{user?.email || "-"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Điện thoại</p>
            <p className="font-semibold text-gray-800">{user?.phone || "-"}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-sm text-blue-700">
          <strong>ℹ️ Thông tin:</strong> Các tính năng chỉnh sửa hồ sơ sẽ sớm được phát hành
        </p>
      </div>
    </div>
  );
}