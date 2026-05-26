import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { IoArrowBack } from "react-icons/io5";
import { useDeviceContext } from "../../context/DeviceContext";
import { useUserContext } from "../../context/UserContext";
import SuccessDialog from "../../components/ui/SuccessDialog";

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

  const currentUser = users.find(
    (u) => u.userId === currentUserId
  );

  const currentUserName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "User";

  /* =========================
     🚫 BLOCK DUPLICATE REQUEST
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
      <div className="max-w-3xl mx-auto p-4 sm:p-6 text-center text-red-600">
        <h2 className="text-lg sm:text-xl font-semibold">
          Device not found
        </h2>

        <Button
          onClick={() => navigate(-1)}
          className="mt-4 text-xs sm:text-sm"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
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
    // ✅ REAL submit time
    const requestTime = new Date().toISOString();

    await addRequest({
      deviceId: device._id,
      description: description.trim(),
      problemCategory: problemCategory,
      attachments: files,

      // ✅ actual submit time
      createdAt: requestTime,
    });

    setDescription("");
    setFiles([]);
    setProblemCategory("Hardware");

    setShowSuccessDialog(true);

    setTimeout(() => {
      setShowSuccessDialog(false);
      navigate("/client-dashboard");
    }, 2000);
  } catch (err) {
    console.error(err);
    setError(
      "Failed to submit request. Please try again."
    );
  }
};

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black leading-tight">
          Request Device Service
        </h1>

        <Button
          onClick={() => navigate(-1)}
          className="inline-flex items-center bg-primary-600 text-white px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap"
        >
          <IoArrowBack className="mr-1 sm:mr-2 text-sm" />
          Back
        </Button>
      </div>

      <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
        Fill out the form below to request repair or
        maintenance.
      </p>

      {/* WARNING */}
      {hasActiveRequest && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg text-xs sm:text-sm leading-relaxed">
          ⚠️ You already submitted this problem for this
          device. Please wait until it is resolved. If
          it's a different issue, change the problem
          category.
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 rounded-xl p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CATEGORY */}
          <div>
            <label className="block font-semibold text-sm sm:text-base md:text-lg mb-1">
              Problem Category
            </label>

            <select
              value={problemCategory}
              onChange={(e) =>
                setProblemCategory(
                  e.target.value as ProblemCategory
                )
              }
              className="w-full border rounded px-3 py-2 text-xs sm:text-sm md:text-base"
            >
              {categories.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="block font-semibold text-sm sm:text-base md:text-lg mb-1">
              Requested Date
            </label>

            <input
  type="text"
  disabled
  value={new Date().toLocaleString()}
  className="w-full border rounded px-3 py-2 bg-gray-50 text-xs sm:text-sm md:text-base"
/>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block font-semibold text-sm sm:text-base md:text-lg mb-1">
            Problem Description
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Describe the problem..."
            className="w-full min-h-[130px] sm:min-h-[150px] border rounded-lg p-3 text-xs sm:text-sm md:text-base"
          />
        </div>

        {/* FILE INPUT */}
        <div>
          <label className="block font-semibold text-sm sm:text-base mb-2">
            Attach Files
          </label>

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="text-xs sm:text-sm w-full"
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-red-600 text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={hasActiveRequest}
          className="px-6 sm:px-8 py-2.5 w-full rounded-lg bg-primary-600 text-white text-sm sm:text-base font-bold hover:opacity-90 transition disabled:opacity-50"
        >
          Submit Request
        </button>
      </form>

      {/* FOOTER */}
      <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500 break-words leading-relaxed">
        Submitting for{" "}
        <b>{device.deviceType}</b> (
        {device.serialNumber}) • {currentUserName}
      </div>

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        message="Your service request was submitted successfully."
      />
    </div>
  );
};

export default AskForHelp;