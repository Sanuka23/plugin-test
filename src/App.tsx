import { useState, useEffect, useRef, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ScreenApp from "./services/ScreenApp";

declare global {
  interface Window {
    ScreenApp: {
      new (token: string, callback: (data: { id: string; url: string }) => void): {
        mount: (selector: string) => Promise<void>;
        unMount: () => void;
      };
    };
  }
}

const App = () => {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const screenAppRef = useRef<ScreenApp | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get("token");
    if (tokenFromURL) {
      setToken(tokenFromURL);
    }
  }, []);

  const loadScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector("script[src='https://dev.screenapp.io/app/plugin-6.20.17.bundle.js']");
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://dev.screenapp.io/app/plugin-6.20.17.bundle.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load script"));
      document.body.appendChild(script);
    });
  }, []);

  const finishRecordingCallback = useCallback(({ id, url }: { id: string; url: string }) => {
    setRecordingId(id);
    setRecordingUrl(url);
  }, []);

  const handleLoadPlugin = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      if (!token) {
        throw new Error("Token is required to load the plugin.");
      }

      await loadScript();
      
      if (!window.ScreenApp) {
        throw new Error("ScreenApp script failed to load.");
      }

      screenAppRef.current = new ScreenApp(token, finishRecordingCallback);
      await screenAppRef.current.mount("#screenapp-plugin");

      // Simulate successful recording for testing
      setRecordingId("test-123");
      setRecordingUrl("https://example.com/recording");
    } catch (error) {
      console.error("Error loading plugin:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to load plugin");
    } finally {
      setLoading(false);
    }
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

        <button className="btn btn-primary w-100" onClick={handleLoadPlugin} disabled={loading}>
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
