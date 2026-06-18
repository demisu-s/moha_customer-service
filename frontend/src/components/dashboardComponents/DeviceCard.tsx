// src/components/dashboardComponents/DeviceCard.tsx
import React, { JSX, useState } from "react";
import * as Label from "@radix-ui/react-label";
import { Button } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import defaultDeviceImage from "../../assets/device 1.png";
import { EyeIcon, UserPlusIcon, CheckCircleIcon, ClockIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

import {
  RequestStatus,
  ProblemCategory,
  Issues,
} from "../../context/ServiceRequestContext";

import { useUserContext } from "../../context/UserContext";

import {
  ADMIN_DASHBOARD_ROUTE,
  DASHBOARD_ROUTE,
  SUPERVISOR_DASHBOARD_ROUTE,
} from "../../router/routeConstants";

// ✅ Helper to get base route by role
const getBaseRoute = (role?: string) => {
  switch (role) {
    case "superadmin":
      return DASHBOARD_ROUTE;

    case "admin":
      return ADMIN_DASHBOARD_ROUTE;

    case "supervisor":
      return SUPERVISOR_DASHBOARD_ROUTE;

    default:
      return "";
  }
};

// ✅ Global reusable date formatter
const formatDate = (date?: string) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US");
};

type DeviceCardProps = {
  id: string;
  deviceType: string;
  serialNumber: string;
  department: string;
  plant: string;
  userName: string;
  problem?: string;
  status: RequestStatus;

  supervisorName?: string;
  resolvedByName?: string; // ✅ Add this prop

  assignedDate?: string;
  resolvedDate?: string;
  createdAt?: string;

  problemCategory?: ProblemCategory;
  issues?: Issues;

  deviceImage?: string;
  
  // ✅ Add these props for better tracking
  assignedTo?: string;
  resolvedBy?: string;
};

