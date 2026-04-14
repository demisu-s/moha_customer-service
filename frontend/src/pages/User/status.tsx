import React, { useMemo, useState } from "react";
import { useServiceRequests } from "../../context/ServiceRequestContext";
import { useUserContext } from "../../context/UserContext";

type Tab = "pending" | "solved";

const StatusPage: React.FC = () => {
  const { requests } = useServiceRequests();
  const { currentUser } = useUserContext();

  const [activeTab, setActiveTab] = useState<Tab>("pending");

  /* =========================
     👤 FILTER ONLY CURRENT USER
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
     📊 FILTER BY TAB
  ========================== */
  const rows = useMemo(() => {
    return userRequests.filter((r) =>
      activeTab === "pending"
        ? r.status === "Pending" || r.status === "Assigned"
        : r.status === "Resolved"
    );
  }, [userRequests, activeTab]);

  return (
    <div className="px-6 w-full">
      <h1 className="text-3xl font-bold mb-4">Request History</h1>

      {/* ========================= TABS ========================== */}
      <div className="flex gap-10 text-gray-600 mb-4 text-lg border-b border-gray-300">
        <button
          className={
            activeTab === "pending"
              ? "font-bold text-primary-500 border-b-2 border-primary-500 pb-2"
              : "hover:text-gray-700 pb-2"
          }
          onClick={() => setActiveTab("pending")}
        >
          Pending Requests
        </button>

        <button
          className={
            activeTab === "solved"
              ? "font-bold text-primary-500 border-b-2 border-primary-500 pb-2"
              : "hover:text-gray-700 pb-2"
          }
          onClick={() => setActiveTab("solved")}
        >
          Solved Requests
        </button>
      </div>

      {/* ========================= TABLE ========================== */}
      <div className="bg-white border border-gray-300 rounded-xl overflow-x-auto">
        
        {/* HEADER */}
        <div
          className={`grid ${
            activeTab === "pending"
              ? "grid-cols-5"
              : "grid-cols-6"
          } px-5 py-3 text-sm font-semibold text-gray-700 border-b bg-gray-50`}
        >
          {activeTab === "pending" ? (
            <>
              <div>Serial Number</div>
              <div>Device Name</div>
              <div>Problem Category</div>
              <div>Requested Date</div>
              <div>Status</div>
            </>
          ) : (
            <>
              <div>Serial Number</div>
              <div>Device Name</div>
              <div>Problem Category</div>
              <div>Requested Date</div>
              <div>Resolved Date</div>
              <div>Status</div>
            </>
          )}
        </div>

        {/* ROWS */}
        {rows.length === 0 ? (
          <p className="p-5 text-gray-500 text-sm">No requests found</p>
        ) : (
          rows.map((r, idx) => (
            <div
              key={r.id}
              className={`grid ${
                activeTab === "pending"
                  ? "grid-cols-5"
                  : "grid-cols-6"
              } px-5 py-3 text-sm items-center border-b ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {/* COMMON */}
              <div className="truncate">{r.serialNumber || "-"}</div>
              <div className="truncate">{r.deviceName || "-"}</div>
              <div className="truncate">{r.problemCategory}</div>

              {/* PENDING */}
              {activeTab === "pending" ? (
                <>
                  <div>
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
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
                  {/* REQUESTED DATE */}
                  <div>
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : "-"}
                  </div>

                  {/* RESOLVED DATE */}
                  <div>
                    {r.resolvedDate
                      ? new Date(r.resolvedDate).toLocaleDateString()
                      : "-"}
                  </div>

                  {/* STATUS */}
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
  );
};

export default StatusPage;