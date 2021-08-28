import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { whiteboards } from '@prisma/client';
import DashboardLayout from 'layouts/DashboardLayout';
import { useRouter } from 'next/router';
import { Fab } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import useSWR, { mutate } from 'swr';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { WhiteboardData } from 'types/types';
import tagsToString from '@/lib/convert-tags-to-string';
import getTagsFromString from '@/lib/get-tags-from-string';
import axios from 'axios';
import toast from 'react-hot-toast';

const Page = () => {
  const router = useRouter();
  const { whiteboardId } = router.query;
  const { data, mutate } = useSWR<whiteboards>(
    `/api/whiteboard/get-board/?boardId=${whiteboardId}`
  );

  let [isOpen, setIsOpen] = useState(false);

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

  const [boardLoaded, setBoardLoaded] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<WhiteboardData>();

  const updateBoard = (formData: WhiteboardData) => {
    const newTags = getTagsFromString(formData.tags);
    const updateBoardReq = axios.post('/api/whiteboard/update-board-metadata', {
      id: data?.id,
      boardName: formData?.boardName,
      boardDescription: formData?.boardDescription,
      tags: newTags,
    });
    toast.promise(updateBoardReq, {
      error: 'Could not update board',
      success: 'Board metadata',
      loading: 'Updating board',
    });
    mutate(
      {
        ...data,
        tags: newTags,
        boardName: formData.boardName,
        boardDescription: formData.boardDescription,
      },
      false
    );
    closeMenuModal();
  };

  return (
    <DashboardLayout className='!w-screen !-mt-10'>
      {data && (
        <div style={{ zoom: 0.8 }}>
          <Fab
            icon={<HiOutlineMenuAlt1 />}
            event='hover'
            alwaysShowTitle={false}
            onClick={openMenuModal}
            text={data?.boardName + "'s settings"}
            style={{
              left: '15px',
              bottom: '50px',
            }}
          />
        </div>
      )}
      {(!boardLoaded || !data) && (
        <div className='flex items-center mt-[30vh] justify-center h-full w-scree'>
          Loading...
        </div>
      )}
      <iframe
        src={data?.boardUrl}
        id='excalidraw-iframe'
        frameBorder='0'
        allowFullScreen
        allowTransparency
        className='w-screen h-[90vh]'
        onLoad={() => setBoardLoaded(true)}
        allow='clipboard-read; clipboard-write; allow-popups; allow-downloads; allow-modals;'
      />
      <Transition appear show={isMenuModalOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto'
          onClose={closeMenuModal}>
          <div className='min-h-screen px-4 text-center'>
            {data && (
              <div>
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
                      {data?.boardName}&apos;s Settings
                    </Dialog.Title>
                    <div className='mt-4'>
                      <form onSubmit={handleSubmit(updateBoard)}>
                        <label className='block my-5'>
                          <span className='mb-2 text-gray-700'>
                            Whiteboard title
                          </span>
                          <input
                            type='text'
                            className='w-full px-2 py-1 mt-1 border border-gray-500 rounded shadow-sm focus:ring focus:ring-gray-300 focus:ring-offset-1 focus:outline-none'
                            placeholder='My awesome note'
                            defaultValue={data?.boardName}
                            {...register('boardName')}
                          />
                          <p className='text-sm text-red-600'>
                            {/* @ts-ignore */}
                            {errors.boardName && errors.boardName.message}
                          </p>
                        </label>
                        <label className='block my-5'>
                          <span className='mb-2 text-gray-700'>
                            Whiteboard description
                          </span>
                          <input
                            type='text'
                            className='w-full px-2 py-1 mt-1 border border-gray-500 rounded shadow-sm focus:ring focus:ring-gray-300 focus:ring-offset-1 focus:outline-none'
                            placeholder='My awesome note'
                            defaultValue={data?.boardDescription}
                            {...register('boardDescription')}
                          />
                          <p className='text-sm text-red-600'>
                            {/* @ts-ignore */}
                            {errors.boardDescription &&
                              errors.boardDescription.message}
                          </p>
                        </label>
                        <label className='block my-5'>
                          <span className='mb-2 text-gray-700'>
                            Whiteboard tags
                          </span>
                          <input
                            type='text'
                            className='w-full px-2 py-1 mt-1 border border-gray-500 rounded shadow-sm focus:ring focus:ring-gray-300 focus:ring-offset-1 focus:outline-none'
                            placeholder='My awesome note'
                            defaultValue={tagsToString(data?.tags)}
                            {...register('tags')}
                          />
                          <p className='text-sm text-red-600'>
                            {/* @ts-ignore */}
                            {errors.tags && errors.tags.message}
                          </p>
                        </label>
                        <button className='inline-flex justify-center px-4 py-2 mb-2 mr-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'>
                          Save settings
                        </button>
                      </form>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            )}
          </div>
        </Dialog>
      </Transition>
    </DashboardLayout>
  );
};

export default withPageAuthRequired(Page);
