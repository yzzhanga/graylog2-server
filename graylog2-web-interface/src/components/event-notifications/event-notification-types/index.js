import { PluginManifest, PluginStore } from 'graylog-web-plugin/plugin';

import EmailNotificationFormContainer from './EmailNotificationFormContainer';
import EmailNotificationForm from './EmailNotificationForm';
import EmailNotificationSummary from './EmailNotificationSummary';
import HttpNotificationForm from './HttpNotificationForm';
import HttpNotificationSummary from './HttpNotificationSummary';
import LegacyNotificationForm from './LegacyNotificationForm';
import LegacyNotificationFormContainer from './LegacyNotificationFormContainer';
import LegacyNotificationSummaryContainer from './LegacyNotificationSummaryContainer';

PluginStore.register(new PluginManifest({}, {
  eventNotificationTypes: [
    {
      type: 'email-notification-v1',
      displayName: 'Email Notification',
      formComponent: EmailNotificationFormContainer,
      summaryComponent: EmailNotificationSummary,
      defaultConfig: EmailNotificationForm.defaultConfig,
    },
    {
      type: 'http-notification-v1',
      displayName: 'HTTP Notification',
      formComponent: HttpNotificationForm,
      summaryComponent: HttpNotificationSummary,
      defaultConfig: HttpNotificationForm.defaultConfig,
    },
    {
      type: 'legacy-alarm-callback-notification-v1',
      displayName: 'Legacy Alarm Callbacks',
      formComponent: LegacyNotificationFormContainer,
      summaryComponent: LegacyNotificationSummaryContainer,
      defaultConfig: LegacyNotificationForm.defaultConfig,
    },
  ],
}));
