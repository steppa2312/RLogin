import React, { useEffect, useState } from "react";
import "./EventSummaryGrid.css";

const API_URL = process.env.REACT_APP_API_URL;

const EventSummaryGrid = () => {
  const [eventi, setEventi] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [presenze, setPresenze] = useState([]);

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
  }, []);

  useEffect(() => {
    const fetchPresenze = async () => {
      if (!selectedEventId) {
        setPresenze([]);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/riepilogo_evento/${selectedEventId}`);
        const data = await res.json();
        setPresenze(data.presenze || []);
      } catch (err) {
        console.error("Errore nel caricamento riepilogo:", err);
      }
    };

    fetchPresenze();
  }, [selectedEventId]);

  const presentiTotali = presenze.filter(p => p.presente === true).length;

  return (
    <div className="summary-grid-container">
      <h2 className="summary-title">Riepilogo Presenze</h2>

      <select
        value={selectedEventId}
        onChange={(e) => setSelectedEventId(parseInt(e.target.value))}
        className="event-dropdown"
      >
        <option value="">— Seleziona un evento —</option>
        {eventi.map(ev => (
          <option key={ev.id} value={ev.id}>
            {ev.nome} — {new Date(ev.data).toLocaleDateString("it-IT")}
          </option>
        ))}
      </select>

      {selectedEventId && (
        <p className="summary-footer">
          Totale presenti: <strong>{presentiTotali}</strong>
        </p>
      )}

      <div className="summary-table-wrapper">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Cognome e Nome</th>
              <th>Presente</th>
            </tr>
          </thead>
          <tbody>
            {presenze.length === 0 ? (
              <tr>
                <td colSpan="5">Seleziona un evento per vedere il riepilogo...</td>
              </tr>
            ) : (
              presenze
                .filter(user => user.nome !== "Admin")
                .map(user => (
                  <tr key={user.id}>
                    <td>{user.cognome} {user.nome}</td>
                    <td>
                      <span
                        className={`summary-status ${user.presente ? "presente" : ""}`}
                      >
                        {user.presente ? "SI" : "NO"}
                      </span>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventSummaryGrid;
