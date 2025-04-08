import React, { useState } from "react";
import Avatar from 'react-avatar';

import "./Dashboard.css";

const Dashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("utenti");

  return (
    <>
      <div className="user-dropdown">
        <Avatar
          className="avatar-icon"
          name={user.nome}
          size="48"
          round={true}
          textSizeRatio={2}
          color="#8d0f0f"
          fgColor="#fff"
        />

        <div className="user-info-box">
          <p className="user-name">{user.nome}</p>
          <p className="user-role">{user.ruolo}</p>
          <button className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard">
          <header className="dashboard-header">
            <h1>Gestione eventi Lebrac</h1>
          </header>

          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === "utenti" ? "active" : ""}`}
              onClick={() => setActiveTab("utenti")}
            >
              Utenti
            </button>
            <button
              className={`tab-btn ${activeTab === "partecipazioni" ? "active" : ""}`}
              onClick={() => setActiveTab("partecipazioni")}
            >
              Partecipazioni
            </button>
            <button
              className={`tab-btn ${activeTab === "riepilogo" ? "active" : ""}`}
              onClick={() => setActiveTab("riepilogo")}
            >
              Riepilogo Eventi
            </button>
          </div>

          <div className="tab-content">
            <p>
              Hai selezionato il tab: <strong>{activeTab}</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
