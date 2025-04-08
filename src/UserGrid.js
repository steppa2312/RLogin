import React, { useEffect, useState } from "react";
// import "./App.css";
import UserRow from "./UserRow"

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
            <th>Nome</th>
            <th>Ruolo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserRow user={user} key={user.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserGrid;
