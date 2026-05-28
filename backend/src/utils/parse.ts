export function safeJsonParse<T = unknown>(raw: string): T {
  let s = raw.trim();
  if (s.startsWith('```')) {
    s = s.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  }
  try {
    return JSON.parse(s) as T;
  } catch {
    const first = s.indexOf('{');
    const last = s.lastIndexOf('}');
    if (first >= 0 && last > first) {
      return JSON.parse(s.slice(first, last + 1)) as T;
    }
    throw new Error('AI response was not valid JSON');
  }
}
