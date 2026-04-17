import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { IoArrowBack } from "react-icons/io5";
import { useDeviceContext } from "../../context/DeviceContext";
import { useUserContext } from "../../context/UserContext";
import { SuccessDialog } from "../../components/ui/SuccessDialog";
import {
  useServiceRequests,
  ProblemCategory,
} from "../../context/ServiceRequestContext";

const AskForHelp: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { devices } = useDeviceContext();
  const { users } = useUserContext();
  const {
    addRequest,
    problemCategory: categories,
    requests,
  } = useServiceRequests();

  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [problemCategory, setProblemCategory] =
    useState<ProblemCategory>("Hardware");

  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const device = useMemo(
    () => devices.find((d) => d._id === id),
    [devices, id]
  );

  const currentUserId = localStorage.getItem("userId");
  const currentUser = users.find((u) => u.userId === currentUserId);

  const currentUserName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "User";

  /* =========================
     🚫 BLOCK DUPLICATE REQUEST (FIXED)
  ========================== */
  const hasActiveRequest = useMemo(() => {
    if (!device) return false;

    return requests.some(
      (r) =>
        r.deviceId === device._id &&
        r.problemCategory === problemCategory &&
        r.status !== "Resolved"
    );
  }, [requests, device, problemCategory]);

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

    if (hasActiveRequest) {
      setError(
        "You already submitted this problem for this device. Please wait until it is resolved."
      );
      return;
    }

    try {
      // ✅ ONLY THIS MATTERS
      await addRequest({
        deviceId: device._id,
        description: description.trim(),
        problemCategory: problemCategory,
        attachments: files,
      });

      // ✅ SUCCESS
      setDescription("");
      setFiles([]);
      setProblemCategory("Hardware");

      setShowSuccessDialog(true);

      setTimeout(() => {
        setShowSuccessDialog(false);
        navigate("/client-dashboard");
      }, 2000);

    } catch (err) {
      console.error(err); // 🔍 debug if needed
      setError("Failed to submit request. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-black">
          Request Device Service
        </h1>
        <Button
          onClick={() => navigate(-1)}
          className="inline-flex items-center bg-primary-600 text-white px-4 py-1 font-semibold rounded-lg"
        >
          <IoArrowBack className="mr-2" />
          Back
        </Button>
      </div>

      <p className="text-gray-600 mb-3">
        Fill out the form below to request repair or maintenance.
      </p>

      {/* WARNING */}
      {hasActiveRequest && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
          ⚠️ You already submitted this problem for this device. Please wait until it is resolved. If it's a different issue, change the problem category.
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 rounded-xl p-6 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-lg mb-1">
              Problem Category
            </label>

            <select
              value={problemCategory}
              onChange={(e) =>
                setProblemCategory(e.target.value as ProblemCategory)
              }
              className="w-full border rounded px-3 py-2"
            >
              {categories.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-lg mb-1">
              Requested Date
            </label>
            <input
              type="text"
              disabled
              value={new Date().toLocaleString()}
              className="w-full border rounded px-3 py-2 bg-gray-50"
            />
          </div>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the problem..."
          className="w-full min-h-[150px] border rounded-lg p-3"
        />

        <input type="file" multiple onChange={handleFileChange} />

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={hasActiveRequest}
          className="px-8 py-2 w-full rounded-lg bg-primary-600 text-white font-bold disabled:opacity-50"
        >
          Submit
        </button>
      </form>

      <div className="mt-8 text-sm text-gray-500">
        Submitting for <b>{device.deviceType}</b> ({device.serialNumber}) • {currentUserName}
      </div>

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      />
    </div>
  );
};

export default AskForHelp;