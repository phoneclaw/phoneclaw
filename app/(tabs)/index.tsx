import { Image } from 'expo-image';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ClawAccessibilityModule from '@/src/native/ClawAccessibilityModule';
import { ClawAccessibilityService } from '@/src/native/ClawAccessibilityService';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const [screenText, setScreenText] = useState('');
  const [serviceRunning, setServiceRunning] = useState(false);

  const checkServiceStatus = async () => {
    const running = await ClawAccessibilityModule.isServiceRunning();
    setServiceRunning(running);
  };

  const handleOpenSettings = async () => {
    await ClawAccessibilityService.openAccessibilitySettings();
  };

  const handleScrollDown = async () => {
    const result = await ClawAccessibilityModule.scrollDown();
    console.log('Scroll down result:', result);
  };

  const handleScrollUp = async () => {
    const result = await ClawAccessibilityModule.scrollUp();
    console.log('Scroll up result:', result);
  };

  const handleReadScreen = async () => {
    const text = await ClawAccessibilityModule.getScreenText();
    setScreenText(text.slice(0, 500)); // Limit display
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Accessibility Controls Section */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Accessibility Controls</ThemedText>
        <ThemedText>
          Service Status: {serviceRunning ? '✅ Running' : '❌ Not Running'}
        </ThemedText>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={checkServiceStatus}>
            <Text style={styles.buttonText}>Check Status</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleOpenSettings}>
            <Text style={styles.buttonText}>Open Settings</Text>
          </Pressable>
        </View>
      </ThemedView>

      {/* Automation Controls */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Automation Controls</ThemedText>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleScrollUp}>
            <Text style={styles.buttonText}>⬆️ Scroll Up</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleScrollDown}>
            <Text style={styles.buttonText}>⬇️ Scroll Down</Text>
          </Pressable>
        </View>
        <Pressable style={styles.button} onPress={handleReadScreen}>
          <Text style={styles.buttonText}>📖 Read Screen</Text>
        </Pressable>
        {screenText ? (
          <View style={styles.textContainer}>
            <ThemedText type="defaultSemiBold">Screen Text (first 500 chars):</ThemedText>
            <Text style={styles.screenText}>{screenText}</Text>
          </View>
        ) : null}
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  textContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  screenText: {
    fontSize: 12,
    marginTop: 4,
  },
});
