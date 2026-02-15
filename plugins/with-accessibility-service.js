const { withAndroidManifest } = require('@expo/config-plugins');

const withAccessibilityService = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    
    const application = androidManifest.manifest.application[0];
    
    const service = {
      $: {
        'android:name': '.ClawAccessibilityService',
        'android:permission': 'android.permission.BIND_ACCESSIBILITY_SERVICE',
        'android:exported': 'false'
      },
      'intent-filter': [
        {
          action: [
            {
              $: {
                'android:name': 'android.accessibilityservice.AccessibilityService'
              }
            }
          ]
        }
      ],
      'meta-data': [
        {
          $: {
            'android:name': 'android.accessibilityservice',
            'android:resource': '@xml/accessibility_service_config'
          }
        }
      ]
    };

    if (!application.service) {
      application.service = [];
    }
    application.service.push(service);

    return config;
  });
};

module.exports = withAccessibilityService;
