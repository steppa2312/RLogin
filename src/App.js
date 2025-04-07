import React, { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulazione credenziali
    const validEmail = "admin";
    const validPassword = "admin";

    if (email === validEmail && password === validPassword) {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Email o password errate.");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  if (loggedIn) {
    return (
      <div className="container">
        <div className="card">
          <h2>Benvenuto, {email}!</h2>
          <button className="button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <form className="card" onSubmit={handleLogin}>
        <h2>Accedi</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
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
