import React, { useMemo } from "react";
import StatCard from "../../components/dashboardComponents/StatCard";
import { AiOutlineSchedule } from "react-icons/ai";
import { useServiceRequests } from "../../context/ServiceRequestContext";
import { useUserContext } from "../../context/UserContext";

const ClientOverview: React.FC = () => {
  const { requests } = useServiceRequests();
  const { currentUser } = useUserContext();

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
     📊 STATS (ALL REQUESTS)
  ========================== */
  const stats = useMemo(() => {
    return {
      total: userRequests.length,

      pending: userRequests.filter(
        (r) => r.status === "Pending" || r.status === "Assigned"
      ).length,

      solved: userRequests.filter(
        (r) => r.status === "Resolved"
      ).length,

      unresolved: userRequests.filter(
        (r) => r.status === "Unresolved"
      ).length,
    };
  }, [userRequests]);

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
    <div className="px-3 sm:px-4 md:px-6 space-y-5">
      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Overview
        </h1>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="Total Requests" value={stats.total} />
        <StatCard title="Pending Requests" value={stats.pending} />
        <StatCard title="Solved Requests" value={stats.solved} />
        <StatCard title="Unresolved Requests" value={stats.unresolved} />
      </div>

      {/* UPCOMING SCHEDULE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* SCHEDULE */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-300 p-3 md:p-5">
          <div className="flex items-center gap-2 mb-3">
            <AiOutlineSchedule className="text-xl md:text-2xl" />

            <h2 className="text-lg md:text-2xl font-bold">
              Upcoming Schedule
            </h2>
          </div>

          <ul className="space-y-3 text-xs md:text-sm text-gray-700">
            {upcomingSchedule.length === 0 ? (
              <p className="text-xs md:text-sm text-gray-500">
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
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 md:p-4 rounded-xl border border-gray-200 bg-gray-50 hover:shadow-md hover:scale-[1.01] transition-all duration-200"
                  >
                    {/* LEFT */}
                    <div className="space-y-1 break-words">
                      <div className="text-gray-900 font-semibold text-sm md:text-base">
                        {item.deviceType ||
                          item.deviceName ||
                          "Device"}
                      </div>

                      <div className="text-xs md:text-sm text-gray-600">
                        {item.serialNumber && (
                          <span>
                            SN: {item.serialNumber}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] md:text-xs text-gray-500 break-words">
                        {item.description}
                      </div>

                      <div className="text-[11px] md:text-xs text-purple-600 font-medium">
                        Problem Category:{" "}
                        <span className="text-gray-700 font-semibold">
                          {item.problemCategory ||
                            "Not specified"}
                        </span>
                      </div>

                      <div className="text-[11px] md:text-xs text-blue-600 font-medium break-words">
                        Assigned Supervisor:{" "}
                        <span className="text-gray-700 font-semibold">
                          {item.assignedToName ||
                            "Not assigned yet"}
                        </span>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col md:items-end gap-1">
                      <div
                        className={`px-2 py-[4px] rounded-full text-[10px] md:text-xs font-semibold w-fit ${statusColor}`}
                      >
                        {statusLabel}
                      </div>

                      <div className="text-[10px] md:text-xs text-gray-500">
                        Scheduled For
                      </div>

                      <div className="text-xs md:text-sm font-semibold text-gray-800">
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
        <div className="bg-primary-900 rounded-xl border border-gray-300 p-3 md:p-5">
          <h2 className="text-lg md:text-2xl font-bold mb-3 text-center">
            Tips & Suggestions
          </h2>

          <div className="border border-gray-300 rounded-xl bg-white p-3 md:p-5 text-sm md:text-base">
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Attach photos when reporting to speed up diagnosis.
              </li>

              <li>
                Tag impact level accurately for prioritization.
              </li>

              <li>
                Write problem clearly as much as you can.
              </li>

              <li>
                Include device name in every request.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;