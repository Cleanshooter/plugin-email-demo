import { FlexPlugin } from 'flex-plugin';
import React from 'react';
import EmailIcon from './EmailIcon';
import EmailTaskCanvas from './EmailTaskCanvas';

const PLUGIN_NAME = 'EmailDemoPlugin';

export default class EmailDemoPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    // Create custom Channel
    const EmailChannel = flex.DefaultTaskChannels.createDefaultTaskChannel('Email', 
    task => task.taskChannelUniqueName === 'email');

    // Basic settings
    EmailChannel.templates.TaskListItem.firstLine = task => (task.attributes.from);
    EmailChannel.templates.TaskCanvasHeader.title = task => (task.attributes.from);

    EmailChannel.templates.IncomingTaskCanvas.firstLine = task => (task.attributes.subject);
    EmailChannel.templates.IncomingTaskCanvas.secondLine = task => (task.attributes.message);

    EmailChannel.icons.active = <EmailIcon key="active-email-icon" />;
    EmailChannel.icons.list = <EmailIcon key="list-email-icon" />;
    EmailChannel.icons.main = <EmailIcon key="main-email-icon" />;
    
    EmailChannel.addedComponents = [
      {
        target: 'TaskCanvasTabs',
        component: <EmailTaskCanvas
          key="emailTab"
          id="emailTab"
          icon={<EmailIcon key="task-canvas-email-icon"/>}
          manager={manager}
        />,
        options: {
          sortOrder: 0,
          align: 'start',
          if: props => props.task.status === 'accepted'
        }
      }
    ];
    
    flex.TaskChannels.register(EmailChannel);
  }
}
