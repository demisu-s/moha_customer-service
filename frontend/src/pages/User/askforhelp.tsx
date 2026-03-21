import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { IoArrowBack } from "react-icons/io5";
import { useDeviceContext } from "../../context/DeviceContext";
import { useUserContext } from "../../context/UserContext";
import { SuccessDialog } from "../../components/ui/SuccessDialog";
import { useServiceRequests } from "../../context/ServiceRequestContext";

const AskForHelp: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { devices } = useDeviceContext();
  const { users } = useUserContext();
  const { addRequest, problemTypes } = useServiceRequests();

  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [problemCategory, setProblemCategory] = useState<string>(problemTypes[0] || "");
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const device = useMemo(() => devices.find((d) => d._id === id), [devices, id]);

  const currentUserId = localStorage.getItem("userId");
  const currentUser = users.find((u) => u.userId === currentUserId);
  const currentUserName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "User";

  if (!device) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-red-600">
        <h2 className="text-xl font-semibold">Device not found</h2>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError("Please describe the problem.");
      return;
    }

    try {
      await addRequest({
       deviceId: device._id, // ✅ PERFECT
        description: description.trim(),
        problemCategory: problemCategory as any,
        attachments: files,
      });

      setDescription("");
      setFiles([]);
      setProblemCategory(problemTypes[0] || "");

      setShowSuccessDialog(true);

      setTimeout(() => {
        setShowSuccessDialog(false);
        navigate("/client-dashboard");
      }, 2500);
    } catch (err) {
      setError("Failed to submit request. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-black">Request Device Service</h1>
        <Button onClick={() => navigate(-1)} className="inline-flex items-center bg-primary-600 text-white px-4 py-1 font-semibold rounded-lg">
          <IoArrowBack className="mr-2" />Back
        </Button>
      </div>

      <p className="text-gray-600 mb-3">
        Fill out the form below to request repair or maintenance. Please provide as much detail as possible.
      </p>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-xl p-6 space-y-5">
        {/* Problem Category + Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-lg mb-1">Problem Category</label>
            <select
              value={problemCategory}
              onChange={(e) => setProblemCategory(e.target.value)}
              className="w-full border rounded px-3 py-2 text-base"
            >
              {problemTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-lg mb-1">Requested Date</label>
            <input
              type="text"
              disabled
              value={new Date().toLocaleString()}
              className="w-full border rounded px-3 py-2 text-base bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block font-semibold mb-2 text-lg">Problem Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem..."
            className="w-full min-h-[150px] border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        {/* FILES */}
        <div>
          <label className="block font-semibold text-lg">Attachments</label>
          <p className="text-gray-500 text-sm mb-2">Attach relevant photos or videos (optional).</p>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {files.length > 0 && <div className="mt-2 text-xs text-gray-600">{files.length} file(s) selected</div>}
        </div>

        {/* ERROR */}
        {error && <div className="text-red-600 text-sm">{error}</div>}

        {/* SUBMIT */}
        <div className="pt-3">
          <button type="submit" className="px-8 py-2 w-full rounded-lg bg-primary-600 hover:bg-primary-900 text-white text-lg font-bold shadow">
            Submit
          </button>
        </div>
      </form>

      {/* FOOTER */}
      <div className="mt-8 text-sm text-gray-500">
        Submitting for: <span className="font-semibold">{device.deviceType}</span> ({device.serialNumber}) • Requested by <span className="font-semibold">{currentUserName}</span>
      </div>

      {/* SUCCESS DIALOG */}
      <SuccessDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog} />
    </div>
  );
};

export default AskForHelp;