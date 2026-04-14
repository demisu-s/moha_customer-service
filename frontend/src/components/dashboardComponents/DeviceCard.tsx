// src/components/dashboardComponents/DeviceCard.tsx
import React, { JSX } from "react";
import * as Label from "@radix-ui/react-label";
import { Button } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import defaultDeviceImage from "../../assets/device 1.png";
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
assignedDate?: string;
  problemCategory?: ProblemCategory;
  issues?: Issues;
  deviceImage?: string;
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
assignedDate,
  deviceImage,
  problemCategory,
  issues,
}) => {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const role = currentUser?.role;

  const baseRoute = getBaseRoute(role);

  const renderButtons = () => {
    const buttons: JSX.Element[] = [];

    /* =========================
       ✅ PENDING (ROLE BASED)
    ========================== */
    if (status === "Pending") {
      // ADMIN → Details + Assign + Solve
      if (role === "admin") {
        buttons.push(
          <Button
            key="details"
            onClick={() => navigate(`${baseRoute}/details/${id}`)}
          className="bg-orange-700 hover:bg-orange-500 text-black text-[10px] font-semibold px-4 py-[2px] rounded-md">
            Details
          </Button>,
          <Button
            key="assign"
            onClick={() => navigate(`${baseRoute}/assign/${id}`)}
            className="bg-orange-700 hover:bg-orange-500 text-black text-[10px] font-semibold px-4 py-[2px] rounded-md" >
            Assign
          </Button>,
          <Button
            key="solve"
            onClick={() => navigate(`${baseRoute}/solve/${id}`)}
         className="bg-orange-700 hover:bg-orange-500 text-black text-[10px] font-semibold px-4 py-[2px] rounded-md">
            Solve
          </Button>
        );
      }

      // SUPERADMIN → Details + Assign
      else if (role === "superadmin") {
        buttons.push(
          <Button
            key="details"
            onClick={() => navigate(`${baseRoute}/details/${id}`)}
            className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
          >
            Details
          </Button>,
          <Button
            key="assign"
            onClick={() => navigate(`${baseRoute}/assign/${id}`)}
            className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
          >
            Assign
          </Button>
        );
      }

      // SUPERVISOR → Details only
      else if (role === "supervisor") {
        buttons.push(
          <Button
            key="details"
            onClick={() => navigate(`${baseRoute}/details/${id}`)}
            className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
          >
            Details
          </Button>
        );
      }
    }

    /* =========================
       ✅ ADMIN & SUPERADMIN (OTHER STATES)
    ========================== */
    if (role === "admin" || role === "superadmin") {
      if (status === "Resolved" || status === "Unresolved") {
        buttons.push(
          <Button
            key="history"
            onClick={() => navigate(`${baseRoute}/history/${id}`)}
            className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
          >
            History
          </Button>
        );

        if (status === "Unresolved") {
          buttons.push(
            <Button
              key="reassign"
              onClick={() => navigate(`${baseRoute}/assign/${id}`)}
              className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
            >
              Reassign
            </Button>
          );
        }
      }
    }

    /* =========================
       ✅ SUPERVISOR (OTHER STATES)
    ========================== */
    if (role === "supervisor") {
      if (status === "Assigned") {
        buttons.push(
          <Button
            key="solve"
            onClick={() => navigate(`${baseRoute}/solve/${id}`)}
            className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
          >
            Solve
          </Button>
        );
      } else if (status === "Resolved" || status === "Unresolved") {
        buttons.push(
          <Button
            key="history"
            onClick={() => navigate(`${baseRoute}/history/${id}`)}
            className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
          >
            History
          </Button>
        );

        if (status === "Unresolved") {
          buttons.push(
            <Button
              key="resolve"
              onClick={() => navigate(`${baseRoute}/solve/${id}`)}
              className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
            >
              Resolve
            </Button>
          );
        }
      }
    }

    /* =========================
       ✅ USER (DEFAULT)
    ========================== */
    if (role === "user" || !role) {
      buttons.push(
        <Button
          key="details"
          onClick={() => navigate(`${baseRoute}/details/${id}`)}
          className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
        >
          Details
        </Button>
      );
    }

    return buttons;
  };

  const buttons = renderButtons();

  const buttonContainerClass =
    buttons.length === 1
      ? "flex justify-center mt-2"
      : "flex justify-between mt-2";

  return (
    <div className="w-[230px] bg-primary-900 rounded-xl shadow-md p-3 space-y-3 text-sm">
      <img
        src={deviceImage || defaultDeviceImage}
        alt="Device"
        className="w-full h-28 object-contain rounded"
      />

      <div className="space-y-2">
        <Field label="Device Type" value={deviceType} />
        <Field label="Serial No" value={serialNumber} />
        <Field label="Department" value={department} />
        <Field label="Plant" value={plant} />
        <Field label="User" value={userName} />

        {problemCategory && (
          <Field label="Problem Category" value={problemCategory} />
        )}
        {issues && <Field label="Issue" value={issues} />}
        

{supervisorName && (
  <div className="flex items-center">
    <Label.Root className="w-[45%] text-[11px] font-bold text-gray-700">
      {status === "Assigned" ? "Assigned To:" : "Solved By:"}
    </Label.Root>

    <div className="w-[55%] text-xs px-2 py-[3px] border border-gray-300 rounded bg-white text-gray-800">
      {supervisorName}{" "}
      <span className="text-[9px] text-gray-500">
        ({assignedDate ? "supervisor" : "admin"})
      </span>
    </div>
  </div>
)}

        <Field label="Problem" value={problem || "—"} />
      </div>

      <div className={buttonContainerClass}>{buttons}</div>
    </div>
  );
};

// ✅ Field Component
const Field: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex items-center">
    <Label.Root className="w-[45%] text-[11px] font-bold text-gray-700">
      {label}:
    </Label.Root>
    <input
      type="text"
      value={value}
      readOnly
      className="w-[55%] text-xs px-2 py-[3px] border border-gray-300 rounded bg-white text-gray-800"
    />
  </div>
);

export default DeviceCard;