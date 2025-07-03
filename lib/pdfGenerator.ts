const net = require('net');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

/**
 * Generates a PDF label with text and a QR code.
 * @param {Object} labelData - The data for the label.
 * @returns {Promise<string>} - Resolves to the path of the generated PDF file.
 */
export const createLabelPDF= async(labelData:any)=> {
  const {
    原料名, 原料S_N, ベンダーLOT, 内容量, 使用期限, 入荷日, qrData
  } = labelData;

  const pdfPath = `label_${Date.now()}.pdf`;
  const doc = new PDFDocument({ size: [300, 400], margin: 20 });
  doc.pipe(fs.createWriteStream(pdfPath));

  // Title
  doc.fontSize(12).text(`原料名: ${原料名}`, { align: 'left' });
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').text('原料S/N:', { continued: true }).font('Helvetica').text(` ${原料S_N}`);
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').text('ベンダー-LOT:', { continued: true }).font('Helvetica').text(` ${ベンダーLOT}`);
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').text('内容量:', { continued: true }).font('Helvetica').text(` ${内容量}`);
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').text('使用期限:', { continued: true }).font('Helvetica').text(` ${使用期限}`);
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').text('入荷日:', { continued: true }).font('Helvetica').text(` ${入荷日}`);
  doc.moveDown(1);

  // Generate QR code as Data URL
  const qrImageData = await QRCode.toDataURL(qrData || 原料S_N);

  // Add QR code to PDF
  const qrImageBuffer = Buffer.from(qrImageData.split(',')[1], 'base64');
  doc.image(qrImageBuffer, doc.page.width - 120, doc.page.height - 140, { width: 100, height: 100 });

  doc.end();

  // Return the path to the generated PDF
  return pdfPath;
}
