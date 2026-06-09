import React from "react";
import EventForm from "../../components/dashboardComponents/EventForm";
import CalendarView from "../../components/dashboardComponents/CalendarView";
import * as Dialog from "@radix-ui/react-dialog";
import { useSchedule } from "../../context/ScheduleContext";
import { useUserContext } from "../../context/UserContext";

const WorkOrders: React.FC = () => {
 
  return (
    <div className="px-2 space-y-1">
      <h1 className="text-2xl font-bold">Work Orders</h1>

      <div className="flex justify-between items-center">
        <p className="text-lg text-black font-light">
          Manage your work orders here. Add new orders and view them on the calendar.
        </p>
       
      </div>

    
    </div>
  );
};

export default WorkOrders;