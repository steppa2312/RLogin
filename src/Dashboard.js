import React, { useState, useEffect } from "react";
import Avatar from "react-avatar";
import "./Dashboard.css";
import logo from "./assets/logo-lebrac.png";
import UserGrid from "./UserGrid";
import EventGrid from "./EventGrid";
import EventModal from "./EventModal";
import PartecipModal from "./PartecipModal";

const Dashboard = ({ user, onLogout }) => {
  const isAdmin = user.ruolo === "admin";
  const [activeTab, setActiveTab] = useState("eventi");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedPartecipEvent, setSelectedPartecipEvent] = useState(null);
  const [eventi, setEventi] = useState([]);

  const tabs = isAdmin
    ? ["utenti", "eventi", "crea evento"]
    : ["eventi"];

  const renderTabContent = () => {
    switch (activeTab) {
      case "utenti":
        return isAdmin ? <UserGrid /> : <p>Accesso non autorizzato.</p>;
      case "eventi":
        return (
          <EventGrid
            user={user}
            eventi={eventi}
            setEventi={setEventi}
            onSelect={(evento, tipo) => {
              if (tipo === "presenza") setSelectedPartecipEvent(evento);
              else setSelectedEvent(evento);
            }}
          />
        );
      case "crea evento":
        return <p>Form di creazione evento</p>;
      default:
        return <p>Riepilogo eventi</p>;
    }
  };

  useEffect(() => {
    const fetchEventi = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/eventi`);
        const data = await res.json();
        setEventi(data);
      } catch (err) {
        console.error("Errore nel fetch degli eventi:", err);
      }
    };

    if (activeTab === "eventi") {
      fetchEventi();
    }
  }, [activeTab]);

  return (
    <div className="dashboard-wrapper">
      <div className="logo-fixed">
        <img src={logo} alt="Logo Lebrac" />
      </div>
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

      <div className="dashboard-scroll-area">
        <div className="dashboard-card">
          <div className="dashboard">
            <header className="dashboard-header">
              <h1>Gestione eventi Lebrac</h1>
            </header>
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
            <div className="tab-content">{renderTabContent()}</div>
          </div>
        </div>
      </div>

      {selectedEvent && (
        <EventModal
          evento={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={(updatedEvent) => {
            setEventi(prev =>
              prev.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev)
            );
          }}
        />
      )}

      {selectedPartecipEvent && (
        <PartecipModal
          evento={selectedPartecipEvent}
          user={user}
          onClose={() => setSelectedPartecipEvent(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
