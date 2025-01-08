/* eslint-disable react/prop-types */
import { Line, LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { formatRupiah } from "@/utils/FormatRupiah";

export function Overview({ chartData }) {

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="flex flex-col bg-white shadow-sm rounded-md">
          <div className="border-b">
            <p className="label text-xs p-3">{`${label}`}</p>
          </div>
          <div className="desc">
            <p className="text-xs text-slate-500 p-3">
              Total Revenue: { formatRupiah(payload[0].payload.total, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
      );
    }
  
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="total"
          stroke="currentColor"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          className="stroke-primary"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
