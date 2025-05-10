import React, { useEffect, useState } from "react";
import { useMemo } from "react";

import "./Modal.css";

const API_URL = process.env.REACT_APP_API_URL;

const PartecipModal = ({ evento, user, utenti, presenzeIniziali, onClose, onSaveComplete }) => {
  const [presenze, setPresenze] = useState(presenzeIniziali || {});
  const [saving, setSaving] = useState(false);
  // const [utenti, setUtenti] = useState([]);
  // const [presenzeIniziali, setPresenzeIniziali] = useState({});
  const [caricato, setCaricato] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPresenze(presenzeIniziali || {});
  }, [presenzeIniziali]);

  const togglePresenza = (id) => {
    setPresenze(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const modifiche = Object.entries(presenze).filter(
        ([id, stato]) => presenzeIniziali[id] !== stato
      );

      await Promise.all(
        modifiche.map(([id, stato]) =>
          fetch(`${API_URL}/api/partecipazione`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_utente: parseInt(id),
              id_evento: evento.id,
              stato: stato ? "presente" : "assente",
              note: ""
            })
          })
        )
      );

      //   alert("Presenze aggiornate!");
      onClose();
    } catch (err) {
      console.error("Errore nel salvataggio presenze:", err);
      alert("Errore durante il salvataggio delle presenze");
    } finally {
      setSaving(false);
    }
  };

  // const utentiOrdinati = useMemo(() => {
  //   if (!Array.isArray(utenti)) return [];
  //   return [...utenti]
  //     .filter(u => u && u.nome && u.cognome) // evita oggetti malformati
  //     .sort((a, b) => {
  //       const cognomeA = a.cognome.toLowerCase();
  //       const cognomeB = b.cognome.toLowerCase();
  //       if (cognomeA !== cognomeB) return cognomeA.localeCompare(cognomeB);
  
  //       const nomeA = a.nome.toLowerCase();
  //       const nomeB = b.nome.toLowerCase();
  //       return nomeA.localeCompare(nomeB);
  //     });
  // }, [utenti]);

  console.log("presenze iniziali", presenzeIniziali);
console.log("presenze attuali", presenze);

  return (   

    <div className="modal-overlay">
      <div className="modal scrollable" onClick={(e) => e.stopPropagation()}>
        <h2>Gestione presenze: {evento.nome}</h2>

          <div className="user-list">
            {utenti.map((u) => (
              <div className="user-item" key={u.id}>
                <div className="user-info">
                  <strong>{u.cognome} {u.nome}</strong>
                </div>
                <label className="material-switch">
                  <input
                    type="checkbox"
                    checked={!!presenze[u.id]}
                    onChange={() => togglePresenza(u.id)}
                  />
                  <span className="material-slider" />
                </label>
              </div>
            ))}
          </div>

        <div className="modal-buttons">
          <button className="modal-close-button" onClick={onClose}>
            Annulla
          </button>
          <button
            className="modal-save-button"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Salvataggio..." : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartecipModal;
