import * as RadioGroup from '@radix-ui/react-radio-group';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { HiCheck } from 'react-icons/hi';
import { useUser } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { todolists, todos } from '@prisma/client';
import toast from 'react-hot-toast';

const Todo: React.FC<{
  todolistId: string;
  mutate: any;
  restOfData: todolists & {
    todos: todos[];
  };
  listName: string;
}> = ({ todolistId, mutate, restOfData, listName }) => {
  let [isOpen, setIsOpen] = useState(false);
  const [checked, setChecked] = useState<'p1' | 'p2' | 'p3'>('p2');
  const [todo, setTodo] = useState('');

  const {
    user: { email },
  } = useUser();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div>
      <button
        onClick={openModal}
        className='px-3 py-2 my-2 transition-all border border-gray-700 rounded shadow cursor-pointer w-full max-w-[384px] hover:text-gray-50 hover:bg-gray-900'>
        <p>+ Add new todo</p>
      </button>
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
                  New todo
                </Dialog.Title>
                <div className='mt-2'>
                  <div className='my-5'>
                    <input
                      type='text'
                      value={todo}
                      onChange={(e) => setTodo(e.target.value)}
                      className='w-full px-3 py-1 border border-gray-300 rounded shadow focus:ring focus:ring-offset-1 focus:outline-none focus:ring-gray-400'
                      placeholder={`Clear ${email}'s inbox`}
                    />
                  </div>
                  {/* @ts-ignore */}
                  <RadioGroup.Root onValueChange={(value) => setChecked(value)}>
                    <div className='flex items-center my-1'>
                      <RadioGroup.Item
                        className='inline-flex items-center justify-center w-5 h-5 mr-2 border rounded-full shadow'
                        value='p1'
                        checked={checked === 'p1'}
                        id='p1'>
                        <RadioGroup.Indicator className='w-2 h-2 bg-gray-900 rounded-full' />
                      </RadioGroup.Item>
                      <label htmlFor='p1'>Very important task</label>
                    </div>
                    <div className='flex items-center my-1'>
                      <RadioGroup.Item
                        className='inline-flex items-center justify-center w-5 h-5 mr-2 border rounded-full shadow'
                        checked={checked === 'p2'}
                        value='p2'
                        id='p2'>
                        <RadioGroup.Indicator className='w-2 h-2 bg-gray-900 rounded-full' />
                      </RadioGroup.Item>
                      <label htmlFor='p2'>Important task</label>
                    </div>
                    <div className='flex items-center my-1'>
                      <RadioGroup.Item
                        className='inline-flex items-center justify-center w-5 h-5 mr-2 border rounded-full shadow'
                        checked={checked === 'p3'}
                        value='p3'
                        id='p3'>
                        <RadioGroup.Indicator className='w-2 h-2 bg-gray-900 rounded-full' />
                      </RadioGroup.Item>
                      <label htmlFor='p3'>Not so important task</label>
                    </div>
                  </RadioGroup.Root>
                </div>

                <div className='mt-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                    onClick={async () => {
                      const createTodo = await axios.post(
                        '/api/todo/create-todo',
                        {
                          todolistId,
                          todo,
                          priority: +checked.substr(1),
                        }
                      );
                      mutate({
                        ...restOfData,
                        todos: [
                          ...restOfData.todos,
                          {
                            todo: todo,
                            priority: +checked.substr(1),
                            isDone: false,
                            todolistId,
                          },
                        ],
                      });
                      toast.success(
                        `'${todo}' has been added to the '${listName}' list`
                      );
                      closeModal();
                    }}>
                    Create todo
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
