'use server';

import { dbTemplate } from '@/constant';
import { JSONFilePreset } from 'lowdb/node';
import webpush from 'web-push';

const db = await JSONFilePreset('/public/db.json', dbTemplate);

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);
export interface PushSubscription {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}

export async function subscribeUser(
  subscription: PushSubscription,
  deviceID: string,
) {
  await db.update(({ subscriptions }) =>
    subscriptions.push({ subscription, deviceID: deviceID }),
  );
  return { success: true };
}

export async function unsubscribeUser(deviceID: string) {
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  // delete from db
  await db.update(({ subscriptions }) =>
    subscriptions.filter(s => s.deviceID !== deviceID),
  );
  return { success: true };
}

export async function sendNotification(message: string, deviceID: string) {
  try {
    const subscription = db.data.subscriptions.find(
      subscription => subscription.deviceID === deviceID,
    );
    await webpush.sendNotification(
      subscription?.subscription as PushSubscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon.png',
      }),
    );
    return { success: true };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}
