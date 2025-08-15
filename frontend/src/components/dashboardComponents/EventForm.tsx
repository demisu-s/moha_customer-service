import React, { useState } from "react";

interface EventFormProps {
  onAddEvent: (title: string, date: Date) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onAddEvent }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    onAddEvent(title, new Date(date));
    setTitle("");
    setDate("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <p className="text-sm font-light text-gray-500 mb-3">
        Create new event and save it to your calendar
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm font-semibold">Task Description</label>
          <input
            type="text"
            placeholder="e.g. Window activation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Due Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700 transition"
        >
          ADD EVENT
        </button>
      </form>
    </div>
  );
};

export default EventForm;