const DeviceCard: React.FC<DeviceCardProps> = ({
  id,
  deviceType,
  serialNumber,
  department,
  plant,
  userName,
  problem,
  status,
  supervisorName,
  resolvedByName, // ✅ Add this
  assignedDate,
  resolvedDate,
  deviceImage,
  problemCategory,
  createdAt,
  issues,
  assignedTo, // ✅ Add this
  resolvedBy, // ✅ Add this
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { currentUser } = useUserContext();
  const role = currentUser?.role;
  const baseRoute = getBaseRoute(role);

  // Status color mapping
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Assigned: "bg-blue-100 text-blue-800 border-blue-300",
    Resolved: "bg-green-100 text-green-800 border-green-300",
    Unresolved: "bg-red-100 text-red-800 border-red-300",
  };

  const statusIcons = {
    Pending: <ClockIcon className="w-3 h-3" />,
    Assigned: <UserPlusIcon className="w-3 h-3" />,
    Resolved: <CheckCircleIcon className="w-3 h-3" />,
    Unresolved: <ArrowPathIcon className="w-3 h-3" />,
  };

  // ✅ Updated getSolverDisplay function to handle superadmin tracking
  const getSolverDisplay = () => {
    // For Resolved and Unresolved status, show who solved it
    if (status === "Resolved" || status === "Unresolved") {
      // ✅ First check if resolvedByName exists (from backend)
      if (resolvedByName) {
        // Determine the role based on who solved it
        // If there's an assignedTo, it was a supervisor who solved it
        // If no assignedTo, it was an admin/superadmin
        const role = assignedTo ? "supervisor" : "admin";
        return {
          label: "Solved By:",
          name: resolvedByName,
          role: role
        };
      }
      
      // ✅ Fallback to supervisorName if available (for backward compatibility)
      if (supervisorName) {
        const role = assignedDate ? "supervisor" : "admin";
        return {
          label: "Solved By:",
          name: supervisorName,
          role: role
        };
      }
      
      // ✅ Fallback to current user if they solved it
      if (currentUser && (status === "Resolved" || status === "Unresolved")) {
        const name = `${currentUser.firstName} ${currentUser.lastName}`;
        // Show superadmin as "admin" in the display
        const role = currentUser.role === "superadmin" ? "admin" : currentUser.role;
        return {
          label: "Solved By:",
          name: name,
          role: role
        };
      }
      
      return null;
    }
    
    // For Assigned status, show who it's assigned to
    if (status === "Assigned" && supervisorName) {
      return {
        label: "Assigned To:",
        name: supervisorName,
        role: assignedDate ? "supervisor" : "admin"
      };
    }
    
    return null;
  };

  const solverInfo = getSolverDisplay();

  const renderButtons = () => {
    const buttons: JSX.Element[] = [];

    /* =========================
       ✅ PENDING (ROLE BASED)
    ========================== */
    if (status === "Pending") {
      // ADMIN & SUPERADMIN → Details + Assign + Solve
      if (role === "admin" || role === "superadmin") {
        buttons.push(
          <motion.div
            key="details"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate(`${baseRoute}/details/${id}`)}
              className="bg-primary-400 hover:bg-primary-500 text-white text-[9px] font-semibold px-3 py-[2px] rounded-md transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-0.5"
            >
              <EyeIcon className="w-2.5 h-2.5" />
              Details
            </Button>
          </motion.div>,

          <motion.div
            key="assign"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate(`${baseRoute}/assign/${id}`)}
              className="bg-primary-400 hover:bg-primary-500 text-white text-[9px] font-semibold px-3 py-[2px] rounded-md transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-0.5"
            >
              <UserPlusIcon className="w-2.5 h-2.5" />
              Assign
            </Button>
          </motion.div>,

          <motion.div
            key="solve"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate(`${baseRoute}/solve/${id}`)}
              className="bg-primary-400 hover:bg-primary-500 text-white text-[9px] font-semibold px-3 py-[2px] rounded-md transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-0.5"
            >
              <CheckCircleIcon className="w-2.5 h-2.5" />
              Solve
            </Button>
          </motion.div>
        );
      }

      // SUPERVISOR → Details only
      else if (role === "supervisor") {
        buttons.push(
          <motion.div
            key="details"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate(`${baseRoute}/details/${id}`)}
              className="bg-primary-400 hover:bg-primary-500 text-white text-[9px] font-semibold px-3 py-[2px] rounded-md transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-0.5"
            >
              <EyeIcon className="w-2.5 h-2.5" />
              Details
            </Button>
          </motion.div>
        );
      }
    }

    /* =========================
       ✅ RESOLVED / UNRESOLVED (ADMIN & SUPERADMIN)
    ========================== */
    if (role === "admin" || role === "superadmin") {
      if (status === "Resolved" || status === "Unresolved") {
        buttons.push(
          <motion.div
            key="history"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate(`${baseRoute}/history/${id}`)}
              className="bg-primary-400 hover:bg-primary-500 text-white text-[9px] font-semibold px-3 py-[2px] rounded-md transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-0.5"
            >
              <ClockIcon className="w-2.5 h-2.5" />
              History
            </Button>
          </motion.div>
        );

        if (status === "Unresolved") {
          buttons.push(
            <motion.div
              key="reassign"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate(`${baseRoute}/assign/${id}`)}
                className="bg-primary-400 hover:bg-primary-500 text-white text-[9px] font-semibold px-3 py-[2px] rounded-md transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-0.5"
              >
                <ArrowPathIcon className="w-2.5 h-2.5" />
                Reassign
              </Button>
            </motion.div>
          );

          buttons.push(
            <motion.div
              key="solve"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate(`${baseRoute}/solve/${id}`)}
                className="bg-primary-400 hover:bg-primary-500 text-white text-[9px] font-semibold px-3 py-[2px] rounded-md transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-0.5"
              >
                <CheckCircleIcon className="w-2.5 h-2.5" />
                Solve
              </Button>
            </motion.div>
          );
        }
      }
    }

    /* =========================
       ✅ SUPERVISOR
    ========================== */
    if (role === "supervisor") {
      if (status === "Assigned") {
        buttons.push(
          <motion.div
            key="solve"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate(`${baseRoute}/solve/${id}`)}
              className="bg-primary-400 hover:bg-primary-500 text-white text-[9px] font-semibold px-3 py-[2px] rounded-md transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-0.5"
            >
              <CheckCircleIcon className="w-2.5 h-2.5" />
              Solve
            </Button>
          </motion.div>
        );
      } else if (
        status === "Resolved" ||
        status === "Unresolved"
      ) {
        buttons.push(
          <motion.div
            key="history"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate(`${baseRoute}/history/${id}`)}
              className="bg-primary-400 hover:bg-primary-500 text-white text-[9px] font-semibold px-3 py-[2px] rounded-md transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-0.5"
            >
              <ClockIcon className="w-2.5 h-2.5" />
              History
            </Button>
          </motion.div>
        );

        if (status === "Unresolved") {
          buttons.push(
            <motion.div
              key="resolve"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate(`${baseRoute}/solve/${id}`)}
                className="bg-primary-400 hover:bg-primary-500 text-white text-[9px] font-semibold px-3 py-[2px] rounded-md transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-0.5"
              >
                <CheckCircleIcon className="w-2.5 h-2.5" />
                Resolve
              </Button>
            </motion.div>
          );
        }
      }
    }

    /* =========================
       ✅ USER DEFAULT
    ========================== */
    if (role === "user" || !role) {
      buttons.push(
        <motion.div
          key="details"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => navigate(`${baseRoute}/details/${id}`)}
            className="bg-primary-400 hover:bg-primary-500 text-white text-[9px] font-semibold px-3 py-[2px] rounded-md transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-0.5"
          >
            <EyeIcon className="w-2.5 h-2.5" />
            Details
          </Button>
        </motion.div>
      );
    }

    return buttons;
  };

  const buttons = renderButtons();

  const buttonContainerClass =
    buttons.length === 1
      ? "flex justify-center mt-2"
      : "flex justify-between mt-2 gap-0.5";

  return (
    <motion.div
      className="w-[230px] bg-white rounded-xl shadow-xl p-3 space-y-3 text-sm border border-gray-100"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        y: -4,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        transition: { duration: 0.2 }
      }}
    >
      {/* Status Badge */}
      <div className="flex justify-between items-start">
        <div className={`px-2 py-1 rounded-full text-[10px] font-semibold border ${statusColors[status]} flex items-center gap-1`}>
          {statusIcons[status]}
          {status}
        </div>
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0 }}
          className="text-gray-400 text-[10px]"
        >
          {id.slice(0, 6)}
        </motion.div>
      </div>

      <motion.div
        className="relative overflow-hidden rounded"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <img
          src={deviceImage || defaultDeviceImage}
          alt="Device"
          className={`w-full h-28 object-contain rounded transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
        />
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
        )}
      </motion.div>

      <div className="space-y-2">
        <Field label="Device Type" value={deviceType} />
        <Field label="Serial No" value={serialNumber} />
        <Field label="Department" value={department} />
        <Field label="Plant" value={plant} />
        <Field label="User" value={userName} />

        <Field
          label="Requested On"
          value={formatDate(createdAt)}
        />

        {status !== "Pending" && assignedDate && (
          <Field
            label="Assigned On"
            value={formatDate(assignedDate)}
          />
        )}

        {(status === "Resolved" || status === "Unresolved") && resolvedDate && (
          <Field
            label="Resolved On"
            value={formatDate(resolvedDate)}
          />
        )}

        {problemCategory && (
          <Field label="Problem Category" value={problemCategory} />
        )}

        {issues && (
          <Field label="Issue" value={issues} />
        )}

        {/* ✅ Show Solver Info - Updated to show superadmin properly */}
        {solverInfo && (
          <motion.div
            className="flex items-center"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            <Label.Root className="w-[45%] text-[11px] font-bold text-gray-700">
              {solverInfo.label}
            </Label.Root>

            <div className="w-[55%] text-xs px-2 py-[3px] border border-gray-300 rounded bg-blue-50 text-gray-800">
              {solverInfo.name}{" "}
              <span className="text-[9px] text-gray-500">
                ({solverInfo.role})
              </span>
            </div>
          </motion.div>
        )}

        <Field label="Problem" value={problem || "—"} />
      </div>

      <div className={buttonContainerClass}>
        {buttons}
      </div>
    </motion.div>
  );
};

// ✅ Field Component with enhanced interactivity
const Field: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => (
  <motion.div
    className="flex items-center"
    whileHover={{ x: 2 }}
    transition={{ duration: 0.2 }}
  >
    <Label.Root className="w-[45%] text-[11px] font-bold text-gray-700">
      {label}:
    </Label.Root>

    <input
      type="text"
      value={value}
      readOnly
      className="w-[55%] text-xs px-2 py-[3px] border border-gray-200 rounded bg-gray-50 text-gray-800 transition-colors duration-200 hover:border-primary-400 focus:outline-none"
    />
  </motion.div>
);

export default DeviceCard;