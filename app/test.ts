// // app/api/print/route.ts
// export const runtime = 'nodejs' // ✅ Required for native modules

// import { NextResponse } from 'next/server'
// const printerLib = require('printer');
// // let printerLib: typeof import('printer') | null = null;
// // if (!process.env.VERCEL) {
// //   printerLib = require('printer');
// // }

// export async function POST(req: Request) {
//   console.log(printerLib!.getPrinters());
//   try {
//     const { label } = await req.json();

//     if (!label) {
//       return NextResponse.json({ error: "Label data is required" }, { status: 400 });
//     }

//     if (!printerLib) {
//       return NextResponse.json({ error: "Printer library not available" }, { status: 500 });
//     }

//     return new Promise((resolve) => {
//       printerLib!.printDirect({
//         data: label,
//         printer: printerLib!.getDefaultPrinterName(), // or hardcode printer name
//         type: 'RAW',
//         success: (jobId) =>
//           resolve(NextResponse.json({ message: `Print job sent: ${jobId}` })),
//         error: (err) =>
//           resolve(NextResponse.json({ error: String(err) }, { status: 500 })),
//       });
//     });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
