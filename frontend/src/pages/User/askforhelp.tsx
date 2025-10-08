import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { IoArrowBack } from "react-icons/io5";
import { useDeviceContext } from "../../context/DeviceContext";
import { useUserContext } from "../../context/UserContext";
import { useServiceRequests, ServiceRequest } from "../../context/ServiceRequestContext";
import { SuccessDialog } from "../../components/ui/SuccessDialog";

const AskForHelp: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { devices } = useDeviceContext();
  const { users } = useUserContext();
  const { addRequest } = useServiceRequests();

  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [ProblemCategory, setProblemCategory] = useState<
    "Hardware" | "Software" | "Network" | "Other"
  >("Hardware");
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Get current device & user
  const device = useMemo(() => devices.find((d) => d.id === id), [devices, id]);
  const currentUserId = localStorage.getItem("userId");

  const currentUserName = useMemo(() => {
    const u = users.find((u) => u.userId === currentUserId);
    return u ? `${u.firstName} ${u.lastName}` : currentUserId || "User";
  }, [users, currentUserId]);

  if (!device) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-red-600">
        <h2 className="text-xl font-semibold">Device not found</h2>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  // handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  // handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError("Please describe the problem.");
      return;
    }

    const now = new Date().toISOString();

    const request: ServiceRequest = {
      id: `${Date.now()}`,
      deviceId: device.id,
      deviceSerial: device.serial,
      requestedBy: currentUserName,
      requestedDate: now, // ✅ current date/time automatically
      area: device.area,
      description: description.trim(),
      department: device.department,
      userId: currentUserId || "",
      phone: users.find((u) => u.userId === currentUserId)?.phone || "",
      attachments: files.map((f) => f.name),
      createdAt: now,
      deviceImage: device.image || "",
      deviceName: device.name || "",
      deviceType: device.type || "",
      status: "Pending",
      problemCategory: ProblemCategory,
    };

    // Save in context & localStorage
    addRequest(request);
    const existing = JSON.parse(localStorage.getItem("serviceRequests") || "[]");
    localStorage.setItem("serviceRequests", JSON.stringify([request, ...existing]));

    // Reset form
    setDescription("");
    setFiles([]);
    setProblemCategory("Hardware");

    // Show success dialog
    setShowSuccessDialog(true);
    setTimeout(() => {
      setShowSuccessDialog(false);
      navigate("/client-dashboard");
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-black">Request Device Service</h1>
        <Button
          onClick={() => navigate(-1)}
          className="inline-flex items-center bg-primary-600 text-white px-4 py-1 font-semibold rounded-lg"
        >
          <IoArrowBack className="mr-2" />
          Back
        </Button>
      </div>

      <p className="text-gray-600 mb-3">
        Fill out the form below to request repair or maintenance. Please provide as much detail as possible.
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 rounded-xl p-6 space-y-5"
      >
        {/* Problem Type + Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-lg mb-1">Problem Category</label>
            <select
              value={ProblemCategory}
              onChange={(e) => setProblemCategory(e.target.value as any)}
              className="w-full border rounded px-3 py-2 text-base"
            >
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-lg mb-1">Requested Date</label>
            {/* ✅ Auto-filled, not editable */}
            <input
              type="text"
              disabled
              value={new Date().toLocaleString()}
              className="w-full border rounded px-3 py-2 text-base bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2 text-lg">Problem Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g. The screen flickers intermittently when moving the lid..."
            className="w-full min-h-[150px] border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        {/* Attachments */}
        <div>
          <label className="block font-semibold text-lg">Attachments</label>
          <p className="text-gray-500 text-sm mb-2">
            Attach relevant photos or videos (optional).
          </p>
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

        {/* Error */}
        {error && <div className="text-red-600 text-sm">{error}</div>}

        {/* Submit */}
        <div className="pt-3">
          <button
            type="submit"
            className="px-8 py-2 w-full rounded-lg bg-primary-600 hover:bg-primary-900 text-white text-lg font-bold shadow"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-8 text-sm text-gray-500">
        Submitting for: <span className="font-semibold">{device.name}</span> ({device.serial}) •
        Requested by <span className="font-semibold">{currentUserName}</span>
      </div>

      {/* ✅ Success Popup */}
      <SuccessDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog} />
    </div>
  );
};

export default AskForHelp;
