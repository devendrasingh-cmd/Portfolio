import React, { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminApp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("portfolio_admin_token") || "");
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadDashboard(authToken) {
    const headers = { Authorization: `Bearer ${authToken}` };
    const [s, m] = await Promise.all([
      fetch(`${API}/api/admin/stats`, { headers }),
      fetch(`${API}/api/admin/messages`, { headers })
    ]);

    if (!s.ok || !m.ok) throw new Error("Dashboard data load nahi hua. Login dobara karein.");

    const statsData = await s.json();
    const messagesData = await m.json();

    setStats(statsData);
    setMessages(Array.isArray(messagesData) ? messagesData : messagesData.messages || []);
  }

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || "Login failed");

      const authToken = data.token || data.data?.token;
      if (!authToken) throw new Error("Login response mein token nahi mila.");

      localStorage.setItem("portfolio_admin_token", authToken);
      setToken(authToken);
      await loadDashboard(authToken);
    } catch (err) {
      setError(err.message);
      localStorage.removeItem("portfolio_admin_token");
      setToken("");
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    try {
      await loadDashboard(token);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteMessage(id) {
    if (!window.confirm("Delete this message?")) return;
    try {
      const response = await fetch(`${API}/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Delete failed");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    localStorage.removeItem("portfolio_admin_token");
    setToken("");
    setStats(null);
    setMessages([]);
  }

  React.useEffect(() => {
    if (token) {
      loadDashboard(token).catch(err => {
        setError(err.message);
        localStorage.removeItem("portfolio_admin_token");
        setToken("");
      });
    }
  }, []);

  const card = {
    background: "#111827", border: "1px solid #263449",
    borderRadius: 14, padding: 22
  };

  if (!token) return (
    <main style={{ minHeight: "100vh", background: "#080d18", color: "#fff", display: "grid", placeItems: "center", padding: 20, fontFamily: "Arial" }}>
      <form onSubmit={login} style={{ ...card, width: "100%", maxWidth: 400 }}>
        <h1 style={{ fontSize: 28 }}>Admin Login</h1>
        <p style={{ color: "#94a3b8" }}>Devendra Portfolio Dashboard</p>
        <label>Email</label>
        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={field} placeholder="Admin email" />
        <label>Password</label>
        <input required type="password" value={password} onChange={e => setPassword(e.target.value)} style={field} placeholder="Admin password" />
        {error && <p style={{ color: "#f87171" }}>{error}</p>}
        <button disabled={loading} style={button}>{loading ? "Please wait..." : "Login to Dashboard"}</button>
        <p><a href="/" style={{ color: "#7da8ff" }}>← Back to Portfolio</a></p>
      </form>
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#080d18", color: "#e5e7eb", padding: 30, fontFamily: "Arial" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div><h1 style={{ fontSize: 30 }}>Admin Dashboard</h1><p style={{ color: "#94a3b8" }}>Devendra Portfolio Management</p></div>
        <div><button onClick={refresh} style={button}>Refresh</button> <button onClick={logout} style={button}>Logout</button></div>
      </header>
      {error && <p style={{ color: "#f87171" }}>{error}</p>}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginTop: 28 }}>
        <div style={card}><p>Total Messages</p><h2>{stats?.totalMessages ?? stats?.messages ?? "—"}</h2></div>
        <div style={card}><p>Unread Messages</p><h2>{stats?.unreadMessages ?? stats?.unread ?? "—"}</h2></div>
        <div style={card}><p>Total Projects</p><h2>{stats?.totalProjects ?? stats?.projects ?? "—"}</h2></div>
      </section>
      <section style={{ ...card, marginTop: 25 }}>
        <h2>Contact Messages</h2>
        {messages.length === 0 ? <p style={{ color: "#94a3b8" }}>No messages found.</p> :
          messages.map((msg, i) => (
            <article key={msg._id || i} style={{ borderTop: "1px solid #263449", padding: 16 }}>
              <h3>{msg.name || "Visitor"} — {msg.subject || "No subject"}</h3>
              <p>{msg.email}</p>
              <p>{msg.message}</p>
              <button style={button} onClick={() => deleteMessage(msg._id)}>Delete</button>
            </article>
          ))
        }
      </section>
      <p style={{ marginTop: 25 }}><a href="/" style={{ color: "#7da8ff" }}>← View Portfolio</a></p>
    </main>
  );
}

const field = {
  display: "block", width: "100%", boxSizing: "border-box",
  padding: 13, margin: "10px 0 20px", borderRadius: 8,
  border: "1px solid #334155", background: "#080d18", color: "white"
};

const button = {
  padding: "12px 18px", border: 0, borderRadius: 8,
  background: "#3979ed", color: "white", cursor: "pointer", margin: "5px"
};
