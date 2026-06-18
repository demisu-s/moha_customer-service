// src/pages/Overview.tsx
import React, { useMemo, useState } from "react";
import StatCard from "../../../components/dashboardComponents/StatCard";
import RequestsChart from "../../../components/dashboardComponents/RequestsChart";
import SupervisorCard from "../../../components/dashboardComponents/SupervisorCard";
import { useServiceRequests } from "../../../context/ServiceRequestContext";
import { useUserContext } from "../../../context/UserContext";
import { usePlantContext } from "../../../context/PlantContext";
import { FiFilter } from "react-icons/fi";
import { 
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon 
} from "@heroicons/react/24/outline";

const Overview: React.FC = () => {
  const { requests } = useServiceRequests();
  const { users, currentUser } = useUserContext();
  const { plants } = usePlantContext();

  // ✅ Single filter for all sections
  const [selectedPlant, setSelectedPlant] = useState("All");

  const userRole = currentUser?.role;

  // ✅ Get user's plant
  const getUserPlant = () => {
    if (!currentUser) return null;
    
    const dept = currentUser.department;
    if (!dept) return null;
    
    if (typeof dept === "object" && dept !== null) {
      const plantField = (dept as any).plant;
      if (!plantField) return null;
      
      if (typeof plantField === "string") {
        const foundPlant = plants.find(p => p._id === plantField);
        return foundPlant?.name || null;
      }
      if (typeof plantField === "object" && plantField !== null) {
        return (plantField as any).name || null;
      }
    }
    
    return null;
  };

  const userPlant = getUserPlant();

  /* =========================
     📊 STATS (FILTERED BY PLANT)
  ========================== */
  const stats = useMemo(() => {
    let assigned = 0;
    let pending = 0;
    let resolved = 0;
    let unresolved = 0;

    let filteredRequests = requests;

    if (userRole === "superadmin" && selectedPlant !== "All") {
      filteredRequests = requests.filter((req) => {
        return req.plant === selectedPlant;
      });
    }
    else if ((userRole === "admin" || userRole === "supervisor") && userPlant) {
      filteredRequests = requests.filter((req) => {
        return req.plant === userPlant;
      });
    }

    filteredRequests.forEach((req) => {
      if (req.status === "Assigned") assigned++;
      else if (req.status === "Pending") pending++;
      else if (req.status === "Resolved") resolved++;
      else if (req.status === "Unresolved") unresolved++;
    });

    return {
      assigned,
      pending,
      resolved,
      unresolved,
      totalTasks: filteredRequests.length,
    };
  }, [requests, userRole, userPlant, selectedPlant]);

  /* =========================
     👨‍🔧 SUPERVISORS (FILTERED BY PLANT)
  ========================== */
  const supervisorsData = useMemo(() => {
    const grouped: Record<
      string,
      {
        name: string;
        plant: string;
        workload: number;
        totalSolved: number;
        avatarUrl?: string;
      }
    > = {};

    const supervisors = users.filter((u) => u.role === "supervisor" || u.role === "admin" || u.role ==="superadmin");
    let filteredSupervisors = supervisors;

    if (userRole === "superadmin" && selectedPlant !== "All") {
      filteredSupervisors = supervisors.filter((sup) => {
        const dept = sup.department;
        if (!dept) return false;
        
        if (typeof dept === "object" && dept !== null) {
          const plantField = (dept as any).plant;
          if (!plantField) return false;
          
          if (typeof plantField === "string") {
            const foundPlant = plants.find(p => p._id === plantField);
            return foundPlant?.name === selectedPlant;
          }
          if (typeof plantField === "object" && plantField !== null) {
            return (plantField as any).name === selectedPlant;
          }
        }
        return false;
      });
    }
    else if ((userRole === "admin" || userRole === "supervisor") && userPlant) {
      filteredSupervisors = supervisors.filter((sup) => {
        const dept = sup.department;
        if (!dept) return false;
        
        if (typeof dept === "object" && dept !== null) {
          const plantField = (dept as any).plant;
          if (!plantField) return false;
          
          if (typeof plantField === "string") {
            const foundPlant = plants.find(p => p._id === plantField);
            return foundPlant?.name === userPlant;
          }
          if (typeof plantField === "object" && plantField !== null) {
            return (plantField as any).name === userPlant;
          }
        }
        return false;
      });
    }

    filteredSupervisors.forEach((supervisor) => {
      const name = `${supervisor.firstName} ${supervisor.lastName}`;
      
      let plantName = "Unknown";
      const dept = supervisor.department;
      if (dept && typeof dept === "object") {
        const plantField = (dept as any).plant;
        if (plantField) {
          if (typeof plantField === "string") {
            const foundPlant = plants.find(p => p._id === plantField);
            plantName = foundPlant?.name || "Unknown";
          } else if (typeof plantField === "object" && plantField !== null) {
            plantName = (plantField as any).name || "Unknown";
          }
        }
      }

      let workload = 0;
      let totalSolved = 0;

      const supervisorRequests = requests.filter((req) => {
        if (req.assignedTo !== supervisor._id) return false;

        if (userRole === "superadmin" && selectedPlant !== "All") {
          return req.plant === selectedPlant;
        }

        if ((userRole === "admin" || userRole === "supervisor") && userPlant) {
          return req.plant === userPlant;
        }

        return true;
      });

      supervisorRequests.forEach((req) => {
        if (req.status === "Assigned" || req.status === "Pending") {
          workload++;
        }
        if (req.status === "Resolved") {
          totalSolved++;
        }
      });

      grouped[supervisor._id] = {
        name,
        plant: plantName,
        workload,
        totalSolved,
        avatarUrl: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${filteredSupervisors.indexOf(supervisor) + 1}`,
      };
    });

    return Object.values(grouped);
  }, [users, requests, userRole, userPlant, selectedPlant, plants]);

  /* =========================
     🌍 PLANT FILTER OPTIONS
  ========================== */
  const plantOptions = useMemo(() => {
    const set = new Set<string>();

    if (userRole === "superadmin") {
      requests.forEach((req) => {
        if (req.plant) set.add(req.plant);
      });
      
      plants.forEach((plant) => {
        if (plant.name) set.add(plant.name);
      });
      
      return ["All", ...Array.from(set)];
    }

    if (userPlant) {
      return [userPlant];
    }

    return ["All"];
  }, [plants, userRole, userPlant, requests]);

  return (
    <div className="px-6 space-y-6 pb-6">
      {/* Header with Filter */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Total Task Overview</h1>
        
        {userRole === "superadmin" && plantOptions.length > 1 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <FiFilter className="w-4 h-4" />
              <span>Filter:</span>
            </div>
            <select
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white shadow-sm hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-colors duration-200 min-w-[140px]"
            >
              {plantOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* =========================
          📊 STAT CARDS WITH ENHANCED INTERACTIVITY
      ========================== */}
      <div className="rounded-xl p-5 border border-gray-100 bg-white shadow-lg">
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-800">
            Statistics Overview
          </h3>
          <p className="text-xs text-gray-500">
            {userRole === "superadmin" 
              ? selectedPlant === "All"
                ? "Showing statistics for all plants"
                : `Showing statistics for ${selectedPlant} plant`
              : `Showing statistics for ${userPlant || "your"} plant`}
          </p>
        </div>

        {/* STAT CARDS with different colors and icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard 
            title="Total Tasks" 
            value={stats.totalTasks} 
            color="blue"
            icon={<ClipboardDocumentListIcon className="w-5 h-5" />}
            delay={0}
          />
          <StatCard 
            title="Assigned Tasks" 
            value={stats.assigned} 
            color="orange"
            icon={<UserGroupIcon className="w-5 h-5" />}
            delay={1}
          />
          <StatCard 
            title="Pending Tasks" 
            value={stats.pending} 
            color="red"
            icon={<ClockIcon className="w-5 h-5" />}
            delay={2}
          />
          <StatCard 
            title="Resolved Tasks" 
            value={stats.resolved} 
            color="green"
            icon={<CheckCircleIcon className="w-5 h-5" />}
            delay={3}
          />
          <StatCard 
            title="Unresolved Tasks" 
            value={stats.unresolved} 
            color="purple"
            icon={<XCircleIcon className="w-5 h-5" />}
            delay={4}
          />
        </div>
      </div>

      {/* =========================
          📈 CHART
      ========================== */}
      <RequestsChart 
        requests={requests} 
        userRole={userRole}
        userPlant={userPlant}
        plants={plants}
        selectedPlant={selectedPlant}
      />

      {/* =========================
          👨‍🔧 SUPERVISORS SECTION
      ========================== */}
      <div className="rounded-xl p-5 border border-gray-100 bg-white shadow-lg">
        <div className="mb-5">
          <h3 className="font-semibold text-2xl text-gray-800 mb-1">
            Technician Overview
          </h3>
          <p className="text-sm text-gray-500">
            {userRole === "superadmin"
              ? selectedPlant === "All"
                ? "Viewing all technicians across all plants"
                : `Viewing technicians for ${selectedPlant} plant`
              : `Showing technicians for ${userPlant || "your"} plant`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {supervisorsData.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-400 text-sm">
                {userRole === "superadmin" && selectedPlant !== "All"
                  ? `No technicians found for ${selectedPlant} plant`
                  : "No technicians found"}
              </p>
            </div>
          ) : (
            supervisorsData.map((sup, idx) => (
              <SupervisorCard key={idx} {...sup} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;