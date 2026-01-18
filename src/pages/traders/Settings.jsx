export default function TradersSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">⚙️ Cài đặt</h1>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-semibold text-gray-800">🔔 Thông báo</p>
            <p className="text-sm text-gray-600">Nhận thông báo về đơn hàng mới</p>
          </div>
          <input type="checkbox" className="w-5 h-5" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-semibold text-gray-800">📧 Email hàng ngày</p>
            <p className="text-sm text-gray-600">Nhận báo cáo tóm tắt hàng ngày</p>
          </div>
          <input type="checkbox" className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}