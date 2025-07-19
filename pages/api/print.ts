import type { NextApiRequest, NextApiResponse } from "next";
import net from "net";

const PRINTER_IP = "172.20.3.61"; // ✅ Replace with your printer's IP
const PRINTER_PORT = 9100;

// Convert placeholders to control characters
const replaceControlChars = (data: string) => {
  return data
    .replace(/<ESC>/g, "\x1B")
    .replace(/<STX>/g, "\x02")
    .replace(/<ETX>/g, "\x03");
};

// Send SBPL data over TCP socket to SATO printer
const sendToSatoPrinter = (
  printerIp: string,
  port: number,
  rawData: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();

    client.connect(port, printerIp, () => {
      client.write(rawData);
      client.end();
    });

    client.on("error", (err) => {
      reject(err);
    });

    client.on("close", () => {
      resolve("Print job sent and connection closed.");
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { sbpl } = req.body;

    const labelCommand = sbpl
      ? replaceControlChars(sbpl)
      : replaceControlChars(`
<STX><ESC>A
<ESC>V0100
<ESC>H0100
<ESC>L0202
<ESC>XB
<ESC>D0301001
<ESC>1S1234567890
<ESC>Q1
<ESC>Z
`);

    const result = await sendToSatoPrinter(
      PRINTER_IP,
      PRINTER_PORT,
      labelCommand
    );
    return res.status(200).json({ success: true, message: result });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message,error: err });
  }
}
