import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

declare global {
  interface Window {
    ScreenApp: any;
    loadScreenApp: (token: string) => void;
    screenAppCallback: (data: { id: string; url: string }) => void;
  }
}

const App = () => {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  // Override the global callback to update our state
  useEffect(() => {
    const originalCallback = window.screenAppCallback;
    
    window.screenAppCallback = ({ id, url }: { id: string; url: string }) => {
      // Call the original callback
      if (originalCallback) {
        originalCallback({ id, url });
      }
      
      // Update our state
      setRecordingId(id);
      setRecordingUrl(url);
    };
    
    // Cleanup
    return () => {
      window.screenAppCallback = originalCallback;
    };
  }, []);

  const handleStartRecording = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      if (!token) {
        throw new Error("Please enter your ScreenApp token");
      }

      if (!window.loadScreenApp) {
        throw new Error("ScreenApp script failed to load.");
      }

      // Use the global function from index.html
      window.loadScreenApp(token);
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
          <label className="form-label">Your ScreenApp Token:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your token (e.g., 67d9560fea74f53d0e986a99)"
            value={token}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
          />
        </div>

        <p className="text-center mb-4">
          Click the button below to start recording your screen and audio.
        </p>

        <button className="btn btn-primary w-100" onClick={handleStartRecording} disabled={loading}>
          {loading ? "Loading..." : "Start Recording"}
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
