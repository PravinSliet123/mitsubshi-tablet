// components/PrintLabelButton.js
"use client";
import { useState } from "react";
import iconv from "iconv-lite";

export default function PrintLabelButton(data: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const labelData: any = {
    title: data.title || "原料ラベル",
    name: data.name || "在庫名1",
    sn: data.sn || "14LUNDC1B35BB620202508291550421",
    lot: data.lot || "12",
    quantity: data.quantity || "455",
    expiry: data.expiry || "2025/09/10",
    received: data.received || "2025/08/31",
    qrData: data.qrData || "テスト",
  };
  const handlePrint = async () => {
    setLoading(true);
    setError(null);
    const ESC = "\x1B";
 
    let cmd = "";
    
    // ラベル開始
    cmd += `${ESC}A`;
    
    // 日本語設定（Shift-JIS）
    cmd += `${ESC}#E3`;
    
    // === タイトル ===
    cmd += `${ESC}V0040`;
    cmd += `${ESC}H0350`;
    cmd += `${ESC}P01`;
    cmd += `${ESC}L0202`;  // 太字
    cmd += `${ESC}K9B`;
    cmd += iconv.encode(labelData.title, 'Shift_JIS').toString('binary');
    
    cmd += `${ESC}L0101`;  // 通常に戻す
    
    // === 原料名 ===
    cmd += `${ESC}V0100`;
    cmd += `${ESC}H0250`;
    cmd += `${ESC}K9B`;
    cmd += iconv.encode(`原料名: ${labelData.name}`, 'Shift_JIS').toString('binary');
    
    // === 原料S/N ===
    cmd += `${ESC}V0150`;
    cmd += `${ESC}H0250`;
    cmd += `${ESC}K9B`;
    cmd += iconv.encode("原料S/N:", 'Shift_JIS').toString('binary');
    
    // S/N値（英数字は通常フォント）
    cmd += `${ESC}V0190`;
    cmd += `${ESC}H0250`;
    cmd += `${ESC}XS${labelData.sn}`;
    
    // === ベンダーLOT ===
    cmd += `${ESC}V0240`;
    cmd += `${ESC}H0250`;
    cmd += `${ESC}K9B`;
    cmd += iconv.encode(`ベンダーLOT: ${labelData.lot}`, 'Shift_JIS').toString('binary');
    
    // === 内容量 ===
    cmd += `${ESC}V0290`;
    cmd += `${ESC}H0250`;
    cmd += `${ESC}K9B`;
    cmd += iconv.encode(`内容量: ${labelData.quantity}`, 'Shift_JIS').toString('binary');
    
    // === 使用期限 ===
    cmd += `${ESC}V0340`;
    cmd += `${ESC}H0250`;
    cmd += `${ESC}K9B`;
    cmd += iconv.encode(`使用期限: ${labelData.expiry}`, 'Shift_JIS').toString('binary');
    
    // === 入荷日 ===
    cmd += `${ESC}V0390`;
    cmd += `${ESC}H0250`;
    cmd += `${ESC}K9B`;
    cmd += iconv.encode(`入荷日: ${labelData.received}`, 'Shift_JIS').toString('binary');
    
    // === QRコード（右端） ===
    cmd += `${ESC}V0250`;
    cmd += `${ESC}H0800`;
    cmd += `${ESC}2D30,L,03,0,0`;
    cmd += `${ESC}DS1,0`;
    cmd += iconv.encode(labelData.qrData, 'Shift_JIS').toString('binary');
    
    // 印刷実行
    cmd += `${ESC}Q1`;
    cmd += `${ESC}Z`;
    try {
      const response = await fetch(
        "https://549c8d5db4c2.ngrok-free.app/print",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sbpl: cmd,
          }),
        }
      );
      const result: any = await response.json();
      console.log("result: ", result);
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
      <button
        className=" bg-amber-300 px-5 py-2 mt-10 ml-10 cursor-pointer rounded-full "
        onClick={handlePrint}
        disabled={loading}
      >
        {loading ? "Printing..." : "Print Label"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
