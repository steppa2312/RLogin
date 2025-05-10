import React from "react";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import "./UserGrid.css";

const UserGrid = ({ user, users, onCreateUser, onEditUser, onDeleteUser }) => {
  return (
    <div className="user-table-container">
      {user.ruolo === "admin" && (
        <div className="create-btn-wrapper">
          <button className="create-btn" onClick={onCreateUser}>
            <FaPlus style={{ marginRight: "0.5rem" }} />
            Crea utente
          </button>
        </div>
      )}

      <table className="user-table">
        <thead>
          <tr>
            <th>Cognome</th>
            <th>Nome</th>
            <th>Username</th>
            <th>Ruolo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u, index) => (
              <tr key={u.id || index}>
                <td>{u.cognome}</td>
                <td>{u.nome}</td>
                <td>{u.username}</td>
                <td>{u.ruolo}</td>
                <td>
                  <button className="action-btn" onClick={() => onEditUser(u)}>
                    <FaEdit style={{ marginRight: "0.5rem" }} />
                    Modifica
                  </button>
                  <button className="action-btn" onClick={() => onDeleteUser(u)}>
                    <FaTrashAlt style={{ marginRight: "0.5rem" }} />
                  Elimina </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                Nessun utente disponibile.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserGrid;
