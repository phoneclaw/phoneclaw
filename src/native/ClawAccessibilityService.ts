import { Alert, Linking, Platform } from 'react-native';

const ANDROID_ACCESSIBILITY_SETTINGS = 'android.settings.ACCESSIBILITY_SETTINGS';

export class ClawAccessibilityService {
  static async openAccessibilitySettings(): Promise<void> {
    if (Platform.OS !== 'android') {
      Alert.alert('Error', 'Accessibility settings only available on Android');
      return;
    }
    await Linking.openSettings();
  }

  static async requestAccessibilityPermission(): Promise<void> {
    if (Platform.OS !== 'android') return;
    
    try {
      await Linking.openSettings();
    } catch (e) {
      Alert.alert(
        'Permission Required',
        'Please enable PhoneClaw accessibility service in Settings > Accessibility'
      );
    }
  }
}

export default ClawAccessibilityService;
