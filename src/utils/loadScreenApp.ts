export const loadScreenAppScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.ScreenApp) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'screenapp-script';
    script.src = 'https://dev.screenapp.io/app/plugin-6.20.12.bundle.js';
    script.async = true;

    script.onload = () => {
      if (window.ScreenApp) {
        resolve();
      } else {
        reject(new Error('ScreenApp script loaded but window.ScreenApp is undefined'));
      }
    };

    script.onerror = () => reject(new Error('Failed to load ScreenApp script'));
    document.body.appendChild(script);
  });
}; 