// src/components/dashboardComponents/DeviceCard.tsx
import React, { JSX } from "react";
import * as Label from "@radix-ui/react-label";
import deviceImage from "../../assets/device 1.png";
import { Button } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { Status } from "../../data/mockdata";

type DeviceCardProps = {
  id: string;
  deviceType: string;
  serialNo: string;
  department: string;
  area: string;
  userName: string;
  problem?: string;
  status: Status;
  supervisorName?: string;
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
}) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  let buttons: JSX.Element[] = [];

  // --- ADMIN actions ---
  if (status === "Pending" && role === "admin") {
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
  }

  // --- SUPERVISOR actions ---
  else if (status === "Pending" && role === "supervisor") {
    buttons.push(
      <Button
        key="details"
        onClick={() => navigate(`details/${id}`)}
        className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
      >
        Details
      </Button>
    );
  } else if (status === "Assigned" && role === "supervisor") {
    buttons.push(
      <Button
        key="solve"
        onClick={() => navigate(`solve/${id}`)}
        className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
      >
        Solve
      </Button>
    );
  }

  // --- COMMON actions ---
  else if (status === "Resolved") {
    if (role === "admin" || role === "supervisor") {
      // Admin & Supervisor can view history
      buttons.push(
        <Button
          key="history"
          onClick={() => navigate(`history/${id}`)}
          className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
        >
          History
        </Button>
      );
    } else {
      // Normal users only get details view
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
  }

  // --- UNSOLVED actions ---
  else if (status === "Unresolved") {
    if (role === "admin" || role === "supervisor") {
      buttons.push(
        <Button
          key="unresolved"
          onClick={() => navigate(`unresolved/${id}`)}
          className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-6 py-1 rounded"
        >
          Details
        </Button>
      );
    } else {
      // Normal users just see details
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
  }

  const buttonContainerClass =
    buttons.length === 1 ? "flex justify-center mt-2" : "flex justify-between mt-2";

  return (
    <div className="w-[230px] bg-primary-900 rounded-xl shadow-md p-3 space-y-3 text-sm">
      <img src={deviceImage} alt="Device" className="w-full h-28 object-contain rounded" />

      <div className="space-y-2">
        <Field label="Device type" value={deviceType} />
        <Field label="Serial No" value={serialNo} />
        <Field label="Department" value={department} />
        <Field label="Area" value={area} />
        <Field label="User name" value={userName} />
        {supervisorName && <Field label="Supervisor" value={supervisorName} />}
        <Field label="Problem" value={problem || "—"} />
      </div>

      <div className={buttonContainerClass}>{buttons}</div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center">
    <Label.Root className="w-[35%] text-[11px] font-bold text-gray-700">{label}:</Label.Root>
    <input
      type="text"
      value={value}
      readOnly
      className="w-[65%] text-xs px-2 py-[3px] border border-gray-300 rounded bg-white text-gray-800"
    />
  </div>
);

export default DeviceCard;
