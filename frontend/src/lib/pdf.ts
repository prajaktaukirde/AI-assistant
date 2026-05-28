'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportElementToPdf(
  el: HTMLElement,
  filename: string
): Promise<void> {
  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
  });
  const img = canvas.toDataURL('image/jpeg', 0.95);

  const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const imgW = pageW;
  const imgH = (canvas.height * imgW) / canvas.width;

  let y = 0;
  let remaining = imgH;

  while (remaining > 0) {
    pdf.addImage(img, 'JPEG', 0, y, imgW, imgH);
    remaining -= pageH;
    if (remaining > 0) {
      pdf.addPage();
      y -= pageH;
    }
  }

  pdf.save(filename);
}
