import React, { useState } from "react";

interface EventFormProps {
  onAddEvent: (
    title: string,
    date: Date,
    recurrence: string,
    cycles: number
  ) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onAddEvent }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [recurrence, setRecurrence] = useState("none");
  const [cycles, setCycles] = useState(6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    onAddEvent(title, new Date(date), recurrence, cycles);
    setTitle("");
    setDate("");
    setRecurrence("none");
    setCycles(6);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Event Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mt-1 border rounded p-2"
          placeholder="Enter event name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mt-1 border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Repeat
        </label>
        <select
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value)}
          className="w-full mt-1 border rounded p-2"
        >
          <option value="none">No Repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {recurrence !== "none" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Repeat for how many cycles?
          </label>
          <input
            type="number"
            value={cycles}
            min={1}
            max={50}
            onChange={(e) => setCycles(parseInt(e.target.value))}
            className="w-full mt-1 border rounded p-2"
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-700 transition"
      >
        Add
      </button>
    </form>
  );
};

export default EventForm;
