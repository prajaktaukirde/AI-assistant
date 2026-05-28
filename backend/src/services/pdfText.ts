import pdfParse from 'pdf-parse';

export async function extractTextFromBuffer(
  buf: Buffer,
  mimetype: string
): Promise<string> {
  if (mimetype === 'application/pdf') {
    const out = await pdfParse(buf);
    return out.text || '';
  }
  return buf.toString('utf8');
}
