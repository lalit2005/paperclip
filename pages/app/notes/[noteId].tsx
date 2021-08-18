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
import EditPopover from '@/components/note/EditPopover'
import { HiOutlineCog, HiOutlineMenuAlt1 } from 'react-icons/hi'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { Fab, Action } from 'react-tiny-fab'
import 'react-tiny-fab/dist/styles.css'
import Link from 'next/link'

const index = () => {
  const router = useRouter()
  const { data: note, mutate } = useSWR<notes>(
    `/api/notes/get-note/?noteId=${router.query.noteId}`,
    fetcher
  )
  useEffect(() => {
    window.onbeforeunload = function () {
      return ''
    }
  }, [])

  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsMenuModalOpen(false)
    setIsOpen(true)
  }

  const [isMenuModalOpen, setIsMenuModalOpen] = useState<boolean>(false)

  function closeMenuModal() {
    setIsMenuModalOpen(false)
  }

  function openMenuModal() {
    setIsOpen(false)
    setIsMenuModalOpen(true)
  }
  const isAnyModalOpen = isOpen || isMenuModalOpen
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
      <div className='w-screen max-w-5xl'>
        <Link href='/app/notes'>
          <a className='block mb-5 text-gray-500'>{'<-'} Go Back</a>
        </Link>
      </div>
      <div className='max-w-5xl pt-16 mx-auto px-7'>
        <div className='items-start justify-start sm:flex group'>
          <span className='inline-block mr-5 text-4xl font-bold'>
            {note?.emoji}
          </span>
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
              <div className='inline-block max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow-xl'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'>
                  {note?.noteHeading}'s Settings
                </Dialog.Title>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'></p>
                </div>

                <div className='mt-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                    onClick={closeMenuModal}>
                    Save settings
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default withPageAuthRequired(index)
