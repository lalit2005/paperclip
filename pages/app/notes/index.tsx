import Note from '@/components/note/Note'
import NoteTag from '@/components/note/NoteTag'
import SearchInput from '@/components/note/SearchInput'
import fetcher from '@/lib/fetcher'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { notes } from '@prisma/client'
import DashboardLayout from 'layouts/DashboardLayout'
import Link from 'next/link'
import { useState } from 'react'
import useSWR from 'swr'
import Fuse from 'fuse.js'
import Skeleton from 'react-loading-skeleton'

const index = () => {
  const { data: notes } = useSWR<notes[]>('/api/notes/get-all-notes', fetcher)
  const [inputValue, setInputValue] = useState('')
  const fuse = new Fuse(notes, {
    keys: ['noteHeading', 'noteDescription', 'note', 'tags'],
    includeMatches: true,
    useExtendedSearch: true,
  })
  const results = inputValue ? fuse.search(inputValue) : notes
  return (
    <div>
      <DashboardLayout>
        <h1 className='mb-16 text-4xl font-extrabold text-center'>
          Your notes 📔
        </h1>
        <SearchInput
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            console.log(results)
          }}
        />
        {results?.map((note) => (
          <Link
            key={note.id || note.item.id}
            href={`/app/notes/${note.id || note.item.id}`}>
            <a className='block'>
              <div className='p-5 my-4 border border-gray-500 rounded shadow-md hover:bg-gray-50'>
                <h3 className='text-lg text-gray-900'>
                  {note.noteHeading || note.item.noteHeading}
                </h3>
                <p className='text-gray-600 font-base'>
                  {note.noteDescription || note.item.noteDescription}
                </p>
                <div className='my-5'>
                  {note?.tags?.map((tag) => <NoteTag key={tag} tag={tag} />) ||
                    note?.item?.tags?.map((tag) => (
                      <NoteTag key={tag} tag={tag} />
                    ))}
                </div>
              </div>
            </a>
          </Link>
        )) || (
          <Skeleton
            height='150px'
            width='100%'
            count={3}
            className='my-4 rounded shadow-sm'
          />
        )}
      </DashboardLayout>
    </div>
  )
}

export default withPageAuthRequired(index)
