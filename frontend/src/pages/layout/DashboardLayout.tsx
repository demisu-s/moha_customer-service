import { Outlet } from 'react-router-dom';
// import { DashboardSidebar } from './component/DashboardSidebar';
// import { DashboardHeader } from './component/DashboardHeader';

export function DashboardLayout() {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            {/* <DashboardSidebar /> */}
            <div className="flex flex-col h-screen w-full">
                {/* <DashboardHeader /> */}
                <main className="flex-1 overflow-y-auto p-4 lg:gap-6 lg:p-6 w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
