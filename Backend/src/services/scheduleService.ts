import Schedule from "../models/ScheduleModel";

class ScheduleService {
 async createEvent(data: any, userId: string) {
  const events = [];

  const { title, start, end, recurrence, cycles, plant } = data;
if (!plant) {
  throw new Error("Plant is required");
}

  const baseStart = new Date(start);
  const baseEnd = new Date(end);

  // FIRST EVENT
  events.push({
    title,
    user: userId,
    plant, // ✅ ADD THIS
    start: baseStart,
    end: baseEnd,
  });

  // RECURRENCE
  if (recurrence !== "none") {
    for (let i = 1; i <= cycles; i++) {
      const nextStart = new Date(baseStart);
      const nextEnd = new Date(baseEnd);

      if (recurrence === "daily") {
        nextStart.setDate(baseStart.getDate() + i);
        nextEnd.setDate(baseEnd.getDate() + i);
      }

      if (recurrence === "weekly") {
        nextStart.setDate(baseStart.getDate() + i * 7);
        nextEnd.setDate(baseEnd.getDate() + i * 7);
      }

      if (recurrence === "monthly") {
        nextStart.setMonth(baseStart.getMonth() + i);
        nextEnd.setMonth(baseEnd.getMonth() + i);
      }

      events.push({
        title,
        user: userId,
        plant, // ✅ ADD THIS
        start: nextStart,
        end: nextEnd,
      });
    }
  }

  return Schedule.insertMany(events);
}
async getEventById(id: string) {
  return Schedule.findById(id);
}
async getEvents() {
  return Schedule.find()
    .populate("plant", "name")
    .populate("user", "firstName lastName")
    .sort({ start: 1 });
}
  async deleteEvent(id: string) {
    return Schedule.findByIdAndDelete(id);
  }
}



export default new ScheduleService();