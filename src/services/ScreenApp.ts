interface ScreenAppInstance {
  mount: (selector: string) => Promise<void>;
  unMount: () => void;
}

export default class ScreenApp {
  private token: string;
  private parentElementSelector?: string;
  private finishRecordingCallback: (data: { id: string; url: string }) => void;
  private screenAppInstance?: ScreenAppInstance;

  constructor(
    token: string,
    finishRecordingCallback: (data: { id: string; url: string }) => void
  ) {
    this.token = token;
    this.finishRecordingCallback = finishRecordingCallback;
  }

  async mount(parentElementSelector: string): Promise<void> {
    this.parentElementSelector = parentElementSelector || "#screenapp-plugin";

    try {
      if (typeof window.ScreenApp !== 'function') {
        console.error('ScreenApp is not a constructor:', typeof window.ScreenApp);
        throw new Error("ScreenApp constructor not found. Make sure the script is loaded.");
      }

      // Create a new instance of ScreenApp
      try {
        this.screenAppInstance = new window.ScreenApp(this.token, this.finishRecordingCallback);
      } catch (err) {
        console.error('Error creating ScreenApp instance:', err);
        throw new Error("Failed to create ScreenApp instance. Please check your token and try again.");
      }
      
      if (!this.screenAppInstance) {
        throw new Error("Failed to create ScreenApp instance.");
      }
      
      await this.screenAppInstance.mount(this.parentElementSelector);
    } catch (error) {
      console.error("Error mounting plugin:", error);
      throw error;
    }
  }

  unMount(): void {
    if (this.screenAppInstance) {
      this.screenAppInstance.unMount();
    }
  }
} 