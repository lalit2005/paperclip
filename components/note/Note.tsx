import {
  useEditor,
  EditorContent,
  ReactNodeViewRenderer,
  Editor,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { BiItalic, BiHighlight } from 'react-icons/bi'
import {
  FaCode,
  FaRemoveFormat,
  FaQuoteLeft,
  FaMinus,
  FaListUl,
  FaListOl,
} from 'react-icons/fa'
import { ImStrikethrough } from 'react-icons/im'
import { HiOutlinePhotograph } from 'react-icons/hi'
import { HiLink } from 'react-icons/hi'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import CodeBlockComponent from './CodeBlockComponent'
import Iframe from './Iframe'

// load all highlight.js languages
import lowlight from 'lowlight'
import { defaultNoteContent } from './defaultNoteContent'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const MenuBar: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return <>Loading...</>
  }

  return (
    <div className='flex flex-row flex-wrap py-3 mb-8 bg-white border border-gray-700 rounded shadow-inner justify-evenly gap-x-2 px-7 menu-bar'>
      <button
        id='bold-btn'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive('bold') ? 'is-active' : '' + '  hover:bg-gray-200 '
        }>
        <strong>B</strong>
      </button>
      <button
        id='italic-btn'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive('italic') ? 'is-active' : '' + '  hover:bg-gray-200 '
        }>
        <BiItalic />
      </button>
      <button
        id='strike-btn'
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={
          editor.isActive('strike') ? 'is-active' : '' + '  hover:bg-gray-200 '
        }>
        <ImStrikethrough />
      </button>
      <button
        id='code-btn'
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={
          editor.isActive('code') ? 'is-active' : '' + '  hover:bg-gray-200 '
        }>
        <FaCode />
      </button>
      <button
        id='remove-format-btn'
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className=' hover:bg-gray-200'>
        <FaRemoveFormat />
      </button>
      <button
        id='h1-btn'
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive('heading', { level: 1 })
            ? 'is-active'
            : '' + '  hover:bg-gray-200 '
        }>
        <strong>H1</strong>
      </button>
      <button
        id='h2-btn'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive('heading', { level: 2 })
            ? 'is-active'
            : '' + ` hover:bg-gray-200 `
        }>
        <strong>H2</strong>
      </button>
      <button
        id='h3-btn'
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive('heading', { level: 3 })
            ? 'is-active'
            : '' + '  hover:bg-gray-200 '
        }>
        <strong>H3</strong>
      </button>
      <button
        id='ul-btn'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive('bulletList')
            ? 'is-active'
            : '' + '  hover:bg-gray-200 '
        }>
        <FaListUl />
      </button>
      <button
        id='ol-btn'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive('orderedList')
            ? 'is-active'
            : '' + '  hover:bg-gray-200 '
        }>
        <FaListOl />
      </button>
      <button
        id='code-block-btn'
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={
          editor.isActive('codeBlock')
            ? 'is-active'
            : '' + '  hover:bg-gray-200 '
        }>
        <FaCode />
      </button>
      <button
        id='quote-btn'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          editor.isActive('blockquote')
            ? 'is-active'
            : '' + '  hover:bg-gray-200 '
        }>
        <FaQuoteLeft />
      </button>
      <button
        id='hr-btn'
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className=' hover:bg-gray-200'>
        <FaMinus />
      </button>
      <button
        onClick={() => {
          const url = window.prompt('URL')
          if (url) {
            editor.chain().focus().setImage({ src: url }).run()
          }
        }}
        className={
          editor.isActive('blockquote')
            ? 'is-active'
            : '' + '  hover:bg-gray-200 '
        }>
        <HiOutlinePhotograph className='w-6 h-6' />
      </button>
      <button
        onClick={() => {
          let url = window.prompt('URL')
          url = url.toString().startsWith('http') ? url : 'http://' + url
          editor.chain().focus().setLink({ href: url }).run()
        }}
        className={
          editor.isActive('blockquote')
            ? 'is-active'
            : '' + '  hover:bg-gray-200 '
        }>
        <HiLink className='w-6 h-6' />
      </button>
      <button
        onClick={() => {
          let embedUrl = window.prompt('URL')
          embedUrl = embedUrl.toString().startsWith('http')
            ? embedUrl
            : 'http://' + embedUrl
          editor.chain().focus().setIframe({ src: embedUrl }).run()
        }}>
        Iframe
      </button>
      <button
        onClick={() => {
          editor.chain().focus().toggleHighlight().run()
        }}
        className={
          editor.isActive('blockquote')
            ? 'is-active'
            : '' + '  hover:bg-gray-200'
        }>
        <BiHighlight />
      </button>
    </div>
  )
}

export default function Note({ noteContent, noteId }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Highlight,
      Link,
      Iframe,
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent)
        },
      }).configure({ lowlight }),
    ],
    // editable: false,
    autofocus: true,
    content: noteContent,
  })

  return (
    <div className='block bg-gray-50'>
      <div className='sticky top-0 z-20 block'>
        <span>
          <MenuBar editor={editor} />
        </span>
      </div>

      <div
        id='paperclip-editor'
        className='px-6 pb-12 font-sans bg-transparent rounded-lg py-7 focus:outline-none active:outline-none'>
        <EditorContent editor={editor} />
      </div>
      <button
        onClick={() => {
          // console.log(JSON.stringify(editor.getJSON(), null, 2))
          console.log(JSON.stringify(editor.getJSON()))
          console.log(editor.getCharacterCount())
          console.log(editor.getHTML())
          const updateNote = axios
            .post('/api/notes/update-note', {
              id: noteId,
              noteContent: editor.getHTML(),
            })
            .then(() => {
              console.log('success')
            })
            .catch((error) => {
              console.log(error)
            })
          toast.promise(updateNote, {
            error: 'Error updating note',
            success: 'Note updated',
            loading: 'Updating note...',
          })
        }}
        className='p-5 my-3 bg-gray-600'>
        Save
      </button>
      <Toaster />
    </div>
  )
}
