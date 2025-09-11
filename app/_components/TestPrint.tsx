// components/PrintLabelButton.js
"use client"
import { useState } from "react";

export default function PrintLabelButton({ labelData }: { labelData: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const handlePrint = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sbpl:labelData
        }),
      });
      const result:any = await response.json();
      console.log('result: ', result);
      if (!response.ok) {
        throw new Error("Print failed");
      }
      alert(result?.message || "Print successful");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button className=" bg-amber-300 px-5 py-2 mt-10 ml-10 cursor-pointer rounded-full " onClick={handlePrint} disabled={loading}>
        {loading ? "Printing..." : "Print Label"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
