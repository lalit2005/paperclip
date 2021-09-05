/* eslint-disable react-hooks/rules-of-hooks */
import Note from '@/components/note/Note';
import NoteTag from '@/components/note/NoteTag';
import fetcher from '@/lib/fetcher';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { notes } from '@prisma/client';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { useEffect } from 'react';
import Head from 'next/head';
import EditPopover from '@/components/note/EditPopover';
import { HiOutlineCog, HiOutlineMenuAlt1 } from 'react-icons/hi';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Fab } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import Link from 'next/link';
import MenuBarTooltip from '@/components/note/Tooltip';
import * as Checkbox from '@radix-ui/react-checkbox';
import { HiCheck } from 'react-icons/hi';
import axios from 'axios';
import toast from 'react-hot-toast';
import html2md from 'html-to-md';
import Script from 'next/script';

const index = () => {
  const router = useRouter();
  const { data: note, mutate } = useSWR<notes>(
    `/api/notes/get-note/?noteId=${router.query.noteId}`,
    fetcher
  );
  useEffect(() => {
    window.onbeforeunload = function () {
      return '';
    };
  }, []);
  let [isOpen, setIsOpen] = useState(false);
  const [isNotePublic, setIsNotePublic] = useState(note?.isPublic);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsMenuModalOpen(false);
    setIsOpen(true);
  }

  const [isMenuModalOpen, setIsMenuModalOpen] = useState<boolean>(false);

  function closeMenuModal() {
    setIsMenuModalOpen(false);
  }

  function openMenuModal() {
    setIsOpen(false);
    setIsMenuModalOpen(true);
  }
  const isAnyModalOpen = isOpen || isMenuModalOpen;
  return (
    <div className='min-h-screen px-10 bg-gray-50'>
      <Head>
        <title>
          {note?.noteHeading || 'Note'} {'| ' + note?.noteDescription}
        </title>
        <link
          rel='shortcut icon'
          href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${note?.emoji}</text></svg>`}
          type='image/x-icon'
        />
      </Head>
      <Script
        src='https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js'
        strategy='lazyOnload'
      />
      {!isAnyModalOpen && (
        <div style={{ zoom: '0.8' }}>
          <Fab
            icon={<HiOutlineMenuAlt1 />}
            event='click'
            alwaysShowTitle
            onClick={openMenuModal}
          />
        </div>
      )}
      <DashboardNav />
      <div className='max-w-5xl pt-16 mx-auto px-7'>
        <Link href='/app/notes'>
          <a className='block mb-5 text-gray-500'>{'<-'} Go Back</a>
        </Link>
        <div className='items-start justify-start sm:flex group'>
          <MenuBarTooltip text={`Change emoji for ${note?.noteHeading}`}>
            <span
              className='relative inline-block p-2 mr-5 text-4xl font-bold rounded cursor-pointer bottom-2 hover:bg-gray-300'
              onClick={openModal}>
              {note?.emoji}
            </span>
          </MenuBarTooltip>
          <div className='inline-block'>
            <h1 className='text-4xl font-bold'>
              {note?.noteHeading}{' '}
              {note && (
                <>
                  <HiOutlineCog
                    onClick={openModal}
                    className='relative inline-block w-6 h-6 text-gray-600 transition-all opacity-0 cursor-pointer bottom-px group-hover:opacity-100'
                  />
                  <EditPopover
                    isOpen={isOpen}
                    closeModal={closeModal}
                    noteTitle={note?.noteHeading}
                    noteDesc={note?.noteDescription}
                    noteTags={note?.tags}
                    noteId={note?.id}
                    mutate={mutate}
                    noteData={note}
                    noteEmoji={note?.emoji}
                  />
                </>
              )}
            </h1>
            <div className='mt-4 text-lg text-gray-500'>
              <h2>{note?.noteDescription} </h2>
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
            <Note
              noteId={router.query.noteId.toString()}
              noteContent={note?.note}
              isModalOpen={isAnyModalOpen}
              mutate={mutate}
            />
          )}
        </div>
      </div>
      <Transition appear show={isMenuModalOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto'
          onClose={closeMenuModal}>
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
              <div className='inline-block max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow-xl'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'>
                  {note?.noteHeading}&apos;s Settings
                </Dialog.Title>
                <div className='mt-2'>
                  <div className='flex items-center mb-2'>
                    <Checkbox.Root
                      id='check'
                      checked={isNotePublic}
                      onCheckedChange={(isChecked) => {
                        // @ts-ignore
                        setIsNotePublic(isChecked);
                      }}
                      className='inline-flex items-center justify-center w-5 h-5 mr-2 text-gray-600 border border-gray-400 rounded shadow focus:ring focus:ring-gray-600 group checked:bg-gray-500 checked:text-gray-50'>
                      <Checkbox.Indicator>
                        <HiCheck />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <label htmlFor='check'>
                      Make {note?.noteHeading} public?
                    </label>
                  </div>
                  <div className='ml-5 text-base text-gray-600'>
                    {note?.isPublic ? (
                      <div>
                        Your note is currently public. View your note as website
                        at{' '}
                        <a
                          className='text-blue-500 hover:underline'
                          rel='noopener noreferrer'
                          target='_blank'
                          href={`${process.env.NEXT_PUBLIC_WEBSITE_BASE_URL}/p/${note?.publicId}`}>{`${process.env.NEXT_PUBLIC_WEBSITE_BASE_URL}/p/${note?.publicId}`}</a>
                      </div>
                    ) : (
                      <div>
                        You can convert your note to a public note/website by
                        selecting the checkbox above and hit that Save button
                        below.🤯
                      </div>
                    )}
                  </div>
                </div>
                <div className='my-4'>
                  <button
                    className='px-2 py-1 mr-2 border border-gray-300 rounded shadow'
                    onClick={() => {
                      // export note to md
                      const md = html2md(note?.note);

                      // download md
                      const element = document.createElement('a');
                      element.setAttribute(
                        'href',
                        'data:text/plain;charset=utf-8,' +
                          encodeURIComponent(md)
                      );
                      element.setAttribute(
                        'download',
                        `${note?.noteHeading}.md`
                      );
                      element.style.display = 'none';
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}>
                    Export as Markdown
                  </button>
                  <button
                    className='px-2 py-1 mr-2 border border-gray-300 rounded shadow'
                    onClick={() => {
                      // export note as html
                      const html = note?.note;
                      // download html
                      const element = document.createElement('a');
                      element.setAttribute(
                        'href',
                        'data:text/plain;charset=utf-8,' +
                          encodeURIComponent(html)
                      );
                      element.setAttribute(
                        'download',
                        `${note?.noteHeading}.html`
                      );
                      element.style.display = 'none';
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}>
                    Export as HTML (without any CSS)
                  </button>
                  <button
                    className='px-2 py-1 mr-2 border border-gray-300 rounded shadow'
                    onClick={() => {
                      window
                        // @ts-ignore
                        ?.html2pdf(document?.querySelector('.ProseMirror'), {
                          margin: [20, 10],
                          filename: `${note?.noteHeading}.pdf`,
                        });
                    }}>
                    Export as PDF
                  </button>
                </div>
                <div className='mt-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center px-4 py-2 mb-2 mr-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                    onClick={() => {
                      mutate({ ...note, isPublic: isNotePublic }, false);
                      const updateIsNotePublic = axios.post(
                        '/api/notes/public',
                        {
                          id: note?.id,
                          isNotePublic: isNotePublic,
                        }
                      );
                      toast.promise(
                        updateIsNotePublic,
                        {
                          error: 'Could not update note',
                          success: 'Note updated successfully',
                          loading: 'Updating note...',
                        },
                        {
                          duration: 5000,
                        }
                      );
                    }}>
                    Save settings
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500'
                    onClick={() => {
                      mutate({ ...note, inTrash: true }, false);
                      const updateIsNotePublic = axios.post(
                        '/api/notes/trash',
                        {
                          id: note?.id,
                          inTrash: true,
                        }
                      );
                      toast.promise(updateIsNotePublic, {
                        error: `Could not move ${note?.noteHeading} note`,
                        success:
                          'Note moved to trash successfully. View trash by clicking menu (profile picture)',
                        loading: `Moving ${note?.noteHeading} to trash...`,
                      });
                      closeMenuModal();
                      router.push('/app/notes');
                    }}>
                    Move
                    <span className='mx-1 font-extrabold'>
                      {note?.noteHeading}
                    </span>
                    to trash
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

export default withPageAuthRequired(index);
