import React, { useState, useEffect } from "react";
import Avatar from "react-avatar";
import "./Dashboard.css";
import logo from "./assets/logo-lebrac.png";
import UserGrid from "./UserGrid";
import EventGrid from "./EventGrid";
import EventModal from "./EventModal";
import PartecipModal from "./PartecipModal";
import CreateEventModal from "./CreateEventModal";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import EventSummaryGrid from "./EventSummaryGrid";

const Dashboard = ({ user, onLogout }) => {
  const isAdmin = user.ruolo === "admin";
  const [activeTab, setActiveTab] = useState("eventi");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPartecipEvent, setSelectedPartecipEvent] = useState(null);
  const [eventi, setEventi] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [utentiPerPresenza, setUtentiPerPresenza] = useState([]);
  const [presenzeEvento, setPresenzeEvento] = useState({});

  const tabs = isAdmin
    ? ["utenti", "eventi", "riepilogo"]
    : ["eventi", "riepilogo"];

  const handleDeleteUser = async (userToDelete) => {
    if (userToDelete.ruolo === "admin") {
      alert("Non puoi eliminare un admin!");
      return;
    }
    const confirm = window.confirm(`Sei sicuro di voler eliminare ${userToDelete.nome} ${userToDelete.cognome}?`);
    if (!confirm) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/utente/${userToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ admin_secret: "admin123" }),
      });

      const data = await res.json();

      if (data.success) {
        // Rimuove l'utente localmente
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      } else {
        alert("Errore durante l'eliminazione: " + data.message);
      }
    } catch (err) {
      alert("Errore di rete: " + err.message);
    }
  };

const fetchUtentiEPresenze = async (evento) => {
  try {
    const [utentiRes, presenzeRes] = await Promise.all([
      fetch(`${process.env.REACT_APP_API_URL}/api/users`),
      fetch(`${process.env.REACT_APP_API_URL}/api/partecipazioni/${evento.id}`)
    ]);
    const utentiData = await utentiRes.json();
    const presenzeData = await presenzeRes.json();

    const filteredUtenti = user.ruolo === "admin"
      ? utentiData
      : utentiData.filter(u => u.id_padre === user.id_padre);

    const iniziali = {};
    filteredUtenti.forEach(u => {
      const trovato = presenzeData.find(p => p.id_utente === u.id);
      iniziali[u.id] = trovato ? trovato.stato === "presente" : false;
    });

    setUtentiPerPresenza(filteredUtenti);
    setPresenzeEvento(iniziali);
  } catch (err) {
    console.error("Errore nel fetch utenti/presenze:", err);
  }
};

  const renderTabContent = () => {
    switch (activeTab) {
      case "utenti":
        return isAdmin ? (
          <UserGrid
            user={user}
            users={users}
            onCreateUser={() => setShowCreateUserModal(true)}
            onEditUser={(u) => {
              setSelectedUser(u);
              setShowEditUserModal(true);
            }}
            onDeleteUser={handleDeleteUser}
          />

        ) : (
          <p>Accesso non autorizzato.</p>
        );
      case "eventi":
        return (
          <EventGrid
            user={user}
            eventi={eventi}
            setEventi={setEventi}
            onSelect={(evento, tipo) => {
              if (tipo === "presenza") {
                fetchUtentiEPresenze(evento);
                setSelectedPartecipEvent(evento);
              } else {
                setSelectedEvent(evento);
              }
            }}
            onAddEvento={() => setShowCreateModal(true)}
          />
        );
        case "riepilogo":
          return (
                <EventSummaryGrid selectedEventId={selectedEventId} />
          );
      default:
        return <p>Riepilogo eventi</p>;
    }
  };



  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Errore nel fetch degli utenti:", err);
    }
  };

  const fetchEventi = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/eventi`);
      const data = await res.json();
      setEventi(data);
    } catch (err) {
      console.error("Errore nel fetch degli eventi:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "eventi") {
      fetchEventi();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "utenti") {
      fetchUsers();
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

      {showCreateUserModal && (
        <CreateUserModal
          onClose={() => setShowCreateUserModal(false)}
          onSave={(newUser) => {
            fetchUsers(); // ⬅️ aggiorna subito
            setShowCreateUserModal(false);
          }}
        />
      )}

      {selectedEvent && (
        <EventModal
          evento={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={(updatedEvent) => {
            fetchEventi(); // ⬅️ ricarica l'elenco completo
            setSelectedEvent(null);
          }}
        />
      )}

{selectedPartecipEvent && (
  <PartecipModal
    evento={selectedPartecipEvent}
    user={user}
    utenti={utentiPerPresenza}
    presenzeIniziali={presenzeEvento}
    onClose={() => setSelectedPartecipEvent(null)}
    onSaveComplete={() => fetchEventi()}
  />
)}

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onSave={() => {
            fetchEventi(); // ⬅️ aggiorna subito
            setShowCreateModal(false);
          }}
        />
      )}

      {showEditUserModal && (
        <EditUserModal
          user={user}
          userToEdit={selectedUser}
          onClose={() => setShowEditUserModal(false)}
          onSave={(updatedUser) => {
            fetchUsers(); // ⬅️ aggiorna la lista
            setShowEditUserModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
