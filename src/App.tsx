import React, { useEffect, useState } from 'react';
import './App.css';

// Define the ScreenApp type
interface ScreenAppInstance {
  mount: (selector: string) => Promise<void>;
  unMount: () => void;
}

interface ScreenAppConstructor {
  new (token: string, callback: (data: { id: string; url: string }) => void): ScreenAppInstance;
}

declare global {
  interface Window {
    ScreenApp: ScreenAppConstructor;
  }
}

function App() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recordingData, setRecordingData] = useState<{ id: string; url: string } | null>(null);
  const [screenAppInstance, setScreenAppInstance] = useState<ScreenAppInstance | null>(null);

  useEffect(() => {
    // Load ScreenApp script
    const loadScreenAppScript = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://dev.screenapp.io/app/plugin-6.20.12.bundle.js';
        script.async = true;
        
        // Create a promise to wait for script load
        const scriptLoadPromise = new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });

        document.body.appendChild(script);
        await scriptLoadPromise;

        // Get token from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        if (urlToken) {
          setToken(urlToken);
          await loadPlugin(urlToken);
        }
      } catch (err) {
        console.error('Failed to load ScreenApp script:', err);
        setError('Failed to load ScreenApp plugin');
      }
    };

    loadScreenAppScript();

    return () => {
      // Cleanup
      if (screenAppInstance) {
        screenAppInstance.unMount();
      }
    };
  }, []);

  const finishRecordingCallback = (data: { id: string; url: string }) => {
    setRecordingData(data);
  };

  const loadPlugin = async (tokenValue: string) => {
    setError('');
    setLoading(true);

    try {
      if (!tokenValue) {
        throw new Error('Token is required to load the plugin.');
      }

      if (!window.ScreenApp) {
        throw new Error('ScreenApp plugin not loaded properly.');
      }

      console.log('Creating ScreenApp instance with token:', tokenValue);
      const instance = new window.ScreenApp(tokenValue, finishRecordingCallback);
      setScreenAppInstance(instance);
      
      console.log('Mounting ScreenApp...');
      await instance.mount('#screenapp-plugin');
      
      console.log('ScreenApp mounted successfully');
    } catch (err) {
      console.error('Plugin initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize plugin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-center mb-4">ScreenApp Plugin Demo</h2>

        <div id="tokenInputSection" className={recordingData ? 'hidden' : ''}>
          <form id="pluginForm" onSubmit={(e) => {
            e.preventDefault();
            loadPlugin(token);
          }}>
            <div className="mb-3">
              <label htmlFor="token" className="form-label">Enter Your Token:</label>
              <input
                type="text"
                className="form-control"
                id="token"
                name="token"
                placeholder="Enter your token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-custom"
              id="loadButton"
              disabled={loading}
            >
              Load Plugin
            </button>
          </form>

          {loading && (
            <div className="alert alert-info mt-3" role="alert">
              Initializing plugin...
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}
        </div>

        {recordingData && (
          <div id="callbackOutputSection" className="mt-4">
            <div className="mb-3">
              <label className="form-label">Recording ID:</label>
              <span id="recID" className="form-control-plaintext">{recordingData.id}</span>
            </div>
            <div className="mb-3">
              <label className="form-label">Recording URL:</label>
              <a href={recordingData.url} id="url" target="_blank" rel="noopener noreferrer" className="form-control-plaintext">
                {recordingData.url}
              </a>
            </div>
          </div>
        )}

        <div id="screenapp-plugin" className="mt-4"></div>
      </div>
    </div>
  );
}

export default App;
