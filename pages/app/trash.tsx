import fetcher from '@/lib/fetcher';
import DashboardLayout from 'layouts/DashboardLayout';
import useSWR from 'swr';
import { TrashResponse } from 'types/types';
import TrashNote from '@/components/note/TrashNote';
import TrashBoard from '@/components/whiteboard/TrashBoard';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/dist/frontend';
import axios from 'axios';
import toast from 'react-hot-toast';
// import useReload from '@/lib/useReload'

const Trash = () => {
  const { data, mutate } = useSWR<TrashResponse>('/api/trash', fetcher);
  return (
    <div>
      <DashboardLayout>
        <h1 className='text-3xl font-extrabold'>Trash</h1>
        <hr className='text-gray-300 w-[80%]' />
        {/* --------------------------------- */}
        <h2 className='mt-10 mb-4 text-2xl font-bold'>Notes in trash</h2>

        {data?.notes.length !== 0 && (
          <button
            className='px-3 py-1 my-2 rounded shadow bg-blue-50 focus:ring focus:ring-offset-1 focus:ring-blue-700'
            onClick={() => {
              const clearTrash = axios.post('/api/notes/clear-trash');
              // .then(() => {
              //   reload()
              // })
              toast.promise(clearTrash, {
                loading: 'Clearing trash...',
                success: 'Trash cleared',
                error: 'Error clearing trash',
              });
            }}>
            Remove all notes
          </button>
        )}
        <div className='flex flex-wrap'>
          {data?.notes?.map((note) => (
            <TrashNote
              key={note.id}
              allData={data.notes}
              mutate={mutate}
              note={note}
            />
          ))}
          {data?.notes.length == 0 && (
            <div>
              <h1>No notes in trash {'¯\\_(ツ)_/¯'}</h1>
            </div>
          )}
        </div>
        {/* --------------------------------- */}
        <h2 className='mt-16 mb-4 text-2xl font-bold'>Notes in trash</h2>
        {data?.boards.length !== 0 && (
          <button
            className='px-3 py-1 my-2 rounded shadow bg-blue-50 focus:ring focus:ring-offset-1 focus:ring-blue-700'
            onClick={() => {
              const clearTrash = axios.post('/api/boards/clear-trash');
              // .then(() => {
              //   reload()
              // })
              toast.promise(clearTrash, {
                loading: 'Clearing trash...',
                success: 'Trash cleared',
                error: 'Error clearing trash',
              });
            }}>
            Remove all boards
          </button>
        )}
        <div className='flex flex-wrap'>
          {data?.boards?.map((board) => (
            <TrashBoard
              key={board.id}
              allData={data.boards}
              mutate={mutate}
              board={board}
            />
          ))}
          {data?.boards.length == 0 && (
            <div>
              <h1>No boards in trash {'¯\\_(ツ)_/¯'}</h1>
            </div>
          )}
        </div>
      </DashboardLayout>
    </div>
  );
};

export default withPageAuthRequired(Trash);
