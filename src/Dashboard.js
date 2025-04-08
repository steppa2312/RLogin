import React, { useState } from "react";
import Avatar from "react-avatar";
import "./Dashboard.css";
import logo from "./assets/logo-lebrac.png";
import UserGrid from "./UserGrid";

const Dashboard = ({ user, onLogout }) => {
  const isAdmin = user.ruolo === "admin";
  const [activeTab, setActiveTab] = useState("riepilogo");

  const tabs = isAdmin
    ? ["utenti", "eventi", "crea evento"]
    : ["eventi"];

    const renderTabContent = () => {
      switch (activeTab) {
        case "utenti":
          return isAdmin ? <UserGrid /> : <p>Accesso non autorizzato.</p>;
        case "partecipazioni":
          return isAdmin ? <p>Partecipazioni agli eventi</p> : <p>Accesso non autorizzato.</p>;
        case "riepilogo":
          return <p>Riepilogo eventi</p>;
        default:
          return null;
      }
    };

  return (
    <>
      {/* LOGO in alto a sinistra */}
      <div className="logo-fixed">
        <img src={logo} alt="Logo Lebrac" />
      </div>

      {/* Dropdown utente con hover */}
      <div className="user-dropdown">
        <Avatar
          className="avatar-icon"
          name={user.nome}
          size="48"
          round
          textSizeRatio={2}
          color="#8d0f0f"
          fgColor="#fff"
        />
        <div className="user-info-box">
          <p className="user-name">{user.nome}</p>
          <p className="user-role">{user.ruolo}</p>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Contenitore principale */}
      <div className="dashboard-card">
        <div className="dashboard">
          <header className="dashboard-header">
            <h1>Gestione eventi Lebrac</h1>
          </header>

          {/* Tab dinamici */}
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Contenuto del tab */}
          <div className="tab-content">{renderTabContent()}</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
