import { Outlet } from "react-router-dom";
import Sidebar from "./dashbord/sidebar";
import Header from "./dashbord/header";

function Dashboard() {
    return (
        <div className="dashboard-layout flex">
            <Sidebar />
            <div className="dashboard-content w-full">
                <Header />
                <div   className="p-5 bg-orange-100/50 h-full">
                    <Outlet />
                </div>

            </div>
        </div>
    );
}

export default Dashboard;