import { Device } from "../../api/global.types";

import {
  EyeOpenIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";

interface Props {
  devices: Device[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDetails: (id: string) => void;
}

export default function DeviceTable({
  devices,
  onEdit,
  onDelete,
  onDetails,
}: Props) {
  return (
    <div className="overflow-x-auto border rounded-md">

      <table className="min-w-[900px] w-full text-sm">

        {/* HEADER */}

        <thead className="bg-gray-100 text-left font-bold text-base">

          <tr>

            <th className="px-3 py-2">No</th>

            <th className="px-3 py-2">Device Name</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Serial</th>
            <th className="px-3 py-2">Plant</th>
            <th className="px-3 py-2">Department</th>
            <th className="px-3 py-2">User</th>
            <th className="px-3 py-2 text-center">Action</th>

          </tr>

        </thead>

        {/* BODY */}

        <tbody className="text-sm">

          {devices.length > 0 ? (
            devices.map((device, index) => (
              <tr key={device._id} className="border-t">

                {/* SERIAL NUMBER */}

                <td className="px-3 py-2">
                  {index + 1}
                </td>

                <td className="px-3 py-2">
                  {device.deviceName}
                </td>

                <td className="px-3 py-2">
                  {device.deviceType}
                </td>

                <td className="px-3 py-2">
                  {device.serialNumber}
                </td>

                <td className="px-3 py-2">
                  {device.plant?.name}
                </td>

                <td className="px-3 py-2">
                  {device.department?.name}
                </td>

                <td className="px-3 py-2">
                  {device.user
                    ? `${device.user.firstName} ${device.user.lastName}`
                    : "Unassigned"}
                </td>

                {/* ACTION ICONS (UNCHANGED STYLE) */}

                <td className="px-3 py-2 flex gap-2 justify-center">

                  <button onClick={() => onDetails(device._id)}>
                    <EyeOpenIcon />
                  </button>

                  <button onClick={() => onEdit(device._id)}>
                    <Pencil1Icon />
                  </button>

                  <button onClick={() => onDelete(device._id)}>
                    <TrashIcon />
                  </button>

                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={8}
                className="text-center px-3 py-6 text-gray-500"
              >
                No devices found.
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}