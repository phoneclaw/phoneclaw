import { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import ClawAccessibilityModule from '@/src/native/ClawAccessibilityModule';

type LogEntry = {
  id: number;
  tool: string;
  result: string;
  success: boolean;
  timestamp: string;
};

let logId = Date.now();

export default function ToolTestScreen() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [tapX, setTapX] = useState('540');
  const [tapY, setTapY] = useState('1200');
  const [typeInput, setTypeInput] = useState('Hello PhoneClaw!');
  const [packageInput, setPackageInput] = useState('com.whatsapp');
  const [clickTextInput, setClickTextInput] = useState('Settings');
  const [viewIdInput, setViewIdInput] = useState('com.whatsapp:id/send');

  const addLog = useCallback((tool: string, result: any, success: boolean) => {
    const entry: LogEntry = {
      id: ++logId,
      tool,
      result: typeof result === 'string' ? result.slice(0, 600) : JSON.stringify(result),
      success,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [entry, ...prev].slice(0, 30));
  }, []);

  const run = useCallback(
    async (tool: string, fn: () => Promise<any>) => {
      try {
        const result = await fn();
        addLog(tool, result, !!result);
      } catch (e: any) {
        addLog(tool, e.message || 'Error', false);
      }
    },
    [addLog]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🐾 Tool Tester</Text>
        <Pressable style={styles.clearBtn} onPress={() => setLogs([])}>
          <Text style={styles.clearBtnText}>Clear</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Service Status ─── */}
        <Text style={styles.sectionTitle}>⚙️ Service</Text>
        <View style={styles.row}>
          <Btn label="Check Status" emoji="🔍" onPress={() => run('isServiceRunning', ClawAccessibilityModule.isServiceRunning)} />
          <Btn label="Current App" emoji="📱" onPress={() => run('getCurrentApp', ClawAccessibilityModule.getCurrentApp)} />
        </View>

        {/* ─── Navigation ─── */}
        <Text style={styles.sectionTitle}>🧭 Navigation</Text>
        <View style={styles.row}>
          <Btn label="Back" emoji="◀️" onPress={() => run('pressBack', ClawAccessibilityModule.pressBack)} />
          <Btn label="Home" emoji="🏠" onPress={() => run('pressHome', ClawAccessibilityModule.pressHome)} />
          <Btn label="Recents" emoji="📋" onPress={() => run('openRecents', ClawAccessibilityModule.openRecents)} />
          <Btn label="Notifs" emoji="🔔" onPress={() => run('openNotifications', ClawAccessibilityModule.openNotifications)} />
        </View>

        {/* ─── Scrolling ─── */}
        <Text style={styles.sectionTitle}>📜 Scroll</Text>
        <View style={styles.row}>
          <Btn label="Scroll Up" emoji="⬆️" onPress={() => run('scrollUp', ClawAccessibilityModule.scrollUp)} />
          <Btn label="Scroll Down" emoji="⬇️" onPress={() => run('scrollDown', ClawAccessibilityModule.scrollDown)} />
        </View>

        {/* ─── Touch Actions ─── */}
        <Text style={styles.sectionTitle}>👆 Touch</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={tapX}
            onChangeText={setTapX}
            placeholder="X"
            keyboardType="numeric"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={tapY}
            onChangeText={setTapY}
            placeholder="Y"
            keyboardType="numeric"
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.row}>
          <Btn
            label="Tap"
            emoji="👇"
            onPress={() => run('tap', () => ClawAccessibilityModule.tap(Number(tapX), Number(tapY)))}
          />
          <Btn
            label="Long Press"
            emoji="👇⏳"
            onPress={() => run('longPress', () => ClawAccessibilityModule.longPress(Number(tapX), Number(tapY)))}
          />
          <Btn
            label="Double Tap"
            emoji="👇👇"
            onPress={() => run('doubleTap', () => ClawAccessibilityModule.doubleTap(Number(tapX), Number(tapY)))}
          />
        </View>
        <View style={styles.row}>
          <Btn
            label="Swipe Down"
            emoji="👆⬇️"
            onPress={() =>
              run('swipe', () => ClawAccessibilityModule.swipe(540, 800, 540, 1600, 300))
            }
          />
          <Btn
            label="Swipe Up"
            emoji="👆⬆️"
            onPress={() =>
              run('swipe', () => ClawAccessibilityModule.swipe(540, 1600, 540, 800, 300))
            }
          />
        </View>

        {/* ─── Text Input ─── */}
        <Text style={styles.sectionTitle}>⌨️ Text Input</Text>
        <TextInput
          style={[styles.input, { flex: 0, width: '100%' }]}
          value={typeInput}
          onChangeText={setTypeInput}
          placeholder="Text to type..."
          placeholderTextColor="#888"
        />
        <View style={styles.row}>
          <Btn
            label="Type Text"
            emoji="⌨️"
            onPress={() => run('typeText', () => ClawAccessibilityModule.typeText(typeInput))}
          />
          <Btn label="Clear Text" emoji="🗑️" onPress={() => run('clearText', ClawAccessibilityModule.clearText)} />
        </View>

        {/* ─── Screen Reading ─── */}
        <Text style={styles.sectionTitle}>👁️ Screen Reading</Text>
        <View style={styles.row}>
          <Btn label="Read Screen" emoji="📖" onPress={() => run('getScreenText', ClawAccessibilityModule.getScreenText)} />
          <Btn
            label="UI Tree"
            emoji="🌳"
            onPress={() =>
              run('getUITree', async () => {
                const tree = await ClawAccessibilityModule.getUITree();
                try {
                  const parsed = JSON.parse(tree);
                  console.log('=== FULL UI TREE ===');
                  console.log(JSON.stringify(parsed, null, 2));
                  const nodes = parsed.nodes || [];
                  const ids = nodes
                    .filter((n: any) => n.viewId)
                    .map((n: any) => n.viewId)
                    .join('\n');
                  return ids || 'No viewIds found (React Native apps don\'t have them — use clickByText instead)';
                } catch {
                  return tree;
                }
              })
            }
          />
          <Btn label="Screenshot" emoji="📸" onPress={() =>
            run('takeScreenshot', async () => {
              const b64 = await ClawAccessibilityModule.takeScreenshot();
              return b64 ? `✅ ${b64.length} chars base64` : 'empty';
            })
          } />
        </View>

        {/* ─── App Management ─── */}
        <Text style={styles.sectionTitle}>🚀 App Launch</Text>
        <TextInput
          style={[styles.input, { flex: 0, width: '100%' }]}
          value={packageInput}
          onChangeText={setPackageInput}
          placeholder="com.example.app"
          placeholderTextColor="#888"
        />
        <View style={styles.row}>
          <Btn
            label="Launch App"
            emoji="🚀"
            onPress={() => run('launchApp', () => ClawAccessibilityModule.launchApp(packageInput))}
          />
        </View>

        {/* ─── Click by Text ─── */}
        <Text style={styles.sectionTitle}>🖱️ Click by Text</Text>
        <TextInput
          style={[styles.input, { flex: 0, width: '100%' }]}
          value={clickTextInput}
          onChangeText={setClickTextInput}
          placeholder="Text visible on screen..."
          placeholderTextColor="#888"
        />
        <View style={styles.row}>
          <Btn
            label="Click by Text"
            emoji="🔘"
            onPress={() => run('clickByText', () => ClawAccessibilityModule.clickByText(clickTextInput))}
          />
        </View>

        {/* ─── Click by View ID ─── */}
        <Text style={styles.sectionTitle}>🏷️ Click by View ID</Text>
        <Text style={{ color: '#666', fontSize: 11, marginBottom: 4 }}>Format: com.package:id/view_name (find via getUITree)</Text>
        <TextInput
          style={[styles.input, { flex: 0, width: '100%' }]}
          value={viewIdInput}
          onChangeText={setViewIdInput}
          placeholder="com.whatsapp:id/send"
          placeholderTextColor="#888"
        />
        <View style={styles.row}>
          <Btn
            label="Click by View ID"
            emoji="🏷️"
            onPress={() => run('clickByViewId', () => ClawAccessibilityModule.clickByViewId(viewIdInput))}
          />
        </View>

        {/* ─── Logs ─── */}
        <Text style={styles.sectionTitle}>📋 Log ({logs.length})</Text>
        {logs.map((log) => (
          <View
            key={log.id}
            style={[styles.logEntry, { borderLeftColor: log.success ? '#34C759' : '#FF3B30' }]}
          >
            <View style={styles.logHeader}>
              <Text style={styles.logTool}>{log.tool}</Text>
              <Text style={styles.logTime}>{log.timestamp}</Text>
            </View>
            <Text style={styles.logResult} numberOfLines={12}>
              {log.result}
            </Text>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function Btn({ label, emoji, onPress }: { label: string; emoji: string; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      onPress={onPress}
    >
      <Text style={styles.btnEmoji}>{emoji}</Text>
      <Text style={styles.btnLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  clearBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
  },
  clearBtnText: {
    color: '#FF6B6B',
    fontWeight: '600',
    fontSize: 13,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#aaa',
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 8,
  },
  btn: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  btnPressed: {
    backgroundColor: '#2A2A2A',
    borderColor: '#444',
  },
  btnEmoji: {
    fontSize: 16,
  },
  btnLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  logEntry: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logTool: {
    color: '#7CB3FF',
    fontWeight: '700',
    fontSize: 13,
  },
  logTime: {
    color: '#666',
    fontSize: 11,
  },
  logResult: {
    color: '#ccc',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
