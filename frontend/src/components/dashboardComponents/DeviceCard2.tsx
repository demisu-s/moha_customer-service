import React from "react";
import * as Label from "@radix-ui/react-label";
import deviceImage from "../../assets/device 1.png";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";

type DeviceCard2Props = {
  id: string;
  deviceType: string;
  serialNo: string;
  department?: string;
  plant?: string;
  userName?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDetails?: (id: string) => void;
};

const DeviceCard2: React.FC<DeviceCard2Props> = ({
  id,
  deviceType,
  serialNo,
  department,
  plant,
  userName,
  onEdit,
  onDelete,
  onDetails,
}) => {
  return (
    <div className="w-full bg-primary-900 rounded-xl shadow-md p-3 space-y-3 text-sm hover:shadow-lg hover:scale-[1.02] transition">
      
      <img
        src={deviceImage}
        alt="Device"
        className="w-full h-28 object-contain rounded"
      />

      <div className="space-y-2">
        <Field label="Device type" value={deviceType} />
        <Field label="Serial No" value={serialNo} />
        <Field label="Department" value={department || "N/A"} />
        <Field label="Plant" value={plant || "N/A"} />
        <Field label="User name" value={userName || "Unassigned"} />
      </div>

      <div className="flex justify-between items-center mt-2">
        <Button
          onClick={() => onDetails?.(id)}
          className="bg-orange-700 hover:bg-orange-500 text-black text-xs font-semibold px-4 py-1 rounded"
        >
          Details
        </Button>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            className="px-2 text-gray-600 hover:text-primary-500"
            onClick={() => onEdit?.(id)}
          >
            <Pencil1Icon className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            className="px-2 text-gray-600 hover:text-red-600"
            onClick={() => onDelete?.(id)}
          >
            <TrashIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center">
    <Label.Root className="w-[40%] text-[11px] font-bold text-gray-700">
      {label}:
    </Label.Root>

    <span className="w-[60%] text-xs px-2 py-[3px] border border-gray-300 rounded bg-white text-gray-800">
      {value}
    </span>
  </div>
);

export default DeviceCard2;