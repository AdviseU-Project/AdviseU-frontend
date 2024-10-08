import { useEffect, useState } from "react";
import "./App.css";
import Catalog from "./catalog";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch data from the Go backend
    fetch("/api/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>AdviseU Frontend</h1>
      <p>Message from backend: {message}</p>
      <Catalog />
    </div>
  );
}

export default App;
