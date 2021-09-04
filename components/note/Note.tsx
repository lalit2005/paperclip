// load all highlight.js languages
import lowlight from 'lowlight';

import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import CodeBlockComponent from './CodeBlockComponent';
import Iframe from './Iframe';
import { Toaster } from 'react-hot-toast';
import MenuBar from './MenuBar';
import saveNote from '@/lib/save-note';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

import debounce from 'debounce';

const Note: React.FC<{
  noteContent: string;
  noteId: string;
  isModalOpen: boolean;
  mutate: any;
}> = ({ noteContent, noteId, isModalOpen, mutate }) => {
  const CustomTableCell = TableCell.extend({
    addAttributes() {
      return {
        // extend the existing attributes …
        ...this.parent?.(),

        // and add a new one …
        backgroundColor: {
          default: null,
          parseHTML: (element) => {
            return {
              backgroundColor: element.getAttribute('data-background-color'),
            };
          },
          renderHTML: (attributes) => {
            return {
              'data-background-color': attributes.backgroundColor,
              style: `background-color: ${attributes.backgroundColor}`,
            };
          },
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Highlight,
      Link,
      Iframe,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      // Default TableCell
      // TableCell,
      // Custom TableCell with backgroundColor attribute
      CustomTableCell,
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
    ],
    autofocus: true,
    content: noteContent,
    onUpdate: debounce(({ editor }) => {
      // @ts-ignore
      return saveNote(noteId, editor, mutate);
    }, 3000),
  });

  return (
    <div className='bg-gray-50'>
      <div id='navbar'>
        {!isModalOpen && <MenuBar editor={editor} noteId={noteId} />}
      </div>
      <div
        id='paperclip-editor'
        className='px-6 pb-12 font-sans bg-transparent rounded-lg py-7 focus:outline-none active:outline-none'
        onKeyDown={(e) => {
          if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            saveNote(noteId, editor);
          }
        }}>
        <EditorContent editor={editor} />
      </div>
      <Toaster />
    </div>
  );
};

export default Note;
