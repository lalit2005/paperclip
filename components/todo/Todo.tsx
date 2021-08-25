import { todos, todolists } from '@prisma/client';
import clsx from 'clsx';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { HiCheck, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import axios from 'axios';
import toast from 'react-hot-toast';
import truncate from 'lodash.truncate';

const Todo: React.FC<{
  todo: todos;
  mutate: any;
  restOfData: todolists & {
    todos: todos[];
  };
}> = ({ todo, mutate, restOfData }) => {
  let [isOpen, setIsOpen] = useState(false);
  const [todoValue, setTodoValue] = useState(todo?.todo);
  const [checked, setChecked] = useState<'p1' | 'p2' | 'p3'>(
    // @ts-ignore
    'p' + todo?.priority
  );
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
          'my-2 px-3 rounded py-2 max-w-[384px] w-full shadow border flex border-gray-200 transition-all cursor-pointer justify-between hover:bg-gray-50'
        }>
        <div className='inline-flex items-center'>
          <span
            className={clsx(
              'mr-2 w-5 h-5 rounded-full inline-block',
              todo?.priority === 1 && 'bg-red-500',
              todo?.priority === 2 && 'bg-yellow-300',
              todo?.priority === 3 && 'bg-green-300'
            )}
            title={'Priority: ' + todo?.priority}
          />
          <p className='inline-block'>{todo?.todo}</p>
        </div>
        <div className='inline-flex items-center'>
          <div className='inline-flex items-center justify-center rounded group'>
            <HiOutlinePencil
              className='w-5 h-5 text-gray-400 transition-all transform group-hover:scale-150 group-hover:text-blue-400'
              onClick={openModal}
            />
          </div>
          <div
            className='inline-flex items-center justify-center ml-1 mr-2 rounded group'
            onClick={async () => {
              mutate(
                {
                  ...restOfData,
                  todos: restOfData?.todos.filter((t) => t.id !== todo?.id),
                },
                false
              );
              toast.success(`'${todo?.todo}' deleted`);
              const deleteTodo = await axios.post('/api/todo/delete-todo', {
                id: todo?.id,
              });
            }}>
            <HiOutlineTrash className='w-5 h-5 text-gray-400 transition-all transform group-hover:scale-150 group-hover:text-red-400' />
          </div>
          <div className='inline-flex items-center justify-center'>
            <Checkbox.Root
              id='check'
              onCheckedChange={async (isChecked) => {
                if (isChecked) {
                  mutate(
                    {
                      ...restOfData,
                      todos: [
                        ...restOfData.todos.filter((t) => t.id !== todo?.id),
                        {
                          ...todo,
                          isDone: true,
                        },
                      ],
                    },
                    false
                  );
                  toast.success(`Yayy!! you completed '${todo?.todo}'`);
                  const updateTodo = await axios.post(
                    '/api/todo/update-todo-state',
                    {
                      id: todo?.id,
                      isDone: true,
                    }
                  );
                }
              }}
              className='inline-flex items-center justify-center w-5 h-5 mr-2 text-gray-600 border border-gray-400 rounded shadow focus:ring focus:ring-gray-600 group checked:bg-gray-500 checked:text-gray-50'>
              <Checkbox.Indicator>
                <HiCheck />
              </Checkbox.Indicator>
            </Checkbox.Root>
          </div>
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
              <Dialog.Overlay className='fixed inset-0 backdrop-filter backdrop-blur-sm bg-gray-50/50' />
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
                  Edit <strong>{truncate(todo?.todo, { length: 30 })}</strong>
                </Dialog.Title>
                <div className='mt-2'>
                  <p>
                    <label htmlFor='edit-todo' className='block mt-3 mb-2'>
                      Edit todo
                    </label>
                    <input
                      type='text'
                      className='w-full px-3 py-1 border border-gray-300 rounded shadow focus:ring focus:ring-offset-1 focus:outline-none focus:ring-gray-400'
                      id='edit-todo'
                      value={todoValue}
                      onChange={(e) => setTodoValue(e.target.value)}
                    />
                  </p>
                  <label htmlFor='edit-todo' className='block mt-3 mb-2'>
                    Edit priority
                  </label>
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
                      const updateTodo = await axios.post(
                        '/api/todo/update-todo',
                        {
                          id: todo?.id,
                          todo: todoValue,
                          priority: +checked.substr(1),
                        }
                      );
                      mutate({
                        ...restOfData,
                        todos: [
                          ...restOfData.todos.filter((t) => t.id !== todo?.id),
                          {
                            ...todo,
                            todo: todoValue,
                            priority: +checked.substr(1),
                          },
                        ],
                      });
                      closeModal();
                    }}>
                    Save Changes
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
