// components/PrintLabelButton.js
"use client";
import { useState } from "react";

export default function PrintLabelButton({ labelData }: { labelData: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const handlePrint = async () => {
    setLoading(true);
    setError(null);
    const ESC = "\x1B";
    let cmd = "";

    // ラベル開始
    cmd += `${ESC}A`;

    // === タイトル（上部中央） ===
    cmd += `${ESC}V0040`;
    cmd += `${ESC}H0300`;
    cmd += `${ESC}P01`;
    cmd += `${ESC}XMINGREDIENT LABEL`;

    // === メイン情報（左側エリア：H250-550） ===
    // 原料名
    cmd += `${ESC}V0100`;
    cmd += `${ESC}H0250`;
    cmd += `${ESC}XMName: Stock1`;

    // S/N（短縮表示）
    cmd += `${ESC}V0150`;
    cmd += `${ESC}H0250`;
    cmd += `${ESC}XMSN: 14LUNDC1B35BB`;

    // ベンダーLOT
    cmd += `${ESC}V0200`;
    cmd += `${ESC}H0250`;
    cmd += `${ESC}XMLot: 12`;

    // 内容量
    cmd += `${ESC}V0250`;
    cmd += `${ESC}H0250`;
    cmd += `${ESC}XMQuantity: 455`;

    // 使用期限
    cmd += `${ESC}V0300`;
    cmd += `${ESC}H0250`;
    cmd += `${ESC}XMExpiry: 2025/09/10`;

    // 入荷日
    cmd += `${ESC}V0350`;
    cmd += `${ESC}H0250`;
    cmd += `${ESC}XMReceived: 2025/08/31`;

    // フルS/N（最下部、小さく）
    cmd += `${ESC}V0420`;
    cmd += `${ESC}H0250`;
    cmd += `${ESC}XSFull: 14LUNDC1B35BB620202508291550421`;

    // === QRコード（右端エリア：H800以降） ===
    cmd += `${ESC}V0250`; // 中央高さ
    cmd += `${ESC}H0800`; // 極右（800ドット = 約67mm）
    cmd += `${ESC}2D30,L,03,0,0`; // サイズ03（小さめ）
    cmd += `${ESC}DS1,0TEST`;

    // 印刷実行
    cmd += `${ESC}Q1`;
    cmd += `${ESC}Z`;
    try {
      const response = await fetch("http://192.168.31.116:4000/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sbpl: cmd,
        }),
      });
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
