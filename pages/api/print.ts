// pages/api/print.ts

import type { NextApiRequest, NextApiResponse } from 'next'

const printerLib = require('printer');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end("Method Not Allowed");

  const { label } = req.body;

  if (!label) {
    return res.status(400).json({ error: "Label data is required" });
  }

  try {
    printerLib.printDirect({
      data: label,
      printer: printerLib.getDefaultPrinterName(),
      type: 'RAW',
      success: (jobId: any) => {
        return res.status(200).json({ message: `Print job sent: ${jobId}` });
      },
      error: (err: any) => {
        return res.status(500).json({ error: `Print error: ${err}` });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
