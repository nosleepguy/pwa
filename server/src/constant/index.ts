import { PushSubscription } from 'web-push';

export const dbTemplate: {
  subscriptions: { subscription: PushSubscription; deviceID: string }[];
} = { subscriptions: [] };
export const dbFileLink = process.cwd() + '/public/static/db.json';
