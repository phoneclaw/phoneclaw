import { NativeModules, Platform } from 'react-native';

const { ClawAccessibilityModule: NativeClawModule } = NativeModules;

interface ClawAccessibilityInterface {
  // Touch actions
  tap(x: number, y: number): Promise<boolean>;
  longPress(x: number, y: number): Promise<boolean>;
  swipe(x1: number, y1: number, x2: number, y2: number, duration: number): Promise<boolean>;
  doubleTap(x: number, y: number): Promise<boolean>;

  // Text input
  typeText(text: string): Promise<boolean>;
  clearText(): Promise<boolean>;

  // Element interaction
  clickByText(text: string): Promise<boolean>;
  clickByViewId(viewId: string): Promise<boolean>;

  // Navigation
  pressBack(): Promise<boolean>;
  pressHome(): Promise<boolean>;
  openRecents(): Promise<boolean>;
  openNotifications(): Promise<boolean>;
  scrollUp(): Promise<boolean>;
  scrollDown(): Promise<boolean>;

  // Screen reading
  getScreenText(): Promise<string>;
  getUITree(): Promise<string>;
  takeScreenshot(): Promise<string>;
  getCurrentApp(): Promise<string>;

  // App management
  launchApp(packageName: string): Promise<boolean>;

  // Service status
  isServiceRunning(): Promise<boolean>;
}

// Helper to create a safe Android-only wrapper
function androidOnly<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  if (Platform.OS !== 'android') return Promise.resolve(fallback);
  return fn().catch((e) => {
    console.error('[ClawAccessibility]', e);
    return fallback;
  });
}

const ClawAccessibilityModule: ClawAccessibilityInterface = {
  // ─── Touch Actions ──────────────────────────────────────────────
  tap: (x, y) => androidOnly(false, () => NativeClawModule.tap(x, y)),
  longPress: (x, y) => androidOnly(false, () => NativeClawModule.longPress(x, y)),
  swipe: (x1, y1, x2, y2, duration) =>
    androidOnly(false, () => NativeClawModule.swipe(x1, y1, x2, y2, duration)),
  doubleTap: (x, y) => androidOnly(false, () => NativeClawModule.doubleTap(x, y)),

  // ─── Text Input ─────────────────────────────────────────────────
  typeText: (text) => androidOnly(false, () => NativeClawModule.typeText(text)),
  clearText: () => androidOnly(false, () => NativeClawModule.clearText()),

  // ─── Element Interaction ────────────────────────────────────────
  clickByText: (text) => androidOnly(false, () => NativeClawModule.clickByText(text)),
  clickByViewId: (viewId) => androidOnly(false, () => NativeClawModule.clickByViewId(viewId)),

  // ─── Navigation ─────────────────────────────────────────────────
  pressBack: () => androidOnly(false, () => NativeClawModule.pressBack()),
  pressHome: () => androidOnly(false, () => NativeClawModule.pressHome()),
  openRecents: () => androidOnly(false, () => NativeClawModule.openRecents()),
  openNotifications: () => androidOnly(false, () => NativeClawModule.openNotifications()),
  scrollUp: () => androidOnly(false, () => NativeClawModule.scrollUp()),
  scrollDown: () => androidOnly(false, () => NativeClawModule.scrollDown()),

  // ─── Screen Reading ─────────────────────────────────────────────
  getScreenText: () => androidOnly('', () => NativeClawModule.getScreenText()),
  getUITree: () => androidOnly('{}', () => NativeClawModule.getUITree()),
  takeScreenshot: () => androidOnly('', () => NativeClawModule.takeScreenshot()),
  getCurrentApp: () => androidOnly('', () => NativeClawModule.getCurrentApp()),

  // ─── App Management ─────────────────────────────────────────────
  launchApp: (packageName) => androidOnly(false, () => NativeClawModule.launchApp(packageName)),

  // ─── Service Status ─────────────────────────────────────────────
  isServiceRunning: () => androidOnly(false, () => NativeClawModule.isServiceRunning()),
};

export default ClawAccessibilityModule;

