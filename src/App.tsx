import { useState, useEffect } from "react";

const API_URL = "https://k4ujrcupa8.execute-api.us-east-1.amazonaws.com";

function App() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Charger les messages depuis DynamoDB
  const fetchMessages = async () => {
    const res = await fetch(`${API_URL}/bonjour`);
    const data = await res.json();
    setMessages(data.messages || []);
  };

  // Envoyer un message vers DynamoDB
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    await fetch(`${API_URL}/bonjour`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newMessage }),
    });
    setNewMessage("");
    await fetchMessages();
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h1>📝 Mes Messages AWS</h1>

      {/* Formulaire */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "2rem" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écris un message..."
          style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ padding: "8px 16px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {loading ? "..." : "Envoyer"}
        </button>
      </div>

      {/* Liste des messages */}
      {messages.length === 0 ? (
        <p style={{ color: "#888" }}>Aucun message pour l'instant...</p>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} style={{ padding: "1rem", background: "#f5f5f5", borderRadius: "8px", marginBottom: "8px" }}>
            <p style={{ margin: 0 }}>{msg.message}</p>
            <small style={{ color: "#888" }}>{new Date(msg.timestamp).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default App;