import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

declare global {
  interface Window {
    ScreenApp: {
      new (token: string, callback: (data: { id: string; url: string }) => void): {
        mount: (selector: string) => Promise<void>;
      };
    };
  }
}

const App = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get("token");
    if (tokenFromURL) {
      setToken(tokenFromURL);
      loadPlugin(tokenFromURL);
    }
  }, []);

  const loadPlugin = async (tokenValue: string) => {
    setLoading(true);
    setErrorMessage("");

    try {
      if (!tokenValue) {
        throw new Error("Token is required to load the plugin.");
      }

      console.log("Initializing ScreenApp with token:", tokenValue);
      const screenAppInstance = new window.ScreenApp(tokenValue, finishRecordingCallback);
      await screenAppInstance.mount("#screenapp-plugin");

      console.log("ScreenApp successfully loaded.");
    } catch (error: unknown) {
      console.error("Error loading plugin:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load plugin";
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const finishRecordingCallback = ({ id, url }: { id: string; url: string }) => {
    setRecordingId(id);
    setRecordingUrl(url);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#181818" }}>
      <div className="card p-4" style={{ background: "rgba(30,30,30,0.9)", color: "#e0e0e0", maxWidth: "500px" }}>
        <h2 className="text-center">ScreenApp Plugin Demo</h2>

        <div className="mb-3">
          <label className="form-label">Enter Your Token:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-100" onClick={() => loadPlugin(token)} disabled={loading}>
          {loading ? "Loading..." : "Load Plugin"}
        </button>

        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

        {recordingId && (
          <div className="mt-4">
            <h5>Recording Info</h5>
            <p><strong>ID:</strong> {recordingId}</p>
            <p>
              <strong>URL:</strong> <a href={recordingUrl!} target="_blank" rel="noopener noreferrer">{recordingUrl}</a>
            </p>
          </div>
        )}

        <div id="screenapp-plugin" className="mt-4"></div>
      </div>
    </div>
  );
};

export default App;
