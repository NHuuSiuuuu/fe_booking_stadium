import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <Card className="border-gray-200/60 shadow-sm bg-white overflow-hidden relative transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        {Icon && (
          <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
            <Icon className="h-4 w-4 text-gray-700" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-gray-900 tracking-tight mt-1">{value}</div>
        <div className="flex items-center gap-2 mt-1.5">
          {trend && (
            <span
              className={`inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded-md ${
                trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              }`}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <span className="text-xs text-gray-500">{description}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
