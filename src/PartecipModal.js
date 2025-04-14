import React, { useEffect, useState } from "react";
import "./Modal.css";

const API_URL = process.env.REACT_APP_API_URL;

const PartecipModal = ({ evento, user, onClose }) => {
  const [utenti, setUtenti] = useState([]);
  const [presenze, setPresenze] = useState({});
  const [presenzeIniziali, setPresenzeIniziali] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUtentiEPresenze = async () => {
      if (!user || !evento) return;

      try {
        const [utentiRes, presenzeRes] = await Promise.all([
          fetch(`${API_URL}/api/users`),
          fetch(`${API_URL}/api/partecipazioni/${evento.id}`)
        ]);

        const utentiData = await utentiRes.json();
        const presenzeData = await presenzeRes.json();

        let filteredUtenti = [];
        if (user.ruolo === "admin") {
          filteredUtenti = utentiData;
        } else {
          filteredUtenti = utentiData.filter(u => u.id_padre === user.id_padre);
        }

        setUtenti(filteredUtenti);

        const iniziali = {};
        filteredUtenti.forEach(u => {
          const trovato = presenzeData.find(p => p.id_utente === u.id);
          iniziali[u.id] = trovato ? trovato.stato === "presente" : false;
        });

        setPresenze(iniziali);
        setPresenzeIniziali(iniziali); // 🔁 salva anche per confronto
      } catch (err) {
        console.error("Errore nel caricamento utenti o presenze:", err);
      }
    };

    fetchUtentiEPresenze();
  }, [user, evento]);

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

  return (
    <div className="modal-overlay">
      <div className="modal scrollable" onClick={(e) => e.stopPropagation()}>
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
