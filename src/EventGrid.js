import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";

import "./EventGrid.css";

const API_URL = process.env.REACT_APP_API_URL;

const EventGrid = ({ user, eventi, setEventi, onSelect,  onAddEvento}) => {
  const [view, setView] = useState("futuri");

  useEffect(() => {
    const fetchEventi = async () => {
      try {
        const res = await fetch(`${API_URL}/api/eventi`);
        const data = await res.json();
        setEventi(data);
      } catch (err) {
        console.error("Errore nel caricamento eventi:", err);
      }
    };

    fetchEventi();
  }, [setEventi]);

  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  const eventiFiltrati = eventi.filter(ev => {
    const dataEv = new Date(ev.data);
    return view === "futuri" ? dataEv >= oggi : dataEv < oggi;
  });

  const handleDeleteEvent = async (evento) => {
    const conferma = window.confirm(`Sei sicuro di voler eliminare l'evento "${evento.nome}"?`);
    if (!conferma) return;
  
    try {
      const res = await fetch(`${API_URL}/api/evento/${evento.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ admin_secret: "admin123" }),
      });
  
      const data = await res.json();
  
      if (data.success) {
        setEventi(prev => prev.filter(ev => ev.id !== evento.id));
      } else {
        alert("Errore durante l'eliminazione: " + data.message);
      }
    } catch (err) {
      alert("Errore di rete: " + err.message);
    }
  };
  

  return (
    <div className="user-table-container">
      <div className="sub-tabs">
        <button
          className={view === "passati" ? "active-subtab" : ""}
          onClick={() => setView("passati")}
        >
          Eventi Passati
        </button>
        <button
          className={view === "futuri" ? "active-subtab" : ""}
          onClick={() => setView("futuri")}
        >
          Eventi Futuri
        </button>
      </div>
      {user.ruolo === "admin" && (
  <div className="create-btn-wrapper">
    <button className="create-btn" onClick={onAddEvento}>
  <FaPlus style={{ marginRight: "0.5rem" }} />
  Crea evento
</button>
  </div>
)}


      <table className="user-table">
        <thead>
          <tr>
            <th>Azioni</th>
            <th>Nome evento</th>
            <th>Descrizione</th>
            <th>Data</th>
            <th>Luogo</th>
            {user.ruolo === "admin" && <th>Azioni admin</th>}
          </tr>
        </thead>
        <tbody>
          {eventiFiltrati.length > 0 ? (
          eventiFiltrati.map((evento, index) => (
            <tr key={evento.id || index}>
              <td>
                <button
                  className="action-btn"
                  onClick={() => onSelect(evento, "presenza")}
                >
                    <FaEdit style={{ marginRight: "0.5rem" }} />
                  Modifica presenza
                </button>
              </td>
              <td>{evento.nome}</td>
              <td>{evento.descrizione}</td>
              <td>
                {new Date(evento.data).toLocaleDateString("it-IT", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </td>
              <td>{evento.luogo}</td>
              {user.ruolo === "admin" && (
                <td>
                  <button
                    className="action-btn"
                    onClick={() => onSelect(evento, "evento")}
                  >
                    <FaEdit style={{ marginRight: "0.5rem" }} />
                    Modifica
                  </button>
                  <button className="action-btn delete"
                    onClick={() => handleDeleteEvent(evento)}>
                    <FaTrashAlt style={{ marginRight: "0.5rem" }} />
                    Elimina</button>
                </td>
              )}
            </tr>
          )))
          : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                Nessun evento disponibile.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventGrid;
