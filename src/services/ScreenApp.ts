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
      if (!window.ScreenApp) {
        throw new Error("ScreenApp library not loaded.");
      }

      this.screenAppInstance = new window.ScreenApp(this.token, this.finishRecordingCallback);
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