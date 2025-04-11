import React, { useState } from "react";
import "./Modal.css";

const API_URL = process.env.REACT_APP_API_URL;

const CreateEventModal = ({ onClose, onSave }) => {
  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [data, setData] = useState("");
  const [luogo, setLuogo] = useState("");

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/api/crea_evento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          descrizione,
          data,
          luogo,
          admin_secret: "admin123", // 🔐 mandalo solo se sei autenticato
        }),
      });

      if (!res.ok) {
        throw new Error("Errore nel salvataggio");
      }

      const newEvent = await res.json();
      onSave(newEvent); // ⬅️ questo aggiorna la lista eventi nel padre
      onClose();
    } catch (err) {
      alert("Errore: " + err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Crea Nuovo Evento</h2>
        <label>Nome</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} />

        <label>Descrizione</label>
        <textarea value={descrizione} onChange={(e) => setDescrizione(e.target.value)} />

        <label>Data</label>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} />

        <label>Luogo</label>
        <input value={luogo} onChange={(e) => setLuogo(e.target.value)} />

        <div className="modal-buttons">
          <button className="modal-close-button" onClick={onClose}>Annulla</button>
          <button className="modal-save-button" onClick={handleSave}>Salva</button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
