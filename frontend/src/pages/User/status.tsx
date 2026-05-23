import React, { useMemo, useState } from "react";
import { useServiceRequests } from "../../context/ServiceRequestContext";
import { useUserContext } from "../../context/UserContext";

type Tab = "pending" | "solved";

const StatusPage: React.FC = () => {
  const { requests } = useServiceRequests();
  const { currentUser } = useUserContext();

  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const userRequests = useMemo(() => {
    if (!currentUser) return [];

    return requests.filter(
      (r) =>
        r.requestedBy ===
        `${currentUser.firstName} ${currentUser.lastName}`
    );
  }, [requests, currentUser]);

  const rows = useMemo(() => {
    return userRequests.filter((r) =>
      activeTab === "pending"
        ? r.status === "Pending" || r.status === "Assigned"
        : r.status === "Resolved"
    );
  }, [userRequests, activeTab]);

  return (
    <div className="px-2 sm:px-4 md:px-6 w-full">
      {/* TITLE */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
        Request History
      </h1>

      {/* TABS */}
      <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-10 text-gray-600 mb-4 text-sm sm:text-base md:text-lg border-b border-gray-300">
        <button
          className={
            activeTab === "pending"
              ? "font-bold text-primary-500 border-b-2 border-primary-500 pb-2 text-xs sm:text-sm md:text-base"
              : "hover:text-gray-700 pb-2 text-xs sm:text-sm md:text-base"
          }
          onClick={() => setActiveTab("pending")}
        >
          Pending Requests
        </button>

        <button
          className={
            activeTab === "solved"
              ? "font-bold text-primary-500 border-b-2 border-primary-500 pb-2 text-xs sm:text-sm md:text-base"
              : "hover:text-gray-700 pb-2 text-xs sm:text-sm md:text-base"
          }
          onClick={() => setActiveTab("solved")}
        >
          Solved Requests
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-300 rounded-xl overflow-x-auto">
        <div className="min-w-[650px]">
          {/* HEADER */}
          <div
            className={`grid ${
              activeTab === "pending"
                ? "grid-cols-5"
                : "grid-cols-7"
            } px-3 sm:px-5 py-3 text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 border-b bg-gray-50`}
          >
            <div className="truncate">Serial Number</div>

            <div className="truncate">Device Name</div>

            <div className="truncate">
              Problem Category
            </div>

            {activeTab === "pending" ? (
              <>
                <div className="truncate">
                  Requested Date
                </div>

                <div className="truncate">Status</div>
              </>
            ) : (
              <>
                <div className="truncate">
                  Requested Date
                </div>

                <div className="truncate">
                  Resolved Date
                </div>

                <div className="truncate">Solved By</div>

                <div className="truncate">Status</div>
              </>
            )}
          </div>

          {/* ROWS */}
          {rows.length === 0 ? (
            <p className="p-5 text-gray-500 text-xs sm:text-sm">
              No requests found
            </p>
          ) : (
            rows.map((r, idx) => (
              <div
                key={r.id}
                className={`grid ${
                  activeTab === "pending"
                    ? "grid-cols-5"
                    : "grid-cols-7"
                } px-3 sm:px-5 py-3 text-[10px] sm:text-xs md:text-sm items-center border-b ${
                  idx % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                } hover:bg-gray-100 transition`}
              >
                {/* SERIAL */}
                <div className="truncate">
                  {r.serialNumber || "-"}
                </div>

                {/* DEVICE */}
                <div className="truncate">
                  {r.deviceName || "-"}
                </div>

                {/* CATEGORY */}
                <div className="truncate">
                  {r.problemCategory}
                </div>

                {activeTab === "pending" ? (
                  <>
                    {/* REQUEST DATE */}
                    <div className="truncate">
                      {r.createdAt
                        ? new Date(
                            r.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </div>

                    {/* STATUS */}
                    <div>
                      <span className="px-2 sm:px-3 py-[2px] sm:py-1 text-[9px] sm:text-xs bg-amber-100 text-amber-700 rounded-full">
                        Pending
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* REQUEST DATE */}
                    <div className="truncate">
                      {r.createdAt
                        ? new Date(
                            r.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </div>

                    {/* RESOLVED DATE */}
                    <div className="truncate">
                      {r.resolvedDate
                        ? new Date(
                            r.resolvedDate
                          ).toLocaleDateString()
                        : "-"}
                    </div>

                    {/* SOLVED BY */}
                    <div className="truncate">
                      {r.assignedToName || "-"}
                    </div>

                    {/* STATUS */}
                    <div>
                      <span className="px-2 sm:px-3 py-[2px] sm:py-1 text-[9px] sm:text-xs bg-green-100 text-green-700 rounded-full">
                        Solved
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusPage;