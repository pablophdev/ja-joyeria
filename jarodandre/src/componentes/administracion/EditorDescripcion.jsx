import { useEffect } from 'react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { sanitizeDescription } from '../../utilidades/descriptionHtml'
import './EditorDescripcion.css'

export default function EditorDescripcion({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({
      heading: { levels: [3, 4] },
      link: false, underline: false, strike: false, code: false,
      codeBlock: false, blockquote: false, horizontalRule: false,
    })],
    content: sanitizeDescription(value),
    editorProps: { attributes: {
      id: 'product-description', role: 'textbox', 'aria-multiline': 'true',
      'aria-labelledby': 'product-description-label', class: 'description-editor-content',
    } },
    onUpdate: ({ editor }) => onChange({ target: {
      name: 'description', value: editor.isEmpty ? '' : sanitizeDescription(editor.getHTML()),
    } }),
  })

  const state = useEditorState({ editor, selector: ({ editor }) => ({
    bold: editor?.isActive('bold') ?? false,
    italic: editor?.isActive('italic') ?? false,
    bulletList: editor?.isActive('bulletList') ?? false,
    orderedList: editor?.isActive('orderedList') ?? false,
    undo: editor?.can().undo() ?? false,
    redo: editor?.can().redo() ?? false,
    heading: editor?.getAttributes('heading').level ?? 'paragraph',
  }) })

  useEffect(() => {
    if (!editor) return
    const html = sanitizeDescription(value)
    const current = editor.isEmpty ? '' : editor.getHTML()
    if (html !== current) editor.commands.setContent(html, { emitUpdate: false })
  }, [editor, value])

  const marks = [
    { label: 'Negrita', active: state?.bold, action: () => editor.chain().focus().toggleBold().run() },
    { label: 'Cursiva', active: state?.italic, action: () => editor.chain().focus().toggleItalic().run() },
    { label: 'Lista de viñetas', active: state?.bulletList, action: () => editor.chain().focus().toggleBulletList().run() },
    { label: 'Lista numerada', active: state?.orderedList, action: () => editor.chain().focus().toggleOrderedList().run() },
  ]

  return <div className="description-editor">
    <div className="d-flex flex-wrap gap-2 border-bottom p-2" role="group" aria-label="Formato de descripción">
      <select className="form-select form-select-sm w-auto" aria-label="Estilo de texto" disabled={!editor}
        value={state?.heading ?? 'paragraph'} onChange={(event) => {
          const level = event.target.value
          if (level === 'paragraph') editor.chain().focus().setParagraph().run()
          else editor.chain().focus().setHeading({ level: Number(level) }).run()
        }}>
        <option value="paragraph">Párrafo</option><option value="3">Título</option><option value="4">Subtítulo</option>
      </select>
      {marks.map((mark) => <button key={mark.label} type="button" disabled={!editor}
        className="btn btn-sm btn-outline-dark" aria-pressed={mark.active} onClick={mark.action}>{mark.label}</button>)}
      <button type="button" className="btn btn-sm btn-outline-secondary" disabled={!state?.undo}
        onClick={() => editor.chain().focus().undo().run()}>Deshacer</button>
      <button type="button" className="btn btn-sm btn-outline-secondary" disabled={!state?.redo}
        onClick={() => editor.chain().focus().redo().run()}>Rehacer</button>
    </div>
    <EditorContent editor={editor} />
  </div>
}
