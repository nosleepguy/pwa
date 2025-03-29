import path from 'path';
import { PushSubscription } from 'web-push';

export const dbTemplate: {
  subscriptions: { subscription: PushSubscription; deviceID: string }[];
} = { subscriptions: [] };
export const dbFileLink = path.join(process.cwd() + '/public/static/db.json');
