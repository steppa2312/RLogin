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
          {eventiFiltrati.map((evento, index) => (
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
                  <button className="action-btn delete">
                    <FaTrashAlt style={{ marginRight: "0.5rem" }} />
                    Elimina</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventGrid;
