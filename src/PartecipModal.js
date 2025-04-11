import React, { useEffect, useState } from "react";
import "./Modal.css";

const API_URL = process.env.REACT_APP_API_URL;

const PartecipModal = ({ evento, user, onClose }) => {
  const [utenti, setUtenti] = useState([]);
  const [presenze, setPresenze] = useState({}); // ✅ inizializza lo stato

  useEffect(() => {
    const fetchUtenti = async () => {
      if (!user) return;

      try {
        const res = await fetch(`${API_URL}/api/users`);
        const data = await res.json();

        let filteredUtenti = [];

        if (user.ruolo === "admin") {
            filteredUtenti = data;
          } else if (user.ruolo === "genitore") {
            console.log("Utente genitore:", user);
            filteredUtenti = data.filter((u) =>
              u.id === user.id || u.id_padre === user.id
            );
            console.log("Utenti filtrati per genitore:", filteredUtenti);
          } else {
            console.log("Utente normale:", user);
            filteredUtenti = data.filter((u) => u.id === user.id);
          }

        setUtenti(filteredUtenti);

        // Simula caricamento presenze da server (da integrare in futuro)
        const iniziali = {};
        filteredUtenti.forEach(u => iniziali[u.id] = false);
        setPresenze(iniziali);
      } catch (err) {
        console.error("Errore nel caricamento utenti:", err);
      }
    };

    fetchUtenti();
  }, [user]);

  const togglePresenza = (id) => {
    setPresenze(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Gestione presenze: {evento.nome}</h2>

        <div className="user-list">
  {utenti.map((u) => (
    <div className="user-item" key={u.id}>
      <div className="user-info">
        <strong>{u.nome}</strong>
        <small>({u.username}) — {u.ruolo}</small>
      </div>
      <label className="material-switch">
        <input
          type="checkbox"
          checked={presenze[u.id] || false}
          onChange={() => togglePresenza(u.id)}
        />
        <span className="material-slider" />
      </label>
    </div>
  ))}
</div>

        <div className="modal-buttons">
          <button className="modal-close-button" onClick={onClose}>Chiudi</button>
        </div>
      </div>
    </div>
  );
};

export default PartecipModal;
