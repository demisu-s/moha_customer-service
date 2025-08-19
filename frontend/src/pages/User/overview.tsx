import React, { useMemo, useState } from "react";
import StatCard from "../../components/dashboardComponents/StatCard";
import { AiOutlineSchedule } from "react-icons/ai";


type Timeframe = "Daily" | "Weekly" | "Monthly" | "Yearly";

type ScheduleItem = {
  id: string;
  title: string;
  date: string; // ISO
  deviceId: string;
};

const statsByTimeframe: Record<Timeframe, { total: number; pending: number; solved: number; materials: number }>
  = {
  Daily: { total: 4, pending: 2, solved: 2, materials: 3 },
  Weekly: { total: 29, pending: 7, solved: 22, materials: 3 },
  Monthly: { total: 113, pending: 18, solved: 95, materials: 5 },
  Yearly: { total: 312, pending: 41, solved: 271, materials: 7 },
};

const upcomingScheduleConst: ScheduleItem[] = [
  { id: "REQ7", title: "Printer Machine Replacement", date: "2025-06-23",  deviceId: "PR-9087" },
  { id: "RE21", title: "Desktop Quarterly Inspection", date: "2025-06-25", deviceId: "DT-1234" },
  { id: "REQ42", title: "Laptop Thermal Paste Maintenance", date: "2025-06-27", deviceId: "CN-980" },
  { id: "REQ42", title: "Laptop Thermal Paste Maintenance", date: "2025-06-27", deviceId: "CN-980" },
];

const ClientOverview: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>("Weekly");

  const stats = useMemo(() => statsByTimeframe[timeframe], [timeframe]);

  return (
    <div className="px-6 space-y-6">
      {/* Top row: title + timeframe selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Overview</h1>
        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as Timeframe)}
            className="border border-black rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1891C3]"
          >
            {(["Daily", "Weekly", "Monthly", "Yearly"] as Timeframe[]).map((tf) => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Requests" value={stats.total} bgColor="bg-primary-900" />
        <StatCard title="Pending Requests" value={stats.pending}  bgColor="bg-primary-900" />
        <StatCard title="Solved Requests" value={stats.solved} bgColor="bg-primary-900" />
        <StatCard title="Materials in stock" value={stats.materials} bgColor="bg-primary-900" />
      </div>

      {/* Quick insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-300 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AiOutlineSchedule className="text-2xl " />
            <h2 className="text-2xl font-bold">Upcoming Schedule</h2>
          </div>
          <ul className="divide-y text-lg font-light text-gray-700">
            {upcomingScheduleConst.map((item) => (
              <li key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-gray-900 font-medium pb-1">{item.id}: {item.title}</div>
                  <div className="text-sm text-gray-600">Device Name: {item.deviceId}</div>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" })}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Extra card: Suggestions / tips */}
        <div className="bg-primary-900 rounded-xl border border-gray-300 p-5">
          <h2 className="text-2xl font-bold mb-3 text-center">Tips & Suggestions</h2>
          <div className="border border-gray-300 rounded-xl bg-white p-5 text-lg">
          <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
            <li >Attach photos when reporting to speed up diagnosis.</li>
            <li>Tag the impact level accurately to prioritize correctly.</li>
            <li>Keep device serial handy; it helps us locate your asset instantly.</li>
            <li>Report issues with the device name and serial number.</li>
          </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;


