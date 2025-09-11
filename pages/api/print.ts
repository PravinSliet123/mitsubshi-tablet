import type { NextApiRequest, NextApiResponse } from "next";
import net from "net";
import { printLabel } from "./help";

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

    await printLabel();
    console.log("sbpl: ", sbpl);
    return res
      .status(200)
      .json({ success: true, message: "Printed successfully" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ success: false, message: err.message, error: err });
  }
}
