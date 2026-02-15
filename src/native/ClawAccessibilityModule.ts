import { NativeModules, Platform } from 'react-native';

const { ClawAccessibilityModule: NativeClawModule } = NativeModules;

interface ClawAccessibilityInterface {
  clickByText(text: string): Promise<boolean>;
  scrollDown(): Promise<boolean>;
  scrollUp(): Promise<boolean>;
  getScreenText(): Promise<string>;
  isServiceRunning(): Promise<boolean>;
}

const ClawAccessibilityModule: ClawAccessibilityInterface = {
  async clickByText(text: string): Promise<boolean> {
    if (Platform.OS !== 'android') {
      console.warn('Accessibility only works on Android');
      return false;
    }
    try {
      return await NativeClawModule.clickByText(text);
    } catch (e) {
      console.error('Error clicking by text:', e);
      return false;
    }
  },

  async scrollDown(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    try {
      return await NativeClawModule.scrollDown();
    } catch (e) {
      console.error('Error scrolling down:', e);
      return false;
    }
  },

  async scrollUp(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    try {
      return await NativeClawModule.scrollUp();
    } catch (e) {
      console.error('Error scrolling up:', e);
      return false;
    }
  },

  async getScreenText(): Promise<string> {
    if (Platform.OS !== 'android') return '';
    try {
      return await NativeClawModule.getScreenText();
    } catch (e) {
      console.error('Error getting screen text:', e);
      return '';
    }
  },

  async isServiceRunning(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    try {
      return await NativeClawModule.isServiceRunning();
    } catch (e) {
      console.error('Error checking service:', e);
      return false;
    }
  }
};

export default ClawAccessibilityModule;
