import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/logo-lebrac.png";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [eventi, setEventi] = useState([]);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
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

  const handleLogout = () => {
    setLoggedInUser(null);
    setUsername("");
    setPassword("");
    setEventi([]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_URL}/ping`)
        .then(() => console.log("Ping backend... ✅"))
        .catch((err) => console.error("Errore nel ping:", err));
    }, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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

  if (loggedInUser) {
    return (
      <div className="container">
        <div className="card">
          <h2>Benvenuto, {loggedInUser.username}!</h2>
          <button className="button" onClick={handleLogout}>Logout</button>
          <h3>Eventi disponibili:</h3>
          <ul className="eventi">
            {eventi.map((ev) => (
              <li key={ev.id}>
                <span>{ev.nome}</span>
                <span>{ev.data}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <form className="card" onSubmit={handleLogin}>
        <img src={logo} alt="Logo" className="logo" />
        <h2>Accedi</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="button">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default App;