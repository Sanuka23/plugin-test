import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

declare global {
  interface Window {
    ScreenApp: any;
    loadScreenApp: (token: string) => void;
    updateRecordingInfo: (id: string, url: string) => void;
  }
}

const App = () => {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  // Register the callback for the screenAppCallback function
  useEffect(() => {
    window.updateRecordingInfo = (id, url) => {
      console.log("Recording info received:", id, url);
      setRecordingId(id);
      setRecordingUrl(url);
    };
  }, []);

  const handleStartRecording = () => {
    setLoading(true);
    setErrorMessage("");

    try {
      if (!token) {
        throw new Error("Please enter your ScreenApp token");
      }

      if (typeof window.ScreenApp !== 'function') {
        console.error("ScreenApp not loaded correctly. Current type:", typeof window.ScreenApp);
        throw new Error("ScreenApp is not loaded correctly. Please refresh the page and try again.");
      }

      if (typeof window.loadScreenApp !== 'function') {
        console.error("loadScreenApp function not found");
        throw new Error("Plugin initialization function not found. Please refresh the page.");
      }

      // Use the global function from index.html
      window.loadScreenApp(token);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to start recording");
    } finally {
      setLoading(false);
    }
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
    // Clear any previous recording info when changing token
    setRecordingId(null);
    setRecordingUrl(null);
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
            onChange={handleTokenChange}
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
      </div>
    </div>
  );
};

export default App;
