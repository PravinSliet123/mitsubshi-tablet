// pages/api/print-label.js
import { createLabelPDF } from "../../lib/pdfGenerator";
import net from "net";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
const labelData = {
  原料名: "在庫名1",
  原料S_N: "14LUNDC1B35BB62020250630224430-11",
  ベンダーLOT: "123",
  内容量: "1",
  使用期限: "2025/07/02",
  入荷日: "2025/07/01",
  qrData: "14LUNDC1B35BB62020250630224430-11", // or any string to encode in QR
};

export default async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    //@ts-ignore
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // const labelData = req.body;
    // Generate PDF file (implement createLabelPDF to return a file path)
    const pdfPath = await createLabelPDF(labelData);

    // Send PDF to SATO printer
    const printerIP = process.env.SATO_PRINTER_IP || "172.20.3.61"; // Set in your environment
    const client = new net.Socket();
    client.connect(1025, printerIP, () => {
      const pdfStream = fs.createReadStream(pdfPath);
      pdfStream.pipe(client);
      pdfStream.on("end", () => {
        client.end();
        fs.unlinkSync(pdfPath); // Clean up temp file
        //@ts-ignore
        res.status(200).json({ message: "Label sent to printer" });
      });
    });
    client.on("error", (err) => {
      //@ts-ignore
      res.status(500)
        .json({ error: "Printer connection failed", details: err.message });
    });
  } catch (err) {
    //@ts-ignore
    res.status(500).json({ error: "Print job failed", details: err.message });
  }
}


// export async function POST(req: NextRequest) {
//   const { label } = await req.json();

//   const printerIP = process.env.SATO_PRINTER_IP || "172.20.3.61";
//   const printerPort = 9100;

//   // Use fallback sample label if not passed
//   const zplData = label || `^XA^FO50,50^ADN,36,20^FDHello from Next.js^FS^XZ`;

//   return new Promise<Response>((resolve) => {
//     const client = new net.Socket();

//     client.connect(printerPort, printerIP, () => {
//       client.write(zplData, () => {
//         client.end();
//         resolve(Response.json({ message: "✅ Label sent to printer." }));
//       });
//     });

//     client.setTimeout(5000);

//     client.on("timeout", () => {
//       client.destroy();
//       resolve(
//         new Response(JSON.stringify({ error: "❌ Printer timeout" }), {
//           status: 504,
//         })
//       );
//     });

//     client.on("error", (err) => {
//       resolve(
//         new Response(JSON.stringify({ error: "❌ Printer connection failed", details: err.message }), {
//           status: 500,
//         })
//       );
//     });
//   });
// }

