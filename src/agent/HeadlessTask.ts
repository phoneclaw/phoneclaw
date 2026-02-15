import { AppRegistry, DeviceEventEmitter } from 'react-native';

const HeadlessTask = async (data: any) => {
    // console.log('[PhoneClaw] Headless Task running', data);

    // Emit an event so the main app bundle can react (if it's listening)
    // This wakes up the bridge and allows the Agent logic to proceed.
    DeviceEventEmitter.emit('PhoneClawHeartbeat', { source: 'headless', ...data });

    return Promise.resolve();
};

AppRegistry.registerHeadlessTask('PhoneClawHeadlessTask', () => HeadlessTask);
