import { Outlet } from "react-router-dom";

import { ClientSidebar } from "./components/ClientSidebar";

import { ClientHeader } from "./components/ClientHeader";

export function ClientDashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <ClientSidebar />
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Client Header */}
        <ClientHeader />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}