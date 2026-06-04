import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingDetailsTableProps {
  data: Array<{
    id: string;
    stadium_name: string;
    booking_date: string;
    full_name: string;
    phone: string;
    payment_method: string;
    total_price: number;
    status: "confirmed" | "pending" | "completed" | "cancelled";
    payment_status: "paid" | "unpaid";
  }>;
}

const statusConfig = {
  confirmed: {
    label: "Xác nhận",
    color: "bg-blue-100 text-blue-800",
  },
  pending: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-800",
  },
  completed: {
    label: "Hoàn thành",
    color: "bg-green-100 text-green-800",
  },
  cancelled: {
    label: "Hủy",
    color: "bg-red-100 text-red-800",
  },
};

export function BookingDetailsTable({ data }: BookingDetailsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách đặt sân gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2">Sân</th>
                <th className="text-left py-2 px-2">Ngày đặt</th>
                <th className="text-left py-2 px-2">Khách hàng</th>
                <th className="text-left py-2 px-2">Số điện thoại</th>
                <th className="text-left py-2 px-2">Thanh toán</th>
                <th className="text-right py-2 px-2">Tổng tiền</th>
                <th className="text-center py-2 px-2">Trạng thái đặt</th>
                <th className="text-center py-2 px-2">Thanh toán</th>
              </tr>
            </thead>
            <tbody>
              {data.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-2 font-medium">{booking.stadium_name}</td>
                  <td className="py-3 px-2">{booking.booking_date}</td>
                  <td className="py-3 px-2">{booking.full_name}</td>
                  <td className="py-3 px-2">{booking.phone}</td>
                  <td className="py-3 px-2">{booking.payment_method}</td>
                  <td className="text-right py-3 px-2 font-semibold text-blue-600">
                    {booking.total_price.toLocaleString("vi-VN")} VND
                  </td>
                  <td className="text-center py-3 px-2">
                    <span
                      className={`py-1 px-2 rounded text-xs font-semibold ${
                        statusConfig[booking.status].color
                      }`}
                    >
                      {statusConfig[booking.status].label}
                    </span>
                  </td>
                  <td className="text-center py-3 px-2">
                    <span
                      className={`py-1 px-2 rounded text-xs font-semibold ${
                        booking.payment_status === "paid" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
