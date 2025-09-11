import net from "net";

const HOST = "192.168.10.8";
const PORT = 9100;

const ESC = "\x1B";

export function printLabel() {
  const socket = net.createConnection({ host: HOST, port: PORT }, () => {
    console.log("=== P50*W80 Ingredient Label - Complete ===");
    console.log("Optimized layout with no overlaps\n");

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

    console.log("Final positions:");
    console.log("- Left margin: 250 dots (21mm)");
    console.log("- Text width: 250-550 (25mm)");
    console.log("- QR position: H800 (67mm from left)");
    console.log("- QR size: 03 (smaller)");
    console.log("- Clear separation between text and QR");
    console.log("\nSending...");

    socket.write(Buffer.from(cmd, "ascii"));

    setTimeout(() => {
      socket.end();
      console.log("Complete!");
    }, 1000);
  });

  socket.on("error", (err) => console.error("Error:", err.message));
}


