import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [eventi, setEventi] = useState([]);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // reset eventuali errori
  
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Errore di autenticazione.");
        return;
      }
  
      const data = await res.json();
      setLoggedInUser(data);
    } catch (err) {
      console.error("Errore di rete:", err);
      setError("Impossibile connettersi al server. Controlla che sia attivo.");
    }
  };  
}

export default App;