import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";

export function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoading } = useContext(AuthContext);

  // Đang load user từ localStorage - chờ một chút
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">❌ Truy cập bị từ chối</h1>
          <p className="text-gray-700 text-lg mb-6">
            Bạn không có quyền truy cập trang này. Yêu cầu quyền: <span className="font-bold">{requiredRole}</span>
          </p>
          <p className="text-gray-600 mb-8">Vai trò hiện tại của bạn: <span className="font-bold">{user.role || "Không xác định"}</span></p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white font-bold px-8 py-3 rounded-lg hover:scale-105 transition"
          >
            Quay về trang chủ
          </a>
        </div>
      </div>
    );
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};
