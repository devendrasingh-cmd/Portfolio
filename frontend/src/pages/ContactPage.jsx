import React, { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const response = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || "Message send failed");
      setStatus("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#080d18", color: "white", padding: 30, fontFamily: "Arial" }}>
      <div style={{ maxWidth: 600, margin: "50px auto" }}>
        <a href="/" style={{ color: "#7da8ff" }}>← Back to Portfolio</a>
        <h1 style={{ fontSize: 36 }}>Contact Me</h1>
        <p style={{ color: "#94a3b8" }}>Send me a message.</p>
        <form onSubmit={submit}>
          {["name", "email", "subject"].map(key => (
            <input key={key} required name={key} type={key === "email" ? "email" : "text"}
              placeholder={key[0].toUpperCase() + key.slice(1)} value={form[key]} onChange={update}
              style={field} />
          ))}
          <textarea required name="message" placeholder="Your message" value={form.message}
            onChange={update} style={{ ...field, minHeight: 140 }} />
          <button style={button}>Send Message</button>
          <p>{status}</p>
        </form>
      </div>
    </main>
  );
}

const field = {
  display: "block", width: "100%", boxSizing: "border-box",
  padding: 14, margin: "12px 0", borderRadius: 8,
  border: "1px solid #334155", background: "#111827", color: "white"
};
const button = {
  padding: "13px 20px", border: 0, borderRadius: 8,
  background: "#3979ed", color: "white", cursor: "pointer"
};
