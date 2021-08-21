/* eslint-disable react-hooks/rules-of-hooks */
import NoteTag from '@/components/note/NoteTag'
import SearchInput from '@/components/note/SearchInput'
import fetcher from '@/lib/fetcher'
import { UserProfile, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { notes as notesType, whiteboards } from '@prisma/client'
import DashboardLayout from 'layouts/DashboardLayout'
import Link from 'next/link'
import useSWR from 'swr'
import Fuse from 'fuse.js'
import Skeleton from 'react-loading-skeleton'
import Head from 'next/head'
import NewBoardModal from '@/components/whiteboard/NewBoardModal'
import * as Checkbox from '@radix-ui/react-checkbox'
import { HiCheck } from 'react-icons/hi'
import getUniqueTags from '@/lib/get-unique-tags'
import TagNotesViewer from '@/components/note/TagNotesViewer'
import getNotesDataByTags from '@/lib/get-notes-data-by-tags'
import searchTags from '@/lib/search-tags'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

const index: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { data: boards, mutate } = useSWR<whiteboards[]>(
    '/api/whiteboard/get-all-boards',
    fetcher
  )
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <div>
      <Head>
        <title>{user.name || user.nickname}&apos;s Whiteboards</title>
      </Head>
      <DashboardLayout>
        <h1 className='mb-16 text-4xl font-extrabold text-center'>
          Your Whiteboards 🎨
        </h1>
        <div className='w-full text-right'>
          <NewBoardModal
            isOpen={isOpen}
            closeModal={closeModal}
            openModal={openModal}
            mutate={mutate}>
            <button
              type='button'
              onClick={openModal}
              className='inline-block px-3 py-1 my-3 bg-gray-800 rounded shadow text-gray-50 focus:ring focus:ring-offset-1 focus:ring-gray-500'>
              + Create New Whiteboard
            </button>
          </NewBoardModal>
        </div>
        <div className='flex flex-wrap items-center justify-around'>
          {boards?.map((board) => (
            <div
              key={board.id}
              className='mx-auto my-3 border border-gray-500 rounded shadow'>
              <Link
                href={`/app/whiteboard/[boardId]`}
                as={`/app/whiteboard/${board.id}`}>
                <a>
                  <div className='w-full max-w-3xl px-5 py-2'>
                    <h2 className='mb-4 text-2xl font-extrabold'>
                      {board.boardName}
                    </h2>
                    <p className='text-base text-gray-500'>
                      {board.boardDescription}
                    </p>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </DashboardLayout>
    </div>
  )
}

export default withPageAuthRequired(index)
