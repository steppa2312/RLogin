import React from "react";
import "./EventModal.css";

const EventModal = ({ evento, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Modifica Evento</h2>
        <p><strong>Nome:</strong> {evento.nome}</p>
        <p><strong>Descrizione:</strong> {evento.descrizione}</p>
        <p><strong>Data:</strong> {evento.data}</p>
        <p><strong>Luogo:</strong> {evento.luogo}</p>
        <button className="modal-btn">Salva e chiudi</button>
        <button className="modal-btn quit" onClick={onClose}>Chiudi senza salvare</button>
      </div>
    </div>
  );
};

export default EventModal;
