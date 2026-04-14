import React, { useMemo, useState } from "react";
import StatCard from "../../components/dashboardComponents/StatCard";
import { AiOutlineSchedule } from "react-icons/ai";
import { useServiceRequests } from "../../context/ServiceRequestContext";
import { useUserContext } from "../../context/UserContext";

type Timeframe = "Daily" | "Weekly" | "Monthly" | "Yearly";

const ClientOverview: React.FC = () => {
  const { requests } = useServiceRequests();
  const { currentUser } = useUserContext();

  const [timeframe, setTimeframe] = useState<Timeframe>("Weekly");

  /* =========================
     👤 ONLY CURRENT USER REQUESTS
  ========================== */
  const userRequests = useMemo(() => {
    if (!currentUser) return [];

    return requests.filter(
      (r) =>
        r.requestedBy ===
        `${currentUser.firstName} ${currentUser.lastName}`
    );
  }, [requests, currentUser]);

  /* =========================
     ⏱ FILTER BY TIMEFRAME
  ========================== */
  const filteredRequests = useMemo(() => {
    const now = new Date();

    return userRequests.filter((r) => {
      const d = new Date(r.createdAt);

      const diffTime = now.getTime() - d.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      switch (timeframe) {
        case "Daily":
          return diffDays <= 1;
        case "Weekly":
          return diffDays <= 7;
        case "Monthly":
          return diffDays <= 30;
        case "Yearly":
          return diffDays <= 365;
        default:
          return true;
      }
    });
  }, [userRequests, timeframe]);

  /* =========================
     📊 STATS
  ========================== */
  const stats = useMemo(() => {
    return {
      total: filteredRequests.length,
      pending: filteredRequests.filter(
        (r) => r.status === "Pending" || r.status === "Assigned"
      ).length,
      solved: filteredRequests.filter(
        (r) => r.status === "Resolved"
      ).length,
      materials: filteredRequests.length,
    };
  }, [filteredRequests]);

  /* =========================
     📅 UPCOMING SCHEDULE
  ========================== */
  const upcomingSchedule = useMemo(() => {
    return userRequests
      .filter((r) => r.status === "Assigned")
      .map((r) => ({
        ...r,
        scheduleDate: r.assignedDate || r.createdAt,
      }))
      .filter((r) => r.scheduleDate)
      .sort(
        (a, b) =>
          new Date(a.scheduleDate).getTime() -
          new Date(b.scheduleDate).getTime()
      )
      .slice(0, 5);
  }, [userRequests]);

  return (
    <div className="px-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Overview</h1>

        <select
          value={timeframe}
          onChange={(e) =>
            setTimeframe(e.target.value as Timeframe)
          }
          className="border border-black rounded-md px-3 py-1 text-sm"
        >
          {(["Daily", "Weekly", "Monthly", "Yearly"] as Timeframe[]).map(
            (tf) => (
              <option key={tf} value={tf}>
                {tf}
              </option>
            )
          )}
        </select>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Requests" value={stats.total} />
        <StatCard title="Pending Requests" value={stats.pending} />
        <StatCard title="Solved Requests" value={stats.solved} />
        <StatCard title="Materials in stock" value={stats.materials} />
      </div>

      {/* UPCOMING SCHEDULE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-300 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AiOutlineSchedule className="text-2xl" />
            <h2 className="text-2xl font-bold">
              Upcoming Schedule
            </h2>
          </div>

          <ul className="space-y-3 text-sm text-gray-700">
            {upcomingSchedule.length === 0 ? (
              <p className="text-sm text-gray-500">
                No upcoming schedules
              </p>
            ) : (
              upcomingSchedule.map((item) => {
                const scheduleDate = item.scheduleDate
                  ? new Date(item.scheduleDate)
                  : null;

                const today = new Date();

                const isToday =
                  scheduleDate &&
                  scheduleDate.toDateString() ===
                    today.toDateString();

                const isPast =
                  scheduleDate &&
                  scheduleDate.getTime() < today.getTime();

                const statusLabel = isToday
                  ? "Today"
                  : isPast
                  ? "Overdue"
                  : "Upcoming";

                const statusColor = isToday
                  ? "bg-yellow-100 text-yellow-700"
                  : isPast
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700";

                return (
                  <li
                    key={item._id || item.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-xl border border-gray-200 bg-gray-50 hover:shadow-md hover:scale-[1.01] transition-all duration-200"
                  >
                    {/* LEFT */}
                    <div className="space-y-1">
                      <div className="text-gray-900 font-semibold text-base">
                        {item.deviceType || item.deviceName || "Device"}
                      </div>

                      <div className="text-sm text-gray-600">
                        {item.serialNumber && (
                          <span>
                            SN: {item.serialNumber}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-gray-500">
                        {item.description}
                      </div>

                      <div className="text-xs text-purple-600 font-medium">
                        Problem Category:{" "}
                        <span className="text-gray-700 font-semibold">
                          {item.problemCategory || "Not specified"}
                        </span>
                      </div>

                      <div className="text-xs text-blue-600 font-medium">
                        Assigned Supervisor:{" "}
                        <span className="text-gray-700 font-semibold">
                          {item.assignedToName ||
                            "Not assigned yet"}
                        </span>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="mt-3 md:mt-0 flex flex-col md:items-end gap-2">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                      >
                        {statusLabel}
                      </div>

                      <div className="text-xs text-gray-500">
                        Scheduled For
                      </div>

                      <div className="text-sm font-semibold text-gray-800">
                        {scheduleDate
                          ? scheduleDate.toLocaleDateString()
                          : "-"}
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* TIPS */}
        <div className="bg-primary-900 rounded-xl border border-gray-300 p-5">
          <h2 className="text-2xl font-bold mb-3 text-center">
            Tips & Suggestions
          </h2>

          <div className="border border-gray-300 rounded-xl bg-white p-5 text-lg">
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Attach photos when reporting to speed up diagnosis.
              </li>
              <li>
                Tag impact level accurately for prioritization.
              </li>
              <li>Write problem  clearly as much as you can.</li>
              <li>Include device name in every request.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;