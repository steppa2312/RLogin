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
    setError(""); // Reset errore precedente

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
      setError("Impossibile connettersi al server. Riprova più tardi.");
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      fetch(`${API_URL}/api/eventi`)
        .then((res) => res.json())
        .then((data) => setEventi(data))
        .catch((err) => {
          console.error("Errore nel caricamento eventi:", err);
          setError("Errore nel caricamento degli eventi.");
        });
    }
  }, [loggedInUser]);

  if (!loggedInUser) {
    return (
      <div className="login">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Accedi</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="eventi">
      <h2>Benvenuto, {loggedInUser.username}</h2>
      <h3>Eventi disponibili:</h3>
      <ul>
        {eventi.map((ev) => (
          <li key={ev.id}>
            {ev.nome} – {ev.data}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
