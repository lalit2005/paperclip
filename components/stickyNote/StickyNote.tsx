/* eslint-disable react-hooks/rules-of-hooks */
import {
  HiDocumentDuplicate,
  HiPencil,
  HiOutlineArrowsExpand,
  HiOutlineTrash,
} from 'react-icons/hi';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import ExpandingTextarea from 'react-expanding-textarea';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

export default function stickyNotes(props) {
  function convertToTailwindBgColor(
    color: 'blue' | 'green' | 'gray' | 'purple' | 'red'
  ) {
    const colorsObj = {
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      gray: 'bg-gray-200',
      purple: 'bg-purple-100',
      red: 'bg-red-100',
    };
    return colorsObj[color];
  }
  function convertToTailwindBorderColor(
    color: 'blue' | 'green' | 'gray' | 'purple' | 'red'
  ) {
    const colorsObj = {
      blue: 'border-blue-300',
      green: 'border-green-300',
      gray: 'border-gray-300',
      purple: 'border-purple-300',
      red: 'border-red-300',
    };
    return colorsObj[color];
  }

  const { note, color, id } = props;
  const tailwindBgColor = convertToTailwindBgColor(color);
  const tailwindBorderColor = convertToTailwindBorderColor(color);

  const words: string[] = note.split(' ');
  const newWords = words.map((word: string): string => {
    if (word.length > 20) {
      word = word.substr(0, 20) + '…\n';
    }
    return word;
  });

  let substringedNote: string = '';
  newWords.forEach((word: string) => {
    substringedNote += word + ' ';
  });

  const [isEditModalOpen, setEditModalIsOpen] = useState(false);
  const [isViewModalOpen, setViewModalIsOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [textareaValue, setTextareaValue] = useState<string>(note);

  const copyToClipBoard = () => {
    window.navigator.clipboard
      .writeText(note)
      .then(() => {
        toast.success('Copied to clipboard!!');
      })
      .catch((e) => {
        toast.error('Could not copy to clipboard');
      });
  };

  return (
    <div className='inline-block mx-auto -mt-44'>
      <div
        className={`sticky-note-container flex overflow-hidden items-start rounded-sm w-64 px-5 py-3 ${tailwindBgColor} mc h-60 justify-items-center shadow-md ${tailwindBorderColor} border hover:border-none hover:border-transparent`}>
        <p>{substringedNote}</p>
      </div>
      <div className='relative left-0 flex items-center px-4 py-3 bg-transparent rounded-md -top-60 bc backdrop-filter hover:backdrop-blur-sm justify-items-center h-60 hover:border-transparent'>
        <button
          onClick={() => {
            setEditModalIsOpen(true);
          }}
          tabIndex={id}
          className='.btn z-50 mx-auto flex justify-between items-center border border-gray-600 hover:bg-gray-100 bg-white text-gray-800 text-opacity-70 opacity-0 focus:ring-1 focus:ring-offset-gray-500 focus:ring-gray-800 focus:outline-none px-2 rounded py-1'>
          <HiPencil className='inline-block w-6 h-6' />
        </button>
        <button
          tabIndex={id + 1}
          onClick={copyToClipBoard}
          className='.btn z-50 mx-auto flex justify-between items-center border border-gray-600 hover:bg-gray-100 bg-white text-gray-800 text-opacity-70 opacity-0 focus:ring-1 focus:ring-offset-gray-500 focus:ring-gray-800 focus:outline-none px-2 rounded py-1'>
          <HiDocumentDuplicate className='inline-block w-6 h-6' />
        </button>
        <button
          tabIndex={id + 2}
          onClick={() => {
            const deleteNote = axios
              .post('/api/sticky-notes/delete-sticky-note', {
                id: props.stickyNoteId,
              })
              .then(() => {
                props.mutate();
                setViewModalIsOpen(false);
              })
              .catch(() => {
                setViewModalIsOpen(false);
              });
            toast.promise(deleteNote, {
              loading: 'Deleting note...',
              error: 'Your sticky note could not be deleted. Please try again',
              success: 'Sticky note deleted successfully',
            });
          }}
          className='.btn z-50 mx-auto flex justify-between items-center border border-gray-600 hover:bg-gray-100 bg-white text-gray-800 text-opacity-70 opacity-0 focus:ring-1 focus:ring-offset-gray-500 focus:ring-gray-800 focus:outline-none px-2 rounded py-1'>
          <HiOutlineTrash className='inline-block w-6 h-6' />
        </button>
        <button
          tabIndex={id + 3}
          onClick={() => {
            setViewModalIsOpen(true);
          }}
          className='.btn z-50 mx-auto flex justify-between items-center border border-gray-600 hover:bg-gray-100 bg-white text-gray-800 text-opacity-70 opacity-0 focus:ring-1 focus:ring-offset-gray-500 focus:ring-gray-800 focus:outline-none px-2 rounded py-1'>
          <HiOutlineArrowsExpand className='inline-block w-6 h-6' />
        </button>
      </div>
      <div className='modals-container'>
        <Transition appear show={isEditModalOpen} as={Fragment}>
          <Dialog
            as='div'
            className='fixed inset-0 z-10 overflow-y-auto'
            onClose={() => {
              setEditModalIsOpen(false);
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
                <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow-xl bor'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'>
                    Edit your sticky note
                  </Dialog.Title>
                  <div>
                    <ExpandingTextarea
                      onChange={(e) => {
                        setTextareaValue(e.currentTarget.value);
                        setDisabled(false);
                      }}
                      autoFocus
                      defaultValue={note}
                      className='w-full py-3 text-base text-gray-700 outline-none resize-none'
                    />
                  </div>

                  <div>
                    <button
                      type='button'
                      disabled={disabled}
                      className='inline-flex justify-center px-4 py-1 mr-3 text-sm font-medium text-gray-900 rounded-sm disabled:hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 bg-gray-50 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500'
                      onClick={() => {
                        const updatedNote = axios
                          .post('/api/sticky-notes/update-sticky-note', {
                            id: props.stickyNoteId,
                            stickyNote: textareaValue,
                          })
                          .then(() => {
                            setEditModalIsOpen(false);
                            props.mutate();
                          });
                        toast.promise(updatedNote, {
                          loading: 'Updating sticky note...',
                          error:
                            'Your sticky note could not be updated. Please try again',
                          success: 'Sticky note updated successfully!!',
                        });
                      }}>
                      Save
                    </button>
                    <button
                      type='button'
                      className='inline-flex justify-center px-4 py-1 mr-3 text-sm font-medium text-gray-900 rounded-sm bg-gray-50 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500'
                      onClick={() => {
                        setEditModalIsOpen(false);
                      }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
        {/* ----- */}
        <Transition appear show={isViewModalOpen} as={Fragment}>
          <Dialog
            as='div'
            className='fixed inset-0 z-10 overflow-y-auto'
            onClose={() => {
              setViewModalIsOpen(false);
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
                <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow-xl bor'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'>
                    Your awesome sticky note
                  </Dialog.Title>
                  <div className='w-full py-4 text-base text-gray-700'>
                    <p>{note}</p>
                  </div>
                  <div className='my-3 text-sm text-gray-600'>
                    Created at {new Date(props.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <button
                      type='button'
                      className='inline-flex justify-center px-4 py-1 mr-3 text-sm font-medium text-gray-900 rounded-sm bg-gray-50 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500'
                      onClick={() => {
                        setViewModalIsOpen(false);
                      }}>
                      Close
                    </button>
                    <button
                      type='button'
                      className='inline-flex justify-center px-4 py-1 mr-3 text-sm font-medium text-gray-900 rounded-sm bg-gray-50 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500'
                      onClick={() => {
                        copyToClipBoard();
                        setViewModalIsOpen(false);
                      }}>
                      Copy & close
                    </button>
                    <button
                      type='button'
                      className='inline-flex justify-center px-4 py-1 text-sm font-medium text-gray-900 bg-red-200 rounded-sm hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500'
                      onClick={() => {
                        const deleteNote = axios
                          .post('/api/sticky-notes/delete-sticky-note', {
                            id: props.stickyNoteId,
                          })
                          .then(() => {
                            setViewModalIsOpen(false);
                            props.mutate();
                          })
                          .catch(() => {
                            setViewModalIsOpen(false);
                          });
                        toast.promise(deleteNote, {
                          loading: 'Deleting note...',
                          error:
                            'Your sticky note could not be deleted. Please try again',
                          success: 'Sticky note deleted successfully',
                        });
                      }}>
                      <HiOutlineTrash className='relative inline-block w-4 h-4 mr-0.5 top-0.5' />
                      Delete
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
      <style>{`
				.bc:hover button, .bc:focus button {
					opacity: 1;
          transition: all ease-in 150ms;
				}
        .bc {
          transition: all ease-in 150ms;
        }
			`}</style>
    </div>
  );
}
