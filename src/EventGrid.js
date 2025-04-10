import React, { useEffect, useState } from "react";
import "./EventGrid.css"; // Assicurati di avere questo file CSS per lo stile della tabella
const API_URL = process.env.REACT_APP_API_URL;

const EventGrid = () => {
  const [eventi, setEventi] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/eventi`)
      .then(res => res.json())
      .then(data => setEventi(data))
      .catch(err => console.error("Errore nel caricamento utenti:", err));
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
               <td>{evento.data}</td>
               <td>{evento.luogo}</td>
               <td>
                 <button className="action-btn">Modifica</button>
                 <button className="action-btn delete">Elimina</button>
               </td>
             </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventGrid;
