import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", solved: 35, unsolved: 20 },
  { month: "Feb", solved: 45, unsolved: 25 },
  { month: "Mar", solved: 28, unsolved: 15 },
  { month: "Apr", solved: 55, unsolved: 30 },
  { month: "May", solved: 60, unsolved: 25 },
  { month: "Jun", solved: 18, unsolved: 12 },
  { month: "Jul", solved: 10, unsolved: 8 },
  { month: "Aug", solved: 75, unsolved: 40 },
  { month: "Sep", solved: 48, unsolved: 20 },
  { month: "Oct", solved: 65, unsolved: 35 },
  { month: "Nov", solved: 15, unsolved: 8 },
  { month: "Dec", solved: 30, unsolved: 15 },
];

const RequestsChart: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Yearly Request</h3>
        <select className="border rounded px-2 py-1 text-sm">
          <option>Last year</option>
          <option>This year</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="solved" fill="#95D4EB" name="Solved Requests" />
          <Bar dataKey="unsolved" fill="#f87171" name="Unsolved Requests" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RequestsChart;
