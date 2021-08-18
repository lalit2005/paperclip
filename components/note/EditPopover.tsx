import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { newNoteValues } from 'types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import newNoteSchema from '@/lib/new-note-schema'
import axios from 'axios'
import toast from 'react-hot-toast'
import { notes } from '@prisma/client'
import tagsToString from '@/lib/convert-tags-to-string'
import getTagsFromString from '@/lib/get-tags-from-string'
import { useRouter } from 'next/router'

const EditPopover = ({
  isOpen,
  closeModal,
  noteTitle,
  noteDesc,
  noteTags,
  mutate,
  noteId,
  noteData,
}) => {
  const restOfNoteData: notes = noteData
  const router = useRouter()
  useEffect(() => {
    router.prefetch(`/app/notes/`)
  }, [])
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<newNoteValues>({
    defaultValues: {
      noteHeading: noteTitle,
      noteDescription: noteDesc,
      tags: tagsToString(noteTags),
    },
    resolver: zodResolver(newNoteSchema),
  })

  const updateNote = (values: newNoteValues) => {
    axios.post('/api/notes/update-note-metadata', {
      noteHeading: values.noteHeading,
      noteDescription: values.noteDescription,
      tags: values.tags,
      id: noteId,
    })
    closeModal()
    mutate(
      {
        ...restOfNoteData,
        noteHeading: values.noteHeading,
        noteDescription: values.noteDescription,
        tags: getTagsFromString(values.tags),
      },
      false
    )

    toast.success('Note settings updated')
  }

  let [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  function closeDeleteModal() {
    setIsDeleteModalOpen(false)
  }

  function openDeleteModalModal() {
    setIsDeleteModalOpen(true)
  }

  return (
    <>
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
              <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow-xl'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'>
                  Note settings
                </Dialog.Title>
                <form onSubmit={handleSubmit(updateNote)}>
                  <label className='block my-5'>
                    <span className='mb-2 text-gray-700'>Note title</span>
                    <input
                      type='text'
                      className='w-full px-2 py-1 mt-1 border border-gray-500 rounded shadow-sm focus:ring focus:ring-gray-300 focus:ring-offset-1 focus:outline-none'
                      placeholder='My awesome note'
                      {...register('noteHeading')}
                    />
                    <p className='text-sm text-red-600'>
                      {/* @ts-ignore */}
                      {errors.noteHeading && errors.noteHeading.message}
                    </p>
                  </label>
                  <label className='block my-5'>
                    <span className='mb-2 text-gray-700'>Note Description</span>
                    <input
                      type='text'
                      className='w-full px-2 py-1 mt-1 border border-gray-500 rounded shadow-sm focus:ring focus:ring-gray-300 focus:ring-offset-1 focus:outline-none'
                      placeholder='My awesome note'
                      {...register('noteDescription')}
                    />
                    <p className='text-sm text-red-600'>
                      {/* @ts-ignore */}
                      {errors.noteDescription && errors.noteDescription.message}
                    </p>
                  </label>
                  <label className='block my-5'>
                    <span className='mb-2 text-gray-700'>Tags</span>
                    <input
                      type='text'
                      className='w-full px-2 py-1 mt-1 border border-gray-500 rounded shadow-sm focus:ring focus:ring-gray-300 focus:ring-offset-1 focus:outline-none'
                      placeholder='My awesome note'
                      {...register('tags')}
                    />
                    <p className='text-sm text-red-600'>
                      {/* @ts-ignore */}
                      {errors.tags && errors.tags.message}
                    </p>
                  </label>
                  <div>
                    <button
                      type='submit'
                      className='px-3 py-1 my-3 bg-gray-900 rounded shadow text-gray-50 focus:outline-none focus:ring focus:ring-offset-1 focus:ring-gray-700'>
                      Save
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        // closeModal()
                        openDeleteModalModal()
                      }}
                      className='px-3 py-1 my-3 ml-3 bg-red-600 rounded shadow text-red-50 focus:outline-none focus:ring focus:ring-offset-1 focus:ring-red-400'>
                      Delete note
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <div>
        <Transition appear show={isDeleteModalOpen} as={Fragment}>
          <Dialog
            as='div'
            className='fixed inset-0 z-10 overflow-y-auto'
            onClose={closeDeleteModal}>
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
                <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'>
                    Are you sure you want to delete {noteTitle}?
                  </Dialog.Title>
                  <button
                    onClick={closeDeleteModal}
                    className='px-3 py-1 my-3 bg-gray-900 rounded shadow text-gray-50 focus:outline-none focus:ring focus:ring-offset-1 focus:ring-gray-700'>
                    Cancel
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      const deleteNoteRequest = axios
                        .post('/api/notes/delete-note', {
                          id: noteId,
                        })
                        .then(() => {
                          router.push('/app/notes')
                        })
                      toast.promise(deleteNoteRequest, {
                        loading: `Deleting ${noteTitle}...`,
                        error: `Error deleting ${noteTitle}.`,
                        success: 'Note deleted.',
                      })
                    }}
                    className='px-3 py-1 my-3 ml-3 bg-red-900 rounded shadow text-red-50 focus:outline-none focus:ring focus:ring-offset-1 focus:ring-red-700'>
                    Delete {noteTitle}
                  </button>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  )
}

export default EditPopover
