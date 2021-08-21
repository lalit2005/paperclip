import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { newBoardValues } from 'types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import newBoardSchema from '@/lib/new-board-schema'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

const NewBoardModal = ({ closeModal, openModal, isOpen, mutate, ...props }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<newBoardValues>({
    resolver: zodResolver(newBoardSchema),
  })

  const router = useRouter()

  const createNewBoard = (data: newBoardValues) => {
    alert(JSON.stringify(data))
    const createNewboard = axios
      .post('/api/whiteboard/create-board', {
        ...data,
      })
      .then((res) => {
        router.push('/app/whiteboard/' + res.data.id)
        closeModal()
      })
    toast.promise(createNewboard, {
      loading: 'Creating new board...',
      error: 'Error creating new board',
      success: `${data.boardName} created`,
    })
  }

  return (
    <>
      <div>{props.children}</div>

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
              <Dialog.Overlay className='fixed inset-0' />
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
                  Payment successful
                </Dialog.Title>
                <div className='my-2'>
                  <form onSubmit={handleSubmit(createNewBoard)}>
                    <label className='block my-5'>
                      <span className='mb-2 text-gray-700'>board title</span>
                      <input
                        type='text'
                        className='w-full px-2 py-1 mt-1 border border-gray-500 rounded shadow-sm focus:ring focus:ring-gray-300 focus:ring-offset-1 focus:outline-none'
                        placeholder='My awesome board'
                        {...register('boardName')}
                      />
                      <p className='text-sm text-red-600'>
                        {/* @ts-ignore */}
                        {errors.boardName && errors.boardName.message}
                      </p>
                    </label>
                    <label className='block my-5'>
                      <span className='mb-2 text-gray-700'>
                        board Description
                      </span>
                      <input
                        type='text'
                        className='w-full px-2 py-1 mt-1 border border-gray-500 rounded shadow-sm focus:ring focus:ring-gray-300 focus:ring-offset-1 focus:outline-none'
                        placeholder='Description...'
                        {...register('boardDescription')}
                      />
                      <p className='text-sm text-red-600'>
                        {errors.boardDescription &&
                          //  @ts-ignore
                          errors.boardDescription.message}
                      </p>
                    </label>
                    <div className='mt-4'>
                      <button
                        type='submit'
                        className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'>
                        Start writing {'->'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default NewBoardModal
