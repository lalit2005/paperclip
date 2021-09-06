/* eslint-disable react-hooks/rules-of-hooks */
import fetcher from '@/lib/fetcher';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { CodePlayground } from '@prisma/client';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import { Fab } from 'react-tiny-fab';
import { useForm } from 'react-hook-form';
import 'react-tiny-fab/dist/styles.css';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import CommandPalette from '@/components/dashboard/CommandPalette';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { PlaygroundData } from 'types/types';
import tagsToString from '@/lib/convert-tags-to-string';
import getTagsFromString from '@/lib/get-tags-from-string';
import * as Checkbox from '@radix-ui/react-checkbox';
import { HiCheck } from 'react-icons/hi';

const index = () => {
  const router = useRouter();
  const {
    data: playground,
    mutate,
    error,
  } = useSWR<CodePlayground>(
    `/api/playground/get-playground/?playgroundId=${router.query.playgroundId}`,
    fetcher
  );
  useEffect(() => {
    window.onbeforeunload = function () {
      return '';
    };
  }, []);

  let [isOpen, setIsOpen] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [isPlaygroundPublic, setisPlaygroundPublic] = useState(
    playground?.isPublic
  );
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    // @ts-ignore
    const editor: HTMLIFrameElement =
      document.getElementById('paperclip-editor');
    if (frameLoaded) {
      editor.contentWindow.postMessage(
        {
          sentByPaperclip: true,
          initialHTML: playground?.html,
          initialCss: playground?.css,
          initialJs: playground?.js,
        },
        '*'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameLoaded]);

  useEffect(() => {
    window.onmessage = (event) => {
      if (event.data.sentToPaperclip) {
        if (event.data.saveCode) {
          const updateReq = axios.post(
            `/api/playground/update-playground/?playgroundId=${router.query.playgroundId}`,
            {
              html: event.data.htmlCode,
              css: event.data.cssCode,
              js: event.data.jsCode,
              playgroundId: playground?.id,
            }
          );
          toast.promise(updateReq, {
            loading: `Saving playground`,
            error: 'Error saving playground',
            success: `Saved playground!!`,
          });
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (router.query.reload === 'yes') {
      router.push(`/app/playgrounds/${router.query.playgroundId}`);
    }
  }, [router]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<PlaygroundData>();

  const updatePlaygroundData = async (data: PlaygroundData) => {
    const tags = getTagsFromString(data.tags);
    const updatePlaygroundReq = await axios.post(
      '/api/playground/update-playground-metadata',
      {
        playgroundName: data.playgroundName,
        tags: tags,
        id: playground.id,
        isPlaygroundPublic: isPlaygroundPublic,
      }
    );
    mutate({
      ...playground,
      playgroundName: data.playgroundName,
      tags,
      isPublic: isPlaygroundPublic,
    });
    toast.success(`Updated playground!!`);
    closeModal();
  };

  return (
    <div className='w-screen h-screen'>
      <Head>
        <title>{playground?.playgroundName} | Paperclip</title>
      </Head>
      {/* {JSON.stringify(note, null, 2)} */}
      <CommandPalette />
      {!playground && (
        <div className='flex items-center mt-[30vh] justify-center h-full w-scree'>
          Loading...
        </div>
      )}
      {playground && (
        <div style={{ zoom: 0.8 }}>
          <Fab
            icon={<HiOutlineMenuAlt1 />}
            event='hover'
            alwaysShowTitle={false}
            onClick={openModal}
            text={playground?.playgroundName + "'s settings"}
            style={{
              left: '15px',
              bottom: '15px',
            }}
          />
        </div>
      )}
      {playground && (
        <iframe
          src={process.env.NEXT_PUBLIC_PLAYGROUND_URL}
          frameBorder='0'
          allow='clipboard-read; clipboard-write; allow-popups; allow-downloads; allow-modals;'
          id='paperclip-editor'
          onLoad={() => setFrameLoaded(true)}
          className='!w-screen h-full'>
          Loading...
        </iframe>
      )}
      <Toaster />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto'
          onClose={closeModal}>
          <div className='min-h-screen px-4 text-center'>
            {playground && (
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
                      {playground?.playgroundName}&apos;s Settings
                    </Dialog.Title>
                    <div className='mt-4'>
                      <form onSubmit={handleSubmit(updatePlaygroundData)}>
                        <label className='block my-5'>
                          <span className='mb-2 text-gray-700'>
                            Whiteboard title
                          </span>
                          <input
                            type='text'
                            className='w-full px-2 py-1 mt-1 border border-gray-500 rounded shadow-sm focus:ring focus:ring-gray-300 focus:ring-offset-1 focus:outline-none'
                            placeholder='My awesome note'
                            defaultValue={playground?.playgroundName}
                            {...register('playgroundName', {
                              required: {
                                value: true,
                                message:
                                  'Please enter a title for your playground',
                              },
                              minLength: 1,
                            })}
                          />
                          <p className='text-sm text-red-600'>
                            {errors.playgroundName &&
                              errors.playgroundName.message}
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
                            defaultValue={tagsToString(playground?.tags)}
                            {...register('tags')}
                          />
                          <p className='text-sm text-red-600'>
                            {/* @ts-ignore */}
                            {errors.tags && errors.tags.message}
                          </p>
                        </label>
                        <div className='flex items-center'>
                          <Checkbox.Root
                            id='check'
                            checked={isPlaygroundPublic}
                            onCheckedChange={(isChecked) => {
                              // @ts-ignore
                              setisPlaygroundPublic(isChecked);
                            }}
                            className='inline-flex items-center justify-center w-5 h-5 mr-2 text-gray-600 border border-gray-400 rounded shadow focus:ring focus:ring-gray-600 group checked:bg-gray-500 checked:text-gray-50'>
                            <Checkbox.Indicator>
                              <HiCheck />
                            </Checkbox.Indicator>
                          </Checkbox.Root>
                          <label htmlFor='check'>
                            Make {playground?.playgroundName} public?
                          </label>
                        </div>
                        <div className='ml-5 text-base text-gray-600'>
                          {playground?.isPublic ? (
                            <div>
                              Your playground is currently public. View your
                              playground at{' '}
                              <a
                                className='text-blue-500 hover:underline'
                                rel='noopener noreferrer'
                                target='_blank'
                                href={`${process.env.NEXT_PUBLIC_WEBSITE_BASE_URL}/c/${playground?.publicId}`}>{`${process.env.NEXT_PUBLIC_WEBSITE_BASE_URL}/c/${playground?.publicId}`}</a>
                            </div>
                          ) : (
                            <div>
                              You can convert your playground to a public
                              playground by selecting the checkbox above and hit
                              that Save button below. You can embed it anywhere
                              too!
                            </div>
                          )}
                        </div>
                        <button className='inline-flex justify-center px-4 py-2 mt-5 mb-2 mr-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'>
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
    </div>
  );
};

export default withPageAuthRequired(index);
