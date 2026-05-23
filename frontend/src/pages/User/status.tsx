import React, { useMemo, useState } from "react";
import { useServiceRequests } from "../../context/ServiceRequestContext";
import { useUserContext } from "../../context/UserContext";

type Tab = "pending" | "solved";

const StatusPage: React.FC = () => {
  const { requests } = useServiceRequests();
  const { currentUser } = useUserContext();

  const [activeTab, setActiveTab] =
    useState<Tab>("pending");

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
        ? r.status === "Pending" ||
          r.status === "Assigned"
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

      {/* MOBILE CARD VIEW */}
      <div className="block md:hidden space-y-3">
        {rows.length === 0 ? (
          <div className="bg-white border border-gray-300 rounded-xl p-4 text-center text-gray-500 text-xs">
            No requests found
          </div>
        ) : (
          rows.map((r, idx) => (
            <div
              key={r.id}
              className={`rounded-xl border border-gray-300 p-4 shadow-sm ${
                idx % 2 === 0
                  ? "bg-white"
                  : "bg-gray-50"
              }`}
            >
              <div className="space-y-2 text-xs">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold text-gray-500">
                    Serial:
                  </span>

                  <span className="text-right text-gray-800">
                    {r.serialNumber || "-"}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="font-semibold text-gray-500">
                    Device:
                  </span>

                  <span className="text-right text-gray-800">
                    {r.deviceName || "-"}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="font-semibold text-gray-500">
                    Category:
                  </span>

                  <span className="text-right text-gray-800">
                    {r.problemCategory}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="font-semibold text-gray-500">
                    Requested:
                  </span>

                  <span className="text-right text-gray-800">
                    {r.createdAt
                      ? new Date(
                          r.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </span>
                </div>

                {activeTab === "solved" && (
                  <>
                    <div className="flex justify-between gap-3">
                      <span className="font-semibold text-gray-500">
                        Resolved:
                      </span>

                      <span className="text-right text-gray-800">
                        {r.resolvedDate
                          ? new Date(
                              r.resolvedDate
                            ).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="font-semibold text-gray-500">
                        Solved By:
                      </span>

                      <span className="text-right text-gray-800">
                        {r.assignedToName || "-"}
                      </span>
                    </div>
                  </>
                )}

                <div className="pt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-semibold ${
                      activeTab === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {activeTab === "pending"
                      ? "Pending"
                      : "Solved"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white border border-gray-300 rounded-xl overflow-x-auto">
        <div className="min-w-[650px]">
          {/* HEADER */}
          <div
            className={`grid ${
              activeTab === "pending"
                ? "grid-cols-5"
                : "grid-cols-7"
            } px-5 py-3 text-sm font-semibold text-gray-700 border-b bg-gray-50`}
          >
            <div className="truncate">
              Serial Number
            </div>

            <div className="truncate">
              Device Name
            </div>

            <div className="truncate">
              Problem Category
            </div>

            {activeTab === "pending" ? (
              <>
                <div className="truncate">
                  Requested Date
                </div>

                <div className="truncate">
                  Status
                </div>
              </>
            ) : (
              <>
                <div className="truncate">
                  Requested Date
                </div>

                <div className="truncate">
                  Resolved Date
                </div>

                <div className="truncate">
                  Solved By
                </div>

                <div className="truncate">
                  Status
                </div>
              </>
            )}
          </div>

          {/* ROWS */}
          {rows.length === 0 ? (
            <p className="p-5 text-gray-500 text-sm">
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
                } px-5 py-3 text-sm items-center border-b ${
                  idx % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                } hover:bg-gray-100 transition`}
              >
                <div className="truncate">
                  {r.serialNumber || "-"}
                </div>

                <div className="truncate">
                  {r.deviceName || "-"}
                </div>

                <div className="truncate">
                  {r.problemCategory}
                </div>

                {activeTab === "pending" ? (
                  <>
                    <div className="truncate">
                      {r.createdAt
                        ? new Date(
                            r.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </div>

                    <div>
                      <span className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded-full">
                        Pending
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="truncate">
                      {r.createdAt
                        ? new Date(
                            r.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </div>

                    <div className="truncate">
                      {r.resolvedDate
                        ? new Date(
                            r.resolvedDate
                          ).toLocaleDateString()
                        : "-"}
                    </div>

                    <div className="truncate">
                      {r.assignedToName || "-"}
                    </div>

                    <div>
                      <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
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