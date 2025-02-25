interface RecordingCallback {
  id: string;
  url: string;
}

export class ScreenApp {
  private apiKey: string;
  private finishRecordingCallback: (data: RecordingCallback) => void;
  private screenAppInstance: any = null;

  constructor(apiKey: string, finishRecordingCallback: (data: RecordingCallback) => void) {
    this.apiKey = apiKey;
    this.finishRecordingCallback = finishRecordingCallback;
  }

  async mount(selector: string): Promise<void> {
    try {
      if (!window.ScreenApp) {
        throw new Error('ScreenApp not loaded. Please ensure the script is loaded properly.');
      }

      console.log('Creating ScreenApp instance with token:', this.apiKey);
      this.screenAppInstance = new window.ScreenApp(this.apiKey, this.finishRecordingCallback);
      
      console.log('Mounting ScreenApp...');
      await this.screenAppInstance.mount(selector);
      console.log('ScreenApp mounted successfully');
    } catch (error) {
      console.error('Failed to mount ScreenApp:', error);
      throw error;
    }
  }

  unMount(): void {
    if (this.screenAppInstance) {
      this.screenAppInstance.unMount();
      this.screenAppInstance = null;
    }
  }
} 