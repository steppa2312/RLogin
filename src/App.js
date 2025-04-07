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
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.success) {
      setLoggedInUser(data);
      setError("");
    } else {
      setError(data.message);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      fetch(`${API_URL}/api/eventi`)
        .then((res) => res.json())
        .then((data) => setEventi(data));
    }
  }, [loggedInUser]);

  if (!loggedInUser) {
    return (
      <div className="login">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit">Accedi</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    );
  }

  return (
    <div className="eventi">
      <h2>Benvenuto, {loggedInUser.username}</h2>
      <h3>Eventi disponibili:</h3>
      <ul>
        {eventi.map(ev => (
          <li key={ev.id}>{ev.nome} – {ev.data}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;