import StickyNote from '@/components/stickyNote/StickyNote';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { UserProfile, withPageAuthRequired } from '@auth0/nextjs-auth0';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { stickyNotes } from '@prisma/client';
import { HiOutlineCheck, HiOutlineSelector } from 'react-icons/hi';
import ExpandingTextarea from 'react-expanding-textarea';
import axios from 'axios';
import DashboardLayout from 'layouts/DashboardLayout';
import Head from 'next/head';

const StickyNotesPage: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { data: stickyNotesData, mutate } = useSWR<stickyNotes[]>(
    '/api/sticky-notes/get-all-sticky-notes'
  );
  const colors = [
    { color: 'blue' },
    { color: 'green' },
    { color: 'purple' },
    { color: 'red' },
    { color: 'gray' },
  ];
  const [selected, setSelected] = useState(colors[0]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newStickyNote, setNewStickyNote] = useState('');

  return (
    <div>
      <Head>
        <title>{user.name || user.nickname}&apos;s sticky notes</title>
      </Head>
      <DashboardLayout>
        <div className='max-w-4xl mx-auto'>
          <div>
            <h1 className='pb-20 text-4xl font-extrabold text-center mb-44'>
              Your Sticky notes 📝
              <div className='w-full text-center'>
                <button
                  onClick={() => {
                    console.log(selected);
                    setIsModalOpen(true);
                  }}
                  className='px-4 py-1 text-sm text-center bg-gray-900 rounded shadow text-gray-50 hover:bg-gray-700 opacity-60'>
                  + New sticky note
                </button>
              </div>
            </h1>
          </div>
          <div className='sticky-notes-container'>
            <div className='flex flex-wrap mx-auto sticky-notes-div gap-x-2'>
              {stickyNotesData?.map((note) => {
                return (
                  <StickyNote
                    note={note.stickyNote}
                    color={note.color}
                    stickyNoteId={note.id}
                    key={note.id}
                    mutate={mutate}
                    createdAt={note.createdAt}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog
            as='div'
            className='fixed inset-0 z-10 overflow-y-auto'
            onClose={() => {
              setIsModalOpen(false);
            }}>
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
              <span
                className='inline-block h-screen align-middle bg-gray-400'
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
                <div className='inline-block w-full max-w-2xl p-6 pb-16 min-h-[400px] my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow-xl bor'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'>
                    Create new sticky note
                  </Dialog.Title>
                  <div className='w-full py-4 text-base text-gray-700'>
                    <p className='font-medium text-md'>Sticky note</p>
                    <ExpandingTextarea
                      onChange={(e) => {
                        setNewStickyNote(e.currentTarget.value);
                      }}
                      autoFocus
                      className='w-full p-2 mt-2 text-base text-gray-700 border border-gray-400 rounded outline-none resize-none'
                    />
                    <p className='mt-10 font-medium text-md'>Color</p>
                    <Listbox value={selected} onChange={setSelected}>
                      <div className='relative mt-1'>
                        <Listbox.Button className='relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm'>
                          <span className='block truncate'>
                            {selected.color}
                          </span>
                          <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                            <HiOutlineSelector
                              className='w-5 h-5 text-gray-400'
                              aria-hidden='true'
                            />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave='transition ease-in duration-100'
                          leaveFrom='opacity-100'
                          leaveTo='opacity-0'>
                          <Listbox.Options className='absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                            {colors.map((clr, clrIdx) => (
                              <Listbox.Option
                                key={clrIdx}
                                className={({ active }) =>
                                  `${
                                    active
                                      ? 'text-blue-900 bg-blue-100'
                                      : 'text-gray-900'
                                  }
                          cursor-default select-none relative py-2 pl-10 pr-4`
                                }
                                value={clr}>
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={`${
                                        selected ? 'font-medium' : 'font-normal'
                                      } block truncate`}>
                                      {clr.color}
                                    </span>
                                    {selected ? (
                                      <span
                                        className={`${
                                          active
                                            ? 'text-blue-600'
                                            : 'text-blue-600'
                                        }
                                absolute inset-y-0 left-0 flex items-center pl-3`}>
                                        <HiOutlineCheck
                                          className='w-5 h-5 text-blue-600'
                                          aria-hidden='true'
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                    <button
                      className='block px-4 py-1 mt-5 text-sm bg-gray-900 rounded shadow text-gray-50 hover:bg-gray-700'
                      onClick={() => {
                        const newNote = axios
                          .post('/api/sticky-notes/create-sticky-note', {
                            color: selected.color,
                            stickyNote: newStickyNote,
                          })
                          .then(() => {
                            setIsModalOpen(false);
                            mutate();
                          })
                          .catch(() => setIsModalOpen(false));
                        toast.promise(newNote, {
                          loading: 'Creating new sticky note...',
                          success: 'New sticky note created!',
                          error: 'Could not create new sticky note.',
                        });
                      }}>
                      Create
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </DashboardLayout>
    </div>
  );
};
export default withPageAuthRequired(StickyNotesPage);
