import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type BookingChart = {
  total_bookings: number;
  month: string;
};

type BookingChartProps = {
  data: BookingChart[];
};

type Props = {
  BookingByMonth:BookingChartProps
}

export function BookingChart({ BookingByMonth }: Props) {
  const formattedData = BookingByMonth.data.map((item) => ({
    month: item.month,
    bookings: item.total_bookings,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#F3F4F6] border border-gray-200 shadow-md rounded-lg p-3">
          <p className="text-xs text-[#8884d8] mb-1">Tháng {label}</p>

          <p className="font-semibold text-[#8884d8]">
            {payload[0].value} lượt đặt
          </p>
        </div>
      );
    }

    return null;
  };
  return (
    <Card className="border-gray-200/60 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-900">
          Lượt đặt theo tháng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              barSize={32}
            >
              {/* Lưới */}
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                dx={-10}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#F3F4F6" }}
              />
              <Bar
                dataKey="bookings"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              ></Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
