import { Fab } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import toast from 'react-hot-toast';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { todolists, todos } from '.prisma/client';
import axios from 'axios';
import usePrefetch from '@/lib/usePrefetch';

const EditPopover: React.FC<{
  todolist: todolists & { todos: todos[] };
  mutate: any;
}> = ({ todolist, mutate }) => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const router = usePrefetch(['/app/todo']);
  const [todolistName, setTodolistName] = useState(todolist?.todolistName);
  const [todolistDescription, setTodolistDescription] = useState(
    todolist?.todolistDescription
  );

  return (
    <div>
      <div style={{ zoom: '0.8' }}>
        <Fab
          icon={<HiOutlineMenuAlt1 />}
          event='click'
          alwaysShowTitle
          onClick={openModal}
        />
      </div>
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
              <Dialog.Overlay className='fixed inset-0 backdrop-filter backdrop-blur-sm bg-white/50' />
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
                  {todolist?.todolistName}&apos;s settings
                </Dialog.Title>
                <div className='mt-2'>
                  <form>
                    <label className='block my-5'>
                      <span className='mb-2 text-gray-700'>
                        Todolists&apos;s title
                      </span>
                      <input
                        type='text'
                        className='w-full px-2 py-1 mt-1 border border-gray-500 rounded shadow-sm focus:ring focus:ring-gray-300 focus:ring-offset-1 focus:outline-none'
                        placeholder="Todolist's name"
                        value={todolistName}
                        onChange={(e) => setTodolistName(e.target.value)}
                      />
                    </label>
                    <label className='block my-5'>
                      <span className='mb-2 text-gray-700'>
                        Todolists&apos;s description
                      </span>
                      <input
                        type='text'
                        className='w-full px-2 py-1 mt-1 border border-gray-500 rounded shadow-sm focus:ring focus:ring-gray-300 focus:ring-offset-1 focus:outline-none'
                        placeholder="Todolist's name"
                        value={todolistDescription}
                        onChange={(e) => setTodolistDescription(e.target.value)}
                      />
                    </label>
                    <div className='flex items-center justify-between w-full mt-4'>
                      <button
                        type='submit'
                        className='inline-flex justify-center px-4 py-2 mr-3 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                        onClick={async (e) => {
                          e.preventDefault();
                          const updateTodolsitReq = axios
                            .post('/api/todo/update-todolist', {
                              todolistName: todolistName,
                              todolistDescription: todolistDescription,
                              id: todolist?.id,
                            })
                            .then(() => {
                              mutate({
                                ...todolist,
                                todolistName,
                                todolistDescription,
                              });
                            });
                          closeModal();
                          toast.promise(updateTodolsitReq, {
                            loading: 'Updating...',
                            error: 'Todolist update failed',
                            success: 'Todolist updated successfully',
                          });
                        }}>
                        Save
                      </button>
                      <button
                        type='button'
                        className='inline-flex justify-center px-4 py-2 mr-3 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500'
                        onClick={() => {
                          const moveToTrash = axios
                            .post('/api/todo/trash', {
                              id: todolist?.id,
                              inTrash: true,
                            })
                            .then(() => {
                              mutate();
                              router.push('/app/todo');
                            });
                          toast.promise(moveToTrash, {
                            loading: 'Moving to trash...',
                            error: 'Failed to move to trash',
                            success: 'Moved to trash successfully',
                          });
                        }}>
                        Move to trash
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default EditPopover;
