import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function WalletSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const status = params.get("status");
  const orderCode = params.get("orderCode");

  useEffect(() => {
    // tự động quay về ví sau 3s
    const t = setTimeout(() => {
      navigate("/traders");
    }, 3000);

    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {status === "PAID" ? (
        <>
          <h1 className="text-3xl font-bold text-green-600">
            ✅ Nạp tiền thành công
          </h1>
          <p className="mt-2">Mã giao dịch: {orderCode}</p>
          <p className="text-gray-500 mt-4">
            Đang quay về ví...
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-red-600">
            ❌ Thanh toán thất bại
          </h1>
        </>
      )}
    </div>
  );
}
