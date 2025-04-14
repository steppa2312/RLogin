import React, { useState, useEffect } from "react";
import "./Modal.css";

const API_URL = process.env.REACT_APP_API_URL;

const CreateUserModal = ({ onClose, onSave }) => {
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [username, setUsername] = useState("");
    const [usernameAutogenerato, setUsernameAutogenerato] = useState(true);

    const [password, setPassword] = useState("");
    const [ruolo, setRuolo] = useState("");
    const [id_padre, setIdPadre] = useState("");

    const [usaAffiliazione, setUsaAffiliazione] = useState(false);
    const [nomePadre, setNomePadre] = useState("");
    const [cognomePadre, setCognomePadre] = useState("");
    const [error, setError] = useState("");

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const handleSave = async () => {
        try {
            // TODO : controlla se l'username esiste già

            if (!ruolo || !nome || !cognome || !username || !password) {
                alert("Compila tutti i campi");
                return;
            } 

            {error && <p className="form-error">{error}</p>}

            let id_padre_finale = null;

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

            // Step 1 – crea utente SENZA id_padre (per ora)
            const res = await fetch(`${API_URL}/api/crea_utente`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome,
                    cognome,
                    username: username,
                    password,
                    ruolo,
                    id_padre: id_padre_finale, // può essere null
                    admin_secret: "admin123",
                }),
            });

            if (!res.ok) throw new Error("Errore nella creazione utente");

            const newUser = await res.json();

            // Step 2 – se NON c'è affiliazione, aggiorna id_padre con se stesso
            if (!usaAffiliazione) {
                await fetch(`${API_URL}/api/aggiorna_utente/${newUser.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_padre: newUser.id,
                        admin_secret: "admin123",
                    }),
                });
            }

            onSave(newUser);
            onClose();
        } catch (err) {
            alert("Errore: " + err.message);
        }
    };

    useEffect(() => {
        if (usernameAutogenerato) {
            const nuovoUsername = removeAccents((nome + cognome).toLowerCase().replace(/\s+/g, ""));
            setUsername(nuovoUsername);
        }
    }, [nome, cognome]);

    return (
        <div className="modal-overlay">
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Crea Nuovo Utente</h2>
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
                <label>Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} />

                <label>Ruolo</label>
                <select value={ruolo} onChange={(e) => setRuolo(e.target.value)}>
                    <option value="">Seleziona ruolo</option>
                    <option value="utente">User</option>
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
                    <button
                        className="modal-save-button"
                        onClick={handleSave}
                        // disabled={!ruolo || !nome || !cognome || !username || !password}
                    >
                        Salva
                    </button>
                </div>
            </div>
        </div>
        
    );

    
    
};

export default CreateUserModal;
