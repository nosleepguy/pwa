import { PushSubscription } from "web-push";

export const dbTemplate: {
  subscriptions: { subscription: PushSubscription; deviceID: string }[];
} = { subscriptions: [] };
