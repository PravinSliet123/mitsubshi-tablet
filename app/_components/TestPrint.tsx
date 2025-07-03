// pages/index.tsx
"use client"
import { useState } from "react";

export default function TestPrint() {
  const [status, setStatus] = useState("");

  const handlePrint = async () => {
    const label = `
^XA
^FO50,50^A0N,40,40^FDHello from Next.js^FS
^FO50,100^BY2
^BCN,100,Y,N,N
^FD1234567890^FS
^XZ
    `;

    const res = await fetch("/api/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label }),
    });

    const data = await res.json();
    setStatus(data.message || data.error);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>SATO USB Label Print (Next.js)</h1>
      <button onClick={handlePrint}>Print Label</button>
      <p>Status: {status}</p>
    </div>
  );
}
