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
    scrollY: -window.scrollY,
    windowWidth: document.documentElement.scrollWidth,
    windowHeight: document.documentElement.scrollHeight,
  });
  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 24;
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;

  const properties = pdf.getImageProperties(imgData);
  const imgWidth = printableWidth;
  const imgHeight = (properties.height * imgWidth) / properties.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
  heightLeft -= printableHeight;

  while (heightLeft > 0) {
    position -= printableHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', margin, margin + position, imgWidth, imgHeight);
    heightLeft -= printableHeight;
  }

  pdf.save(filename);
}
