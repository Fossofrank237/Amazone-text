import { useState, useEffect } from "react";

const S3_URL = "https://aws-test-new-app.s3.amazonaws.com";
const API_URL = "https://k4ujrcupa8.execute-api.us-east-1.amazonaws.com";

function App() {
  const [message, setMessage] = useState("Chargement...");
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/bonjour`)
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setTimestamp(data.timestamp);
      })
      .catch(() => setMessage("Erreur de connexion à l'API"));
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Bienvenue Frank !</h1>

      {/* Image depuis S3 */}
      <img
        src={`${S3_URL}/hero.png`}
        alt="Hero depuis S3"
        style={{ width: "300px", borderRadius: "8px" }}
      />

      {/* Message depuis Lambda */}
      <div style={{
        marginTop: "2rem",
        padding: "1rem",
        background: "#f0f0f0",
        borderRadius: "8px"
      }}>
        <h2>Message depuis Lambda :</h2>
        <p style={{ fontSize: "1.2rem", color: "#333" }}>{message}</p>
        <small style={{ color: "#888" }}>{timestamp}</small>
      </div>
    </div>
  );
}

export default App;