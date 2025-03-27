// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from 'fs';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
   
        const { subscription, id } = req.body;
        subscriptions[id] = subscription;
        fs('./example.json', JSON.stringify(req.body))
        return res.status(201).json({ data: { success: true } });
}
