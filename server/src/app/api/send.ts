// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import webPush from "web-push";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { message, title, id } = req.body;
    const subscription = subscriptions[id];
    const payload = JSON.stringify({ title, message });
    webPush
      .sendNotification(subscription, payload)
      .then((value) => {
        return res.status(201).json({ data: { success: true } });
      })
      .catch((error) => {
        return res.status(400).json({ data: { success: false } });
      });
}
