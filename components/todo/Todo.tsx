import { todos } from '@prisma/client';
import clsx from 'clsx';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { HiCheck } from 'react-icons/hi';
import axios from 'axios';
import toast from 'react-hot-toast';
import truncate from 'lodash.truncate';

const Todo: React.FC<{ todo: todos; mutate: any }> = ({ todo, mutate }) => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div>
      {/* <div className='flex items-center'> */}
      <div
        className={
          'my-2 px-3 rounded py-2 w-96 shadow border flex border-gray-200 transition-all cursor-pointer justify-between hover:bg-gray-50'
        }>
        <div onClick={openModal} className='inline-flex items-center'>
          <span
            className={clsx(
              'mr-2 w-5 h-5 rounded-full inline-block',
              todo?.priority === 1 && 'bg-red-300',
              todo?.priority === 2 && 'bg-yellow-300',
              todo?.priority === 3 && 'bg-green-300'
            )}
          />
          <p className='inline-block'>{todo?.todo}</p>
        </div>
        <div className='inline-flex items-center justify-center'>
          <Checkbox.Root
            id='check'
            onCheckedChange={(isChecked) => {
              if (isChecked) {
                const updateTodo = axios
                  .post('/api/todo/update-todo-state', {
                    id: todo?.id,
                    isDone: true,
                  })
                  .then(() => mutate());
                toast.promise(updateTodo, {
                  error: 'Error. Could not update todo :(',
                  success: `Yaayy!! You finished '${truncate(todo?.todo)}'`,
                  loading: `Letting our robots know that you completed '${todo?.todo}'`,
                });
              }
            }}
            className='inline-flex items-center justify-center w-5 h-5 mr-2 text-gray-600 border border-gray-400 rounded shadow focus:ring focus:ring-gray-600 group checked:bg-gray-500 checked:text-gray-50'>
            <Checkbox.Indicator>
              <HiCheck />
            </Checkbox.Indicator>
          </Checkbox.Root>
        </div>
      </div>
      {/* </div> */}
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
                  Payment successful
                </Dialog.Title>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>
                    Your payment has been successfully submitted. We’ve sent
                    your an email with all of the details of your order.
                  </p>
                </div>

                <div className='mt-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                    onClick={closeModal}>
                    Got it, thanks!
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

export default Todo;
