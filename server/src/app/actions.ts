'use server';

import { dbFileLink, dbTemplate } from '@/constant';
import { JSONFilePreset } from 'lowdb/node';
import webpush from 'web-push';

const db = await JSONFilePreset(dbFileLink, dbTemplate);

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
  // check if user is already subscribed
  const existingSubscription = db.data.subscriptions.find(
    s => s.deviceID === deviceID,
  );
  if (existingSubscription) {
    // update subscription
    await db.update(({ subscriptions }) =>
      subscriptions.map(s =>
        s.deviceID === deviceID ? { ...s, subscription } : s,
      ),
    );
    return { success: true };
  } else {
    await db.update(({ subscriptions }) =>
      subscriptions.push({ subscription, deviceID: deviceID }),
    );
  }
  return { success: true };
}

export async function unsubscribeUser(deviceID: string) {
  // check if user is already subscribed or not
  const existingSubscription = db.data.subscriptions.find(
    s => s.deviceID === deviceID,
  );
  if (!existingSubscription) {
    return { success: false, error: 'User is not subscribed' };
  } else {
    // delete from db
    db.data.subscriptions = db.data.subscriptions.filter(
      s => s.deviceID !== deviceID,
    );
    await db.write();
  }
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
