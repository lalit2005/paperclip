import Note from '@/components/note/Note'
import NoteTag from '@/components/note/NoteTag'
import fetcher from '@/lib/fetcher'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { notes } from '@prisma/client'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import DashboardNav from '@/components/dashboard/DashboardNav'
import { useEffect } from 'react'
import Head from 'next/head'

const index = () => {
  const router = useRouter()
  const { data: note } = useSWR<notes>(
    `/api/notes/get-note/?noteId=${router.query.noteId}`,
    fetcher
  )
  useEffect(() => {
    window.onbeforeunload = function () {
      return ''
    }
  }, [])
  return (
    <div className='min-h-screen px-10 bg-gray-50'>
      <Head>
        <title>
          {note?.noteHeading} | {note?.noteDescription}
        </title>
      </Head>
      <DashboardNav />
      <div className='max-w-5xl pt-16 mx-auto px-7'>
        <div className='flex items-start justify-start'>
          <span className='inline-block mr-5 text-4xl font-bold'>🔥</span>
          <div className='inline-block'>
            <h1 className='text-4xl font-bold'>{note?.noteHeading}</h1>
            <div className='mt-4 text-lg text-gray-500'>
              <h2>{note?.noteDescription}</h2>
            </div>
            <div className='mt-3 tags'>
              {note?.tags?.map((tag) => (
                <NoteTag key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </div>
        <div className='mt-12 bg-white note-container'>
          {note?.note && (
            <Note noteId={router.query.noteId} noteContent={note?.note} />
          )}
        </div>
      </div>
    </div>
  )
}

export default withPageAuthRequired(index)
