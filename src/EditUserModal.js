import React, { useState, useEffect } from "react";
import "./Modal.css";

const API_URL = process.env.REACT_APP_API_URL;

const EditUserModal = ({ user, userToEdit, onClose, onSave }) => {
    const [nome, setNome] = useState(userToEdit.nome);
    const [cognome, setCognome] = useState(userToEdit.cognome);
    const [username, setUsername] = useState(userToEdit.username);
    const [usernameAutogenerato, setUsernameAutogenerato] = useState(false);

    const [password, setPassword] = useState(userToEdit.password);
    const [ruolo, setRuolo] = useState(userToEdit.ruolo);
    const [id_padre, setIdPadre] = useState(userToEdit.id_padre);

    const [usaAffiliazione, setUsaAffiliazione] = useState(userToEdit.id_padre !== userToEdit.id);
    const [nomePadre, setNomePadre] = useState("");
    const [cognomePadre, setCognomePadre] = useState("");

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const handleSave = async () => {
        try {
            let id_padre_finale = userToEdit.id; // default: se stesso
    
            // Se affiliazione spuntata: cerca il padre
            if (usaAffiliazione) {
                const resPadre = await fetch(`${API_URL}/api/cerca_padre`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome: nomePadre, cognome: cognomePadre }),
                });
    
                if (!resPadre.ok) throw new Error("Padre non trovato");
                const padre = await resPadre.json();
                id_padre_finale = padre.id;
            }
    
            // Costruisci oggetto da inviare
            const payload = {
                nome,
                cognome,
                username,
                ruolo,
                id_padre: id_padre_finale,
                admin_secret: "admin123",
            };
    
            if (typeof password === "string" && password.trim() !== "") {
                payload.password = password;
              }

            // // Includi password solo se è stata scritta
            // if (password.trim() !== "") {
            //     payload.password = password;
            // }
    
            const res = await fetch(`${API_URL}/api/aggiorna_utente/${userToEdit.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
    
            if (!res.ok) throw new Error("Errore nella modifica utente");
    
            const updated = await res.json();
    
            onSave(updated); // eventualmente aggiorna la lista nel padre
            onClose();
        } catch (err) {
            alert("Errore: " + err.message);
        }
    };

    useEffect(() => {
        if (usernameAutogenerato) {
            const nuovoUsername = removeAccents((cognome + nome).toLowerCase().replace(/\s+/g, ""));
            setUsername(nuovoUsername);
        }
    }, [nome, cognome]);

    useEffect(() => {
        if (userToEdit.id_padre && userToEdit.id_padre !== userToEdit.id) {
            const fetchPadre = async () => {
                try {
                    const res = await fetch(`${API_URL}/api/get_padre/${userToEdit.id_padre}`);
                    if (!res.ok) throw new Error("Padre non trovato");
                    const data = await res.json();
                    setNomePadre(data.nome);
                    setCognomePadre(data.cognome);
                } catch (err) {
                    console.error("Errore nel recupero del padre:", err);
                }
            };
    
            fetchPadre();
        }
    }, [userToEdit]);
    
    return (
        <div className="modal-overlay">
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Modifica Utente</h2>
                <label>Nome</label>
                <input value={nome} onChange={(e) => setNome(e.target.value)} />

                <label>Cognome</label>
                <input value={cognome} onChange={(e) => setCognome(e.target.value)} />

                <label>Username</label>
                <input
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setUsernameAutogenerato(false);
                    }}
                />
                <label>Nuova password (lascia vuoto per non modificare)</label>
                <input
                    type="password"
                    value={password}
                    placeholder="Lascia vuoto per mantenerla"
                    onChange={(e) => setPassword(e.target.value)}
                />
                 <label>Ruolo</label>
                <select value={ruolo} onChange={(e) => setRuolo(e.target.value)}>
                    <option value="">Seleziona ruolo</option>
                    <option value="utente">Utente</option>
                    <option value="genitore">Genitore</option>
                    <option value="admin">Admin</option>
                </select>

                <div className="form-row tooltip-wrapper">
                    <span className="switch-label">Imposta affiliazione</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={usaAffiliazione}
                            onChange={(e) => setUsaAffiliazione(e.target.checked)}
                            disabled={ruolo === "genitore"}
                        />
                        <span className="slider"></span>
                    </label>

                    {ruolo === "genitore" && (
                        <div className="tooltip">Non è possibile affiliare un genitore</div>
                    )}

                </div>




                {usaAffiliazione && (
                    <>
                        <label>Nome padre</label>
                        <input
                            value={nomePadre}
                            onChange={(e) => setNomePadre(e.target.value)}
                        />
                        <label>Cognome padre</label>
                        <input
                            value={cognomePadre}
                            onChange={(e) => setCognomePadre(e.target.value)}
                        />
                    </>
                )}

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

export default EditUserModal;
