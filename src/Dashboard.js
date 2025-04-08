import React, { useState, useContext } from "react";
import "./App.css";
import { AuthContext } from "./AuthContext";
import UserManagement from "./UserManagement";
import EventParticipationTable from "./EventParticipationTable";
import EventSummaryTable from "./EventSummaryTable";

const Dashboard = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [currentTab, setCurrentTab] = useState("users");

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Associazione Eventi</h1>
        <div className="user-info">
          <div>
            <p className="user-name">{currentUser.fullName}</p>
            <p className="user-role">{currentUser.role}</p>
          </div>
          <button className="button" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="tabs">
        <button className={currentTab === "users" ? "tab active" : "tab"} onClick={() => setCurrentTab("users")}>Utenti</button>
        <button className={currentTab === "participations" ? "tab active" : "tab"} onClick={() => setCurrentTab("participations")}>Partecipazioni</button>
        <button className={currentTab === "summary" ? "tab active" : "tab"} onClick={() => setCurrentTab("summary")}>Riepilogo Eventi</button>
      </div>

      <div className="tab-content">
        {currentTab === "users" && <UserManagement />}
        {currentTab === "participations" && <EventParticipationTable />}
        {currentTab === "summary" && <EventSummaryTable />}
      </div>
    </div>
  );
};

export default Dashboard;