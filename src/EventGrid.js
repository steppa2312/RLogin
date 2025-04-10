import React, { useEffect, useState } from "react";
import "./EventGrid.css";
const API_URL = process.env.REACT_APP_API_URL;

const EventGrid = ({ onSelect }) => {
  const [eventi, setEventi] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/eventi`)
      .then(res => res.json())
      .then(data => setEventi(data))
      .catch(err => console.error("Errore nel caricamento eventi:", err));
  }, []);

  return (
    <div className="user-table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Nome evento</th>
            <th>Descrizione evento</th>
            <th>Data</th>
            <th>Luogo</th>
            <th>Azioni utente</th>
          </tr>
        </thead>
        <tbody>
          {eventi.map((evento, index) => (
            <tr key={evento.nome || index}>
              <td>{evento.nome}</td>
              <td>{evento.descrizione}</td>
              <td>
                {new Date(evento.data).toLocaleDateString("it-IT", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td>{evento.luogo}</td>
              <td>
                <button className="action-btn" onClick={() => onSelect(evento)}>
                  Modifica
                </button>
                <button className="action-btn">Elimina</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventGrid;