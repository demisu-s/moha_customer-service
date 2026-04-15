import React, { useState, useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import { PlantPayload } from "../../api/global.types";

interface EventFormProps {
  onAddEvent: (
    title: string,
    start: Date,
    end: Date,
    recurrence: string,
    cycles: number,
    plant: string
  ) => void;
}

interface FormData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  recurrence: string;
  cycles: number;
  plant: PlantPayload | null;
}

const EventForm: React.FC<EventFormProps> = ({ onAddEvent }) => {
  const { currentUser, plants } = useUserContext();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    recurrence: "none",
    cycles: 4,
    plant: null,
  });

  /* ================= ROLE CHECK ================= */
  const isAdmin =
    currentUser?.role === "admin";

  /* ================= AUTO SET PLANT (LIKE DEVICE) ================= */
  useEffect(() => {
    if (!currentUser || !isAdmin) return;

    const plantField = currentUser.department?.plant;

    const plantId =
      typeof plantField === "string"
        ? plantField
        : plantField?._id;

    const plantObj =
      plants.find((p) => p._id === plantId) || null;

    setFormData((prev) => ({
      ...prev,
      plant: plantObj,
    }));
  }, [currentUser, plants, isAdmin]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.plant
    ) {
      alert("Please fill all fields");
      return;
    }

    const start = new Date(`${formData.date}T${formData.startTime}`);
    const end = new Date(`${formData.date}T${formData.endTime}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert("Invalid date/time");
      return;
    }

    if (end <= start) {
      alert("End time must be after start time");
      return;
    }

    /* ✅ SEND ONLY plant._id (IMPORTANT) */
    onAddEvent(
      formData.title,
      start,
      end,
      formData.recurrence,
      formData.cycles,
      formData.plant._id
    );

    /* ================= RESET ================= */
    setFormData({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      recurrence: "none",
      cycles: 4,
      plant: isAdmin ? formData.plant : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {/* ================= TITLE ================= */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Event Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full mt-1 border rounded p-2"
          required
        />
      </div>

      {/* ================= PLANT (DEVICE STYLE) ================= */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Plant
        </label>

        <select
          value={formData.plant?._id || ""}
          onChange={(e) => {
            const selected =
              plants.find((p) => p._id === e.target.value) || null;
            handleChange("plant", selected);
          }}
          className="w-full mt-1 border rounded p-2"
          disabled={isAdmin} // ✅ ADMIN LOCKED
          required
        >
          <option value="">Select Plant</option>
          {plants.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= DATE ================= */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="w-full mt-1 border rounded p-2"
          required
        />
      </div>

      {/* ================= START TIME ================= */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Time
        </label>
        <input
          type="time"
          value={formData.startTime}
          onChange={(e) => handleChange("startTime", e.target.value)}
          className="w-full mt-1 border rounded p-2"
          required
        />
      </div>

      {/* ================= END TIME ================= */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          End Time
        </label>
        <input
          type="time"
          value={formData.endTime}
          onChange={(e) => handleChange("endTime", e.target.value)}
          className="w-full mt-1 border rounded p-2"
          required
        />
      </div>

      {/* ================= RECURRENCE ================= */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Repeat
        </label>
        <select
          value={formData.recurrence}
          onChange={(e) => handleChange("recurrence", e.target.value)}
          className="w-full mt-1 border rounded p-2"
        >
          <option value="none">No Repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* ================= CYCLES ================= */}
      {formData.recurrence !== "none" && (
        <input
          type="number"
          value={formData.cycles}
          min={1}
          max={50}
          onChange={(e) =>
            handleChange("cycles", Number(e.target.value))
          }
          className="w-full mt-1 border rounded p-2"
        />
      )}

      {/* ================= SUBMIT ================= */}
      <button className="bg-primary-500 text-white px-4 py-2 rounded">
        Add
      </button>
    </form>
  );
};

export default EventForm;