// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { sanitizeDescription } from '../utilidades/descriptionHtml'

describe('Descripción enriquecida', () => {
  it('mantiene el formato permitido y elimina HTML ejecutable y atributos', () => {
    const result = sanitizeDescription('<h3 onclick="alert(1)">Detalles</h3><p style="color:red">Plata <strong>925</strong><img src=x onerror="alert(1)"></p><script>alert(1)</script><iframe src="https://example.com"></iframe>')
    expect(result).toBe('<h3>Detalles</h3><p>Plata <strong>925</strong></p>')
  })
  it('conserva texto anterior con saltos de línea y caracteres especiales', () => {
    expect(sanitizeDescription('Plata & oro\nMedida < 5 cm')).toBe('<p>Plata &amp; oro<br>Medida &lt; 5 cm</p>')
  })
  it('conserva listas y cursiva y elimina los enlaces al pegar contenido', () => {
    expect(sanitizeDescription('<ul><li><em>Plata</em></li></ul><a href="javascript:alert(1)">Consulta</a>'))
      .toBe('<ul><li><em>Plata</em></li></ul>Consulta')
  })
})
