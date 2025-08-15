import React from "react";
import * as Label from "@radix-ui/react-label";
import deviceImage from "../../assets/device 1.png";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

type DeviceCard2Props = {
  id: string;
  deviceType: string;
  serialNo: string;
  department: string;
  area: string;
  userName: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const DeviceCard2: React.FC<DeviceCard2Props> = ({
  id,
  deviceType,
  serialNo,
  department,
  area,
  userName,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-[250px] bg-primary-900 rounded-xl shadow-md p-3 space-y-3 text-sm">
      <img
        src={deviceImage}
        alt="Device"
        className="w-full h-28 object-contain rounded"
      />

      <div className="space-y-2">
        <Field label="Device type" value={deviceType} />
        <Field label="Serial No" value={serialNo} />
        <Field label="Department" value={department} />
        <Field label="Area" value={area} />
        <Field label="User name" value={userName} />
      </div>

      <div className="flex justify-between mt-2">
        <Button
            onClick={() => navigate(`/dashboard/devices/detail/${id}`)}
            className="bg-orange-700 hover:bg-orange-500 hover:shadow-md hover:scale-105 text-black text-xs font-semibold px-6 py-1 rounded"
        >
            Details
        </Button>
        <div>
        <Button
          variant="ghost"
          className="px-3 text-gray-600 hover:bg-transparent hover:text-primary-500"
          onClick={() => (onEdit ? onEdit(id) : navigate(`/devices/edit/${id}`))}
        >
          <Pencil1Icon className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          className="p-0 text-gray-600 hover:bg-transparent hover:text-red-700"
          onClick={() => onDelete && onDelete(id)}
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
    <Label.Root className="w-[35%] text-[11px] font-bold text-gray-700">
      {label}:
    </Label.Root>
    <input
      type="text"
      value={value}
      readOnly
      className="w-[65%] text-xs px-2 py-[3px] border border-gray-300 rounded bg-white text-gray-800"
    />
  </div>
);
export default DeviceCard2;