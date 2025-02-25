import React, { useEffect, useState, useRef } from 'react';
import { ScreenApp } from './utils/ScreenApp';
import './App.css';

// Define the ScreenApp type
interface ScreenAppInstance {
  mount: (selector: string) => Promise<void>;
  unMount: () => void;
}

interface ScreenAppConstructor {
  new (token: string, callback: (data: { id: string; url: string }) => void): ScreenAppInstance;
}

function App() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recordingData, setRecordingData] = useState<{ id: string; url: string } | null>(null);
  const screenAppRef = useRef<ScreenApp | null>(null);

  useEffect(() => {
    // Load ScreenApp script
    const loadScreenAppScript = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://dev.screenapp.io/app/plugin-6.20.12.bundle.js';
        script.async = true;
        
        const scriptLoadPromise = new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load ScreenApp script'));
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
      if (screenAppRef.current) {
        screenAppRef.current.unMount();
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

      screenAppRef.current = new ScreenApp(tokenValue, finishRecordingCallback);
      await screenAppRef.current.mount('#screen-app-plugin');
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

        <div id="screen-app-plugin" className="mt-4"></div>
      </div>
    </div>
  );
}

export default App;
