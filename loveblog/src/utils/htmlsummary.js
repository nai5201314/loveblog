export function htmlToSummary(html = '', maxLength = 60) {
  if (!html) return '';
  let text = html;
  text = text.replace(/<img[^>]*>/gi, ' [图片] ');
  text = text.replace(/<(br|\/p|\/div)>/gi, ' ');
  text = text.replace(/<[^>]+>/g, '');
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
  text = text.replace(/\s+/g, ' ').trim();
  return text.length > maxLength
    ? text.slice(0, maxLength) + '…'
    : text;
}
