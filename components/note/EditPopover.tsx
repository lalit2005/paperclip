import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { newNoteValues } from 'types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import newNoteSchema from '@/lib/new-note-schema';
import axios from 'axios';
import toast from 'react-hot-toast';
import { notes } from '@prisma/client';
import tagsToString from '@/lib/convert-tags-to-string';
import getTagsFromString from '@/lib/get-tags-from-string';
import { useRouter } from 'next/router';
import * as Popover from '@radix-ui/react-popover';
// import { Picker } from 'emoji-mart'
// import 'emoji-mart/css/emoji-mart.css'
import Picker from './EmojiPicker';

const EditPopover = ({
  isOpen,
  closeModal,
  noteTitle,
  noteDesc,
  noteTags,
  mutate,
  noteId,
  noteData,
  noteEmoji,
}) => {
  const restOfNoteData: notes = noteData;

  const router = useRouter();

  useEffect(() => {
    router.prefetch(`/app/notes/`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  });

  const [emoji, setEmoji] = useState<string>(noteEmoji);

  const updateNote = (values: newNoteValues) => {
    axios.post('/api/notes/update-note-metadata', {
      noteHeading: values.noteHeading,
      noteDescription: values.noteDescription,
      tags: values.tags,
      id: noteId,
      emoji: emoji,
    });
    closeModal();
    mutate(
      {
        ...restOfNoteData,
        noteHeading: values.noteHeading,
        noteDescription: values.noteDescription,
        tags: getTagsFromString(values.tags),
        emoji: emoji,
      },
      false
    );

    toast.success('Note settings updated');
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto'
          onClose={console.log}>
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
                    <p className='mb-2 text-gray-700'>Emoji</p>
                    <Popover.Root>
                      <Popover.Trigger>
                        <button
                          type='button'
                          className='block px-3 py-1 rounded shadow bg-gray-50 hover:bg-gray-100'>
                          Emoji - {emoji}
                        </button>
                        <small>Click to change the emoji</small>
                      </Popover.Trigger>
                      <Popover.Anchor />
                      <Popover.Content>
                        <Picker emoji={emoji} setEmoji={setEmoji} />
                      </Popover.Content>
                    </Popover.Root>
                  </label>
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
                    <small className='text-gray-500'>
                      Comma separated list of tags
                    </small>
                  </label>
                  <div>
                    <button
                      type='submit'
                      className='px-3 py-1 my-3 bg-gray-900 rounded shadow text-gray-50 focus:outline-none focus:ring focus:ring-offset-1 focus:ring-gray-700'>
                      Save
                    </button>
                    <button
                      type='button'
                      onClick={closeModal}
                      className='px-3 py-1 my-3 ml-2 text-gray-900 rounded shadow bg-gray-50 focus:outline-none focus:ring focus:ring-offset-1 focus:ring-gray-700'>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default EditPopover;
