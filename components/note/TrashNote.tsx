import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { notes } from '@prisma/client';
import PublicNote from './PublicNote';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const TrashNote: React.FC<{ note: notes; mutate: any; allData: notes[] }> = ({
  note,
  mutate,
  allData,
}) => {
  let [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div>
      <div
        key={note?.id}
        className='max-w-2xl px-5 py-3 mx-auto my-3 mr-4 border border-gray-600 rounded shadow hover:bg-gray-50'>
        <h3 className='text-xl font-bold'>{note?.noteHeading}</h3>
        <p className='mb-5 text-base text-gray-700'>{note?.noteDescription}</p>
        <button
          className='px-3 py-1 mr-2 bg-gray-900 rounded shadow text-gray-50 focus:ring focus:ring-offset-1 focus:ring-gray-700'
          onClick={openModal}>
          View Note&apos;s content
        </button>
        <button
          className='px-3 py-1 mr-2 text-blue-700 bg-blue-200 border border-blue-500 rounded shadow focus:ring focus:ring-offset-1 focus:ring-blue-700'
          onClick={() => {
            let newData = allData.filter((item) => item.id !== note?.id);
            console.log(JSON.stringify(newData, null, 2));
            const removeFromTrash = axios.post('/api/notes/trash', {
              id: note?.id,
              inTrash: false,
            });
            // .then(() => {
            //   router.reload()
            // })
            toast.promise(removeFromTrash, {
              error: `Could not restore ${note?.noteHeading}`,
              success: 'Note restored from trash successfully.',
              loading: `Restoring ${note?.noteHeading}...`,
            });
          }}>
          Restore Note
        </button>
        <button
          className='px-3 py-1 text-red-700 bg-red-200 border border-red-500 rounded shadow focus:ring focus:ring-offset-1 focus:ring-red-700'
          onClick={() => {
            const deleteNote = axios.post('/api/notes/delete-note', {
              id: note?.id,
            });
            // .then(() => {
            //   router.reload()
            // })
            toast.promise(deleteNote, {
              error: 'Error deleting note',
              success: 'Note deleted successfully',
              loading: 'Deleting note...',
            });
          }}>
          Delete Note
        </button>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto'
          onClose={closeModal}>
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'>
              <Dialog.Overlay className='fixed inset-0 backdrop-filter backdrop-blur-lg' />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className='inline-block h-screen align-middle'
              aria-hidden='true'>
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'>
              <div className='inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'>
                  {note?.noteHeading}
                </Dialog.Title>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>
                    {note?.noteDescription}
                  </p>
                </div>
                <div className='my-5'>
                  <PublicNote noteContent={note?.note} />
                </div>
                <div className='mt-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                    onClick={closeModal}>
                    Got it, thanks!
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default TrashNote;
