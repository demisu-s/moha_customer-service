// src/pages/dashboard/Home.tsx
import React, { useState, useMemo } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import DeviceCard from "../../components/dashboardComponents/DeviceCard";
import { useServiceRequests } from "../../context/ServiceRequestContext";
import { useUserContext } from "../../context/UserContext";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "Pending" | "Assigned" | "Resolved" | "Unresolved"
  >("Pending");

  const [search, setSearch] = useState("");
  const [plantFilter, setPlantFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");

  const { requests } = useServiceRequests();
  const { currentUser, plants, departments } = useUserContext();

  /* =========================
     1️⃣ Wait for user restore
  ========================== */
  if (!currentUser) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const userRole = currentUser.role;
  const userId = currentUser._id;
  const userName = `${currentUser.firstName} ${currentUser.lastName}`;
  const userPlant =
    typeof currentUser.department?.plant === "string"
      ? currentUser.department.plant
      : currentUser.department?.plant?.name;

  /* =========================
     2️⃣ Role Protection
  ========================== */

  if (!["admin", "supervisor", "superadmin"].includes(userRole)) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        This dashboard is only available for Admin and Supervisor.
      </div>
    );
  }

  /* =========================
     3️⃣ Tabs
  ========================== */

  const availableTabs: (
    | "Pending"
    | "Assigned"
    | "Resolved"
    | "Unresolved"
  )[] = ["Pending", "Assigned", "Resolved", "Unresolved"];

  /* =========================
     4️⃣ Get unique plants and departments for filters
  ========================== */

  const uniquePlants = useMemo(() => {
    const plantSet = new Set<string>();
    requests.forEach((req) => {
      if (req.plant) {
        plantSet.add(req.plant);
      }
    });
    return Array.from(plantSet);
  }, [requests]);

  const uniqueDepartments = useMemo(() => {
    const deptSet = new Set<string>();
    requests.forEach((req) => {
      if (req.department) {
        deptSet.add(req.department);
      }
    });
    return Array.from(deptSet);
  }, [requests]);

  /* =========================
     5️⃣ Filtering Logic
  ========================== */

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesTab = request.status === activeTab;

      const searchText = search.toLowerCase();

      /* =========================
         FORMAT DATES FOR SEARCH
      ========================== */

      const formattedCreatedDate = request.createdAt
        ? new Date(request.createdAt)
            .toLocaleDateString("en-US")
            .toLowerCase()
        : "";

      const formattedAssignedDate = request.assignedDate
        ? new Date(request.assignedDate)
            .toLocaleDateString("en-US")
            .toLowerCase()
        : "";

      const formattedResolvedDate = request.resolvedDate
        ? new Date(request.resolvedDate)
            .toLocaleDateString("en-US")
            .toLowerCase()
        : "";

      /* =========================
         SEARCH MATCHING
      ========================== */

      const matchesSearch =
        request.serialNumber
          ?.toLowerCase()
          .includes(searchText) ||

        request.description
          ?.toLowerCase()
          .includes(searchText) ||

        request.requestedBy
          ?.toLowerCase()
          .includes(searchText) ||

        request.urgency
          ?.toLowerCase()
          .includes(searchText) ||

        request.plant
          ?.toLowerCase()
          .includes(searchText) ||

        request.department
          ?.toLowerCase()
          .includes(searchText) ||

        request.problemCategory
          ?.toLowerCase()
          .includes(searchText) ||

        request.issues
          ?.toLowerCase()
          .includes(searchText) ||

        request.assignedToName
          ?.toLowerCase()
          .includes(searchText) ||

        request.deviceType
          ?.toLowerCase()
          .includes(searchText) ||

        request.assignedTo
          ?.toLowerCase()
          .includes(searchText) ||

        // DATE SEARCH
        formattedCreatedDate.includes(searchText) ||

        formattedAssignedDate.includes(searchText) ||

        formattedResolvedDate.includes(searchText);

      /* =========================
         FILTERS
      ========================== */

      const matchesPlant = plantFilter
        ? request.plant === plantFilter
        : true;

      const matchesDepartment = departmentFilter
        ? request.department === departmentFilter
        : true;

      const matchesUrgency = urgencyFilter
        ? request.urgency === urgencyFilter
        : true;

      /* =========================
         SUPERADMIN
      ========================== */

      if (userRole === "superadmin") {
        return (
          matchesTab &&
          matchesSearch &&
          matchesPlant &&
          matchesDepartment &&
          matchesUrgency
        );
      }

      /* =========================
         ADMIN & SUPERVISOR
      ========================== */

      const samePlant = request.plant === userPlant;

      if (userRole === "admin" || userRole === "supervisor") {
        // Supervisor Assigned Tab
        if (userRole === "supervisor" && activeTab === "Assigned") {
          return (
            matchesTab &&
            matchesSearch &&
            samePlant &&
            request.assignedTo === userId &&
            matchesPlant &&
            matchesDepartment &&
            matchesUrgency
          );
        }

        return (
          matchesTab &&
          matchesSearch &&
          samePlant &&
          matchesPlant &&
          matchesDepartment &&
          matchesUrgency
        );
      }

      return false;
    });
  }, [
    requests,
    activeTab,
    search,
    plantFilter,
    departmentFilter,
    urgencyFilter,
    userRole,
    userId,
    userPlant,
  ]);

  /* =========================
     6️⃣ UI
  ========================== */

  return (
    <div className="px-4 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 pb-1">
            Welcome, {userName}!
          </h1>
          <p className="text-sm text-gray-400 max-w-xl">
            Select a category to view devices. You can search by serial number,
            username, department, or issues.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          {/* Search Input */}
          <div className="w-full sm:w-[200px]">
            <input
              type="text"
              placeholder="Search devices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          {/* Filter Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100 whitespace-nowrap">
                Filter
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white shadow-lg border rounded-md p-3 w-56 space-y-3 z-50">
                {/* Plant Filter */}
                {(userRole === "superadmin") && (
                  <div>
                    <label className="text-xs text-gray-500">Plant</label>
                    <select
                      className="w-full border mt-1 px-2 py-1 rounded text-sm"
                      value={plantFilter}
                      onChange={(e) => setPlantFilter(e.target.value)}
                    >
                      <option value="">All Plants</option>
                      {uniquePlants.map((plant) => (
                        <option key={plant} value={plant}>
                          {plant}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Department Filter */}
                <div>
                  <label className="text-xs text-gray-500">Department</label>
                  <select
                    className="w-full border mt-1 px-2 py-1 rounded text-sm"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {uniqueDepartments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Urgency Filter */}
                <div>
                  <label className="text-xs text-gray-500">Urgency</label>
                  <select
                    className="w-full border mt-1 px-2 py-1 rounded text-sm"
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value)}
                  >
                    <option value="">All Urgency</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {(plantFilter || departmentFilter || urgencyFilter) && (
                  <button
                    className="w-full text-xs text-primary-500 hover:underline mt-2"
                    onClick={() => {
                      setPlantFilter("");
                      setDepartmentFilter("");
                      setUrgencyFilter("");
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-16 border-b border-gray-200">
        {availableTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 pb-2 text-xl font-bold capitalize transition-all duration-200 ${
              activeTab === tab
                ? "text-primary-500"
                : "text-gray-600"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute left-0 bottom-0 w-full h-[3px] bg-primary-500 rounded-full transition-all duration-200" />
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filteredRequests.length === 0 ? (
        <p className="text-gray-500 italic">
          No devices found for this status.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRequests.map((request) => (
            <DeviceCard
              key={request.id}
              id={request.id}
              deviceType={request.deviceType || "Device"}
              serialNumber={request.serialNumber}
              department={request.department}
              plant={request.plant}
              userName={request.requestedBy}
              problemCategory={request.problemCategory}
              issues={request.issues}
              problem={request.description}
              status={request.status}
              assignedDate={request.assignedDate}
              createdAt={request.createdAt}
              resolvedDate={request.resolvedDate}
              deviceImage={request.deviceImage}
              supervisorName={
                request.assignedToName ||
                request.assignedTo ||
                ""
              }
              resolvedByName={request.resolvedByName}
              assignedTo={request.assignedTo}
              resolvedBy={request.resolvedBy}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;