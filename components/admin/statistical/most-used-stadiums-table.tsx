import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Trophy } from "lucide-react";

type MostUsedStadiums = {
  name: string;
  total_revenue: number;
  total_bookings: number;
};

type MostUsedStadiumsProp = {
  data: MostUsedStadiums[];
};

type Props = {
  TopStadiums: MostUsedStadiumsProp;
};

interface MostUsedStadiumsTableProps {
  data: Array<{
    rank: number;
    name: string;
    bookings: number;
    revenue: number;
  }>;
}

export function MostUsedStadiumsTable({ TopStadiums }: Props) {
  return (
    <Card className="border-gray-200/60 shadow-sm bg-white overflow-hidden">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-base font-semibold text-gray-900">
            Sân được đặt nhiều nhất
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-white text-gray-500">
                <th className="text-center py-3 px-4 font-medium w-16">Rank</th>
                <th className="text-left py-3 px-4 font-medium">Tên sân</th>
                <th className="text-right py-3 px-4 font-medium">Lượt đặt</th>
                <th className="text-right py-3 px-4 font-medium">Doanh thu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TopStadiums.data.map((stadium, index) => (
                <tr
                  key={index}
                  className="bg-white hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        index + 1 === 1
                          ? "bg-amber-100 text-amber-700"
                          : index + 1 === 2
                            ? "bg-gray-200 text-gray-700"
                            : index + 1 === 3
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {stadium.name}
                    </span>
                  </td>
                  <td className="text-right py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {stadium.total_bookings}
                    </span>
                  </td>
                  <td className="text-right py-4 px-4">
                    <span className="font-medium text-gray-900">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(stadium.total_revenue)}
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
