import React, { useState } from "react";
import "./Modal.css";

const API_URL = process.env.REACT_APP_API_URL;

const EventModal = ({ evento, onClose, onSave }) => {
    const [nome, setNome] = useState(evento.nome);
    const [descrizione, setDescrizione] = useState(evento.descrizione);
    const [data, setData] = useState(evento.data);
    const [luogo, setLuogo] = useState(evento.luogo);

    const handleSave = async () => {
        try {
            const res = await fetch(`${API_URL}/api/eventi/${evento.id}`, {
                method: "PUT", // o POST se preferisci
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nome, descrizione, data, luogo }),
            });

            if (!res.ok) {
                throw new Error("Errore nel salvataggio");
            }

            const updated = await res.json();
            onSave(updated); // aggiorna lista eventi nel padre
            onClose();
        } catch (err) {
            alert("Errore: " + err.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Modifica Evento</h2>

                <label>Nome</label>
                <input value={nome} onChange={(e) => setNome(e.target.value)} />

                <label>Descrizione</label>
                <textarea value={descrizione} onChange={(e) => setDescrizione(e.target.value)} />

                <label>Data</label>
                <input type="date" value={data.slice(0, 10)} onChange={(e) => setData(e.target.value)} />

                <label>Luogo</label>
                <input value={luogo} onChange={(e) => setLuogo(e.target.value)} />

                <div className="modal-buttons">
                    <button className="modal-close-button" onClick={onClose}>
                        Annulla
                    </button>
                    <button className="modal-save-button" onClick={handleSave}>
                        Salva
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
