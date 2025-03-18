import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

declare global {
  interface Window {
    ScreenApp: any;
    loadScreenApp: (token: string) => boolean;
    screenAppCallback: (data: { id: string; url: string }) => void;
    updateRecordingInfo: (id: string, url: string) => void;
    onScreenAppLoaded: () => void;
    onScreenAppError: (error: string) => void;
  }
}

const App = () => {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

  // Set up callbacks for the ScreenApp plugin
  useEffect(() => {
    // This will be called by the screenAppCallback function
    window.updateRecordingInfo = (id, url) => {
      console.log("Recording info received in React:", id, url);
      setRecordingId(id);
      setRecordingUrl(url);
      setLoading(false);
    };

    // This will be called when the script loads successfully
    window.onScreenAppLoaded = () => {
      console.log("ScreenApp plugin loaded successfully");
      setScriptLoaded(true);
      setErrorMessage("");
    };
    
    // This will be called if the script fails to load
    window.onScreenAppError = (error) => {
      console.error("ScreenApp plugin error:", error);
      setErrorMessage(error);
      setScriptLoaded(false);
    };
    
    return () => {
      // Clean up
      window.updateRecordingInfo = () => {};
      window.onScreenAppLoaded = () => {};
      window.onScreenAppError = () => {};
    };
  }, []);

  const handleStartRecording = () => {
    setLoading(true);
    setErrorMessage("");

    try {
      if (!token) {
        throw new Error("Please enter your ScreenApp token");
      }

      if (!scriptLoaded) {
        throw new Error("ScreenApp plugin is still loading. Please wait.");
      }

      if (typeof window.loadScreenApp !== 'function') {
        throw new Error("ScreenApp plugin initialization function not found.");
      }

      // Use the global function to start the recording
      const success = window.loadScreenApp(token);
      
      if (!success) {
        throw new Error("Failed to initialize ScreenApp. Please check your token and try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to start recording");
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

        <button 
          className="btn btn-primary w-100" 
          onClick={handleStartRecording} 
          disabled={loading || !scriptLoaded}
        >
          {loading ? "Loading..." : "Start Recording"}
        </button>

        {!scriptLoaded && !errorMessage && (
          <div className="alert alert-info mt-3">
            Loading ScreenApp plugin... Please wait.
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-danger mt-3">{errorMessage}</div>
        )}

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
