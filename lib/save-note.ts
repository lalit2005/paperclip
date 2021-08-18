import { Editor } from '@tiptap/react'
import axios from 'axios'
import toast from 'react-hot-toast'

const saveNote = (noteId: string, editor: Editor) => {
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
}

export default saveNote
