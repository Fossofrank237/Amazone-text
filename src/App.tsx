import { useState, useEffect } from "react";

const COGNITO_DOMAIN = "https://us-east-1tpmt1ec3o.auth.us-east-1.amazoncognito.com";
const CLIENT_ID = "4ulgo15t8o7di360fkqbvakp1i";
const REDIRECT_URI = window.location.hostname === "localhost" 
  ? "http://localhost:5173"
  : "https://main.d2o8nxbqumoodt.amplifyapp.com";
const API_URL = "https://k4ujrcupa8.execute-api.us-east-1.amazonaws.com/dev";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Récupère le token depuis l'URL après redirect Cognito
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.replace("#", "?"));
      const accessToken = params.get("access_token");
      if (accessToken) {
        setToken(accessToken);
        window.history.replaceState({}, "", "/");
      }
    } else {
      const saved = sessionStorage.getItem("token");
      if (saved) setToken(saved);
    }
  }, []);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
      fetchMessages();
    }
  }, [token]);

  const login = () => {
    window.location.href = `${COGNITO_DOMAIN}/login?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=email+openid+profile`;
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
    window.location.href = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${REDIRECT_URI}`;
  };

  const fetchMessages = async () => {
    const res = await fetch(`${API_URL}/bonjour`);
    const data = await res.json();
    setMessages(data.messages || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await fetch(`${API_URL}/bonjour`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newMessage }),
    });
    setNewMessage("");
    await fetchMessages();
  };

  if (!token) return (
    <div style={{ maxWidth: "400px", margin: "4rem auto", textAlign: "center", padding: "2rem", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", borderRadius: "8px" }}>
      <h1>📝 Mes Messages AWS</h1>
      <p>Connecte-toi pour accéder à tes messages</p>
      <button onClick={login} style={{ padding: "12px 24px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" }}>
        🔐 Se connecter avec Cognito
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>📝 Mes Messages AWS</h1>
        <button onClick={logout} style={{ padding: "8px 16px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Déconnexion
        </button>
      </div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "2rem" }}>
        <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Écris un message..." style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
        <button onClick={sendMessage} style={{ padding: "8px 16px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Envoyer</button>
      </div>
      {messages.length === 0 ? (
        <p style={{ color: "#888" }}>Aucun message pour l'instant...</p>
      ) : (
        messages.map(msg => (
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