import React, { useEffect, useState } from "react";
// import "./App.css";
import UserRow from "./UserRow"
import "./UserGrid.css"; // Assicurati di avere questo file CSS per lo stile della tabella
const API_URL = process.env.REACT_APP_API_URL;

const UserGrid = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Errore nel caricamento utenti:", err));
  }, []);

  return (
    <div className="user-table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>👤 Nome e cognome</th>
             <th>Username</th>
             <th>🔑 Ruolo</th>
             <th>⚙️ Azioni</th>
          </tr>
        </thead>
        <tbody>
        {users.map((user, index) => (
             <tr key={user.username || index}>
               <td>{user.nome}</td>
               <td>{user.username}</td>
               <td>{user.ruolo}</td>
               <td>
                 <button className="action-btn">Modifica</button>
                 <button className="action-btn">Elimina</button>
               </td>
             </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserGrid;
