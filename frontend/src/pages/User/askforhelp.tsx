import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { IoArrowBack } from "react-icons/io5";
import { useDeviceContext } from "../../context/DeviceContext";
import { useUserContext } from "../../context/UserContext";

type Urgency = "" | "Low" | "Medium" | "High";

type ServiceRequest = {
  id: string;
  deviceId: string;
  deviceSerial: string;
  requestedBy: string;
  description: string;
  urgency: Exclude<Urgency, "">;
  attachments: string[]; // just names for now
  createdAt: string;
  status: "Pending" | "In-Progress" | "Resolved";
};

const AskForHelp: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { devices } = useDeviceContext();
  const { users } = useUserContext();

  const device = useMemo(() => devices.find((d) => d.id === id), [devices, id]);
  const currentUserId = localStorage.getItem("userId");
  const currentUserName = useMemo(() => {
    const u = users.find((u) => u.userId === currentUserId);
    return u ? `${u.firstName} ${u.lastName}` : currentUserId || "User";
  }, [users, currentUserId]);

  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!device) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-red-600">
        <h2 className="text-xl font-semibold">Device not found</h2>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!description.trim()) {
      setError("Please describe the problem.");
      return;
    }
    if (!urgency) {
      setError("Please select an urgency level.");
      return;
    }

    const request: ServiceRequest = {
      id: `${Date.now()}`,
      deviceId: device.id,
      deviceSerial: device.serial,
      requestedBy: currentUserName || "User",
      description: description.trim(),
      urgency: urgency as Exclude<Urgency, "">,
      attachments: files.map((f) => f.name),
      createdAt: new Date().toISOString(),
      status: "Pending",
    };

    const key = "serviceRequests";
    const prevRaw = localStorage.getItem(key);
    const prev: ServiceRequest[] = prevRaw ? JSON.parse(prevRaw) : [];
    localStorage.setItem(key, JSON.stringify([request, ...prev]));

    setSuccess("Your request has been submitted successfully.");
    setDescription("");
    setUrgency("");
    setFiles([]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-black">Request Device Service</h1>
        <Button onClick={() => navigate(-1)} className="inline-flex items-center bg-primary-600 text-white px-4 py-1 font-semibold rounded-lg"><IoArrowBack className="mr-2"/>Back</Button>
      </div>

      <p className="text-gray-600 mb-3">
        Fill out the form below to request a repair or replacement of device/machine. Please provide as much detail as possible to help us process your request efficiently.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-xl p-6 space-y-5">
        <div>
          <label className="block font-semibold mb-4 text-2xl">Problem description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g. The screen flickers intermittently when moving the lid..."
            className="w-full min-h-[150px] border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block font-semibold text-2xl">Attachments</label>
          <p className="text-gray-500 text-sm mb-4">Attach relevant photos or video if available to illustrate the issue (Optional).</p>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {files.length > 0 && (
            <div className="mt-2 text-xs text-gray-600">{files.length} file(s) selected</div>
          )}
        </div>

        <div>
          <label className="block font-semibold text-2xl">Urgency level</label>
          <p className="text-gray-500 text-sm mb-4">Specify urgency level accurately based on operational impact.</p>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as Urgency)}
            className="w-60 border border-black rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
          >
            <option value="">Select urgency</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-700 text-sm">{success}</div>}

        <div className="pt-3">
          <button
            type="submit"
            className="px-8 py-1 w-full rounded-lg bg-primary-600 hover:bg-primary-900 text-white text-xl font-bold shadow"
          >
            Submit
          </button>
        </div>
      </form>

      <div className="mt-8 text-sm text-gray-500">
        Submitting for: <span className="font-semibold">{device.name}</span> ({device.serial}) • Requested by <span className="font-semibold">{currentUserName}</span>
      </div>
    </div>
  );
};

export default AskForHelp;


