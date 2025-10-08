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

type DeviceCardProps = {
  id: string;
  deviceType: string;
  serialNo: string;
  department: string;
  area: string;
  userName: string;
  problem?: string;
  status: RequestStatus;
  supervisorName?: string;
  problemCategory?: ProblemCategory;
  issues?: Issues;
  deviceImage?: string;
  description?: string;
};

const DeviceCard: React.FC<DeviceCardProps> = ({
  id,
  deviceType,
  serialNo,
  department,
  area,
  userName,
  problem,
  status,
  supervisorName,
  deviceImage,
  problemCategory,
  issues,
}) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // ✅ Build role-based buttons
  const renderButtons = () => {
    const buttons: JSX.Element[] = [];

    if (role === "admin") {
      if (status === "Pending") {
        buttons.push(
          <Button
            key="details"
            onClick={() => navigate(`details/${id}`)}
            className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
          >
            Details
          </Button>,
          <Button
            key="assign"
            onClick={() => navigate(`assign/${id}`)}
            className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
          >
            Assign
          </Button>
        );
      } else if (status === "Resolved" || status === "Unresolved") {
        buttons.push(
          <Button
            key="history"
            onClick={() => navigate(`history/${id}`)}
            className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
          >
            History
          </Button>
        );
      }
    }

    if (role === "supervisor") {
      if (status === "Pending") {
        buttons.push(
          <Button
            key="details"
            onClick={() => navigate(`details/${id}`)}
            className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
          >
            Details
          </Button>
        );
      } else if (status === "Assigned") {
        buttons.push(
          <Button
            key="solve"
            onClick={() => navigate(`solve/${id}`)}
            className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
          >
            Solve
          </Button>
        );
      } else if (status === "Resolved" || status === "Unresolved") {
        buttons.push(
          <Button
            key="history"
            onClick={() => navigate(`history/${id}`)}
            className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
          >
            History
          </Button>
        );
      }
    }

    if (role === "user" || !role) {
      buttons.push(
        <Button
          key="details"
          onClick={() => navigate(`details/${id}`)}
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
    buttons.length === 1 ? "flex justify-center mt-2" : "flex justify-between mt-2";

  return (
    <div className="w-[230px] bg-primary-900 rounded-xl shadow-md p-3 space-y-3 text-sm">
      <img
        src={deviceImage || defaultDeviceImage}
        alt="Device"
        className="w-full h-28 object-contain rounded"
      />

      <div className="space-y-2">
        <Field label="Device Type" value={deviceType} />
        <Field label="Serial No" value={serialNo} />
        <Field label="Department" value={department} />
        <Field label="Area" value={area} />
        <Field label="User" value={userName} />

        {problemCategory && <Field label="Problem Category" value={problemCategory} />}
        {issues && <Field label="Issue" value={issues} />}
        {supervisorName && <Field label="Supervisor" value={supervisorName} />}

        <Field label="Problem" value={problem || "—"} />
      </div>

      <div className={buttonContainerClass}>{buttons}</div>
    </div>
  );
};

// ✅ Small reusable field component
const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center">
    <Label.Root className="w-[45%] text-[11px] font-bold text-gray-700">{label}:</Label.Root>
    <input
      type="text"
      value={value}
      readOnly
      className="w-[55%] text-xs px-2 py-[3px] border border-gray-300 rounded bg-white text-gray-800"
    />
  </div>
);

export default DeviceCard;
