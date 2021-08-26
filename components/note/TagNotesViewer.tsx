import { Dialog, Transition } from '@headlessui/react';
import { notes } from '@prisma/client';
import { Fragment, useState } from 'react';
import NoteTag from './NoteTag';
import Link from 'next/link';
import { HiFolder, HiOutlineFolder, HiOutlineXCircle } from 'react-icons/hi';

const TagNotesViewer: React.FC<{ tag: string; notesData: notes[] }> = ({
  tag,
  notesData,
}) => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className='inline-block w-full max-w-xl'>
      <div
        className='p-5 my-4 border border-gray-500 rounded shadow-md cursor-pointer hover:bg-gray-50'
        onClick={openModal}>
        <HiOutlineFolder className='relative inline-block w-6 h-6 mr-2 bottom-px' />{' '}
        <h3 className='inline-block text-lg text-gray-900 capitalize'>{tag}</h3>
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
              <div className='absolute top-0 left-0 w-screen h-screen p-6 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow-xl'>
                <Dialog.Title
                  as='h3'
                  className='flex items-center justify-between w-full mb-10 text-lg font-medium leading-6 text-gray-900 capitalize'>
                  <p className='inline-block'>
                    Notes containg `<span className='underline'>{tag}</span>`
                    tag
                  </p>
                  <button onClick={closeModal} className='inline-block'>
                    <HiOutlineXCircle className='text-gray-600 w-7 h-7' />
                  </button>
                </Dialog.Title>
                <div className='mt-3'>
                  {notesData?.map((note) => (
                    <Link key={note.id} href={`/app/notes/${note.id}`}>
                      <a className='block'>
                        <div className='p-3 my-4 border border-gray-500 rounded shadow-md hover:bg-gray-50'>
                          <h3 className='text-lg text-gray-900'>
                            {note.noteHeading}
                          </h3>
                          <div className='my-2'>
                            {note?.tags?.map((tag) => (
                              <NoteTag key={tag} tag={tag} />
                            ))}
                          </div>
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>

                <div className='mt-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded my-14 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                    onClick={closeModal}>
                    {'<-'} Go Back
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

export default TagNotesViewer;
