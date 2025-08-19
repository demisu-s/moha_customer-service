import React, { useMemo, useState } from "react";

type RequestRow = {
  deviceId: string;
  deviceName: string;
  problem: string;
  date: string; // ISO or YYYY-MM-DD
  status: "Pending" | "Solved";
};

const pendingRequestsConst: RequestRow[] = [
  { deviceId: "CN-980", deviceName: "Dell laptop", problem: " Screen flicker Screen flicker Screen flicker Screen flicker", date: "2025-09-09", status: "Pending" },
  { deviceId: "GH-9087", deviceName: "Printer", problem: "Paper jam Paper jam Paper jam Paper jam", date: "2025-09-09", status: "Pending" },
  { deviceId: "NM-789", deviceName: "Desktop", problem: "Won't boot Won't boot Won't boot Won't boot", date: "2025-09-09", status: "Pending" },
  { deviceId: "NM_5657", deviceName: "Printer", problem: "Ink low Ink low Ink low Ink low", date: "2025-09-09", status: "Pending" },
];

const solvedRequestsConst: RequestRow[] = [
  { deviceId: "CN-980", deviceName: "Dell laptop", problem: "Problem Problem Problem Problem Problem", date: "2025-09-09", status: "Solved" },
  { deviceId: "GH-9087", deviceName: "Printer", problem: "Problem Problem Problem Problem Problem", date: "2025-09-09", status: "Solved" },
  { deviceId: "NM-789", deviceName: "Desktop", problem: "Problem Problem Problem Problem Problem", date: "2025-09-09", status: "Solved" },
  { deviceId: "NM_5657", deviceName: "Printer", problem: "Problem Problem Problem Problem Problem", date: "2025-09-09", status: "Solved" },
];

const StatusPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "solved">("pending");

  // Using const data for now, you can replace with API/localStorage later
  const rows = useMemo<RequestRow[]>(() => {
    return activeTab === "pending" ? pendingRequestsConst : solvedRequestsConst;
  }, [activeTab]);

  return (
    <div className="px-6">
      <h1 className="text-3xl font-bold mb-4">Request History</h1>

      <div className="flex gap-16 text-gray-600 mb-4 text-xl border-b border-gray-300 ">
        <button
          className={
            activeTab === "pending"
              ? "font-bold text-primary-500 border-b-2 border-primary-500 pb-1"
              : "hover:text-gray-700 pb-1"
          }
          onClick={() => setActiveTab("pending")}
        >
          Pending Requests
        </button>
        <button
          className={
            activeTab === "solved"
              ? "font-bold text-primary-500 border-b-2 border-primary-500 pb-1"
              : "hover:text-gray-700 pb-1"
          }
          onClick={() => setActiveTab("solved")}
        >
          Solved Requests
        </button>
      </div>

      <div className="bg-white border border-gray-300 rounded-xl overflow-hidden mt-6">
        <div className="grid grid-cols-12 px-5 py-3 text-xl font-semibold text-black border-b border-gray-300">
          <div className="col-span-2">Device ID</div>
          <div className="col-span-2">Device Name</div>
          <div className="col-span-5 ">Problem</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Status</div>
        </div>

        {rows.map((r, idx) => (
          <div
            key={`${r.deviceId}-${idx}`}
            className={`grid grid-cols-12 px-5 py-3 border text-lg text-gray-700 font-light items-center ${
              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <div className="col-span-2">{r.deviceId}</div>
            <div className="col-span-2">{r.deviceName}</div>
            <div className="col-span-5">{r.problem}</div>
            <div className="col-span-2">{r.date}</div>
            <div className="col-span-1">
              {r.status === "Solved" ? (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  Solved
                </span>
              ) : (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                  Pending
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusPage;


