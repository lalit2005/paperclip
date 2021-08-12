import NoteCard from '@/components/note/NoteCard'
import StickyNoteCard from '@/components/stickyNote/StickyNoteCard'
import {
  UserProfile,
  withPageAuthRequired,
} from '@auth0/nextjs-auth0/dist/frontend'
import DashboardLayout from 'layouts/DashboardLayout'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'

const indexPage: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { data } = useSWR('/api/get-dashboard-data', fetcher)
  return (
    <DashboardLayout>
      <div>
        <div>
          <h2 className='text-3xl font-extrabold'>Your Notes 📔</h2>
          <Link href='/app/notes'>
            <div className='flex max-w-4xl px-10 mt-3 transition-all duration-300 border border-gray-300 rounded cursor-pointer py-7 hover:border-gray-400 hover:bg-gray-50/30'>
              {data?.notes.map((note) => (
                <div key={note.id}>{<NoteCard note={note} />}</div>
              )) || (
                <Skeleton
                  height='192px'
                  width='208px'
                  count={3}
                  style={{ marginRight: '28px' }}
                />
              )}
            </div>
          </Link>
        </div>
        <div className='mt-14'>
          <h2 className='text-3xl font-extrabold'>Your Sticky Notes 📝</h2>
          <Link href='/app/sticky-notes'>
            <a>
              <div className='flex max-w-4xl px-10 mt-3 transition-all duration-300 border border-gray-300 rounded cursor-pointer py-7 hover:border-gray-400 hover:bg-gray-50/30'>
                {data?.stickyNotes.map((note) => (
                  <StickyNoteCard stickyNote={note} key={note.id} />
                )) || (
                  <Skeleton
                    height='192px'
                    width='208px'
                    count={3}
                    style={{ marginRight: '28px' }}
                  />
                )}
              </div>
            </a>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default withPageAuthRequired(indexPage)
