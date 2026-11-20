import DOMPurify from 'dompurify'

export function sanitizeDescription(value = '') {
  if (!value.trim()) return ''
  let html = value
  if (!/<\/?[a-z][\w:-]*(?:\s|\/?>)/i.test(value)) {
    const paragraph = document.createElement('p')
    paragraph.textContent = value
    html = `<p>${paragraph.innerHTML.replace(/\r?\n/g, '<br>')}</p>`
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'h3', 'h4'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
  })
}
