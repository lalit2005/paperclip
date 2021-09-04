/* eslint-disable react-hooks/rules-of-hooks */
import fetcher from '@/lib/fetcher';
import { UserProfile, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { todolists } from '@prisma/client';
import DashboardLayout from 'layouts/DashboardLayout';
import Link from 'next/link';
import useSWR from 'swr';
import Head from 'next/head';
import { Dialog, Transition } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Fragment, useState } from 'react';
import newTodolistSchema from '@/lib/new-todolist-schema';
import { newTodolistValues } from 'types/types';
import { useRouter } from 'next/router';

const Page: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { data: todolists } = useSWR<todolists[]>(
    '/api/todo/get-all-todolists',
    fetcher
  );

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<newTodolistValues>({
    resolver: zodResolver(newTodolistSchema),
  });

  const router = useRouter();

  const createNewTodolist = (data: newTodolistValues) => {
    const createNewTodolistRequest = axios
      .post('/api/todo/create-todolist', data)
      .then((res) => {
        router.push('/app/todo/' + res.data.id);
      });
    toast.promise(createNewTodolistRequest, {
      loading: 'Creating new todolist',
      error: 'Error creating new todolist',
      success: 'Successfully created new todolist',
    });
  };

  return (
    <div>
      <Head>
        <title>{user.name || user.nickname}&apos;s Todolists</title>
      </Head>
      <DashboardLayout>
        <h1 className='mb-16 text-4xl font-extrabold text-center'>
          Your Todo Lists ✔️
        </h1>
        <div className='flex flex-row-reverse w-full text-left'>
          <button
            className='px-3 py-1 my-3 bg-gray-900 rounded shadow hover:bg-gray-700 text-gray-50 focus:ring focus:ring-offset-2 focus:ring-gray-600 focus:outline-none'
            onClick={openModal}>
            Create a new Todo List
          </button>
        </div>
        <div className='flex flex-wrap mt-10'>
          {todolists?.map((todolist) => (
            <div
              key={todolist?.id}
              className='w-full max-w-xl mx-auto my-3 transition-all border border-gray-500 rounded shadow hover:shadow-lg hover:bg-gray-50'>
              <Link href={`/app/todo/${todolist?.id}`}>
                <a className='block px-5 py-2'>
                  <h3 className='my-3 text-xl font-medium'>
                    {todolist?.todolistName}
                  </h3>
                  <p className='my-5 text-gray-700 font-lg'>
                    {todolist?.todolistDescription}
                  </p>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </DashboardLayout>
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
              <Dialog.Overlay className='fixed inset-0 bg-gray-100/30 backdrop-filter backdrop-blur-md' />
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
                  Create new Todo List
                </Dialog.Title>
                <div className='mt-2'>
                  <form onSubmit={handleSubmit(createNewTodolist)}>
                    <input
                      type='text'
                      className='w-full px-2 py-1 mt-1 border border-gray-500 rounded shadow-sm focus:ring focus:ring-gray-300 focus:ring-offset-1 focus:outline-none'
                      placeholder='Todolist name'
                      {...register('todolistName')}
                    />
                    <input
                      type='text'
                      className='w-full px-2 py-1 my-5 border border-gray-500 rounded shadow-sm focus:ring focus:ring-gray-300 focus:ring-offset-1 focus:outline-none'
                      placeholder='Todolist description'
                      {...register('todolistDescription')}
                    />
                    <div>
                      <button
                        type='submit'
                        className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                        onClick={closeModal}>
                        Create new todo list {'->'}
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

export default withPageAuthRequired(Page);
