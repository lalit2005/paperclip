import { HiOutlinePlusCircle } from 'react-icons/hi';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newPlaygroundValues } from 'types/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import newPlaygroundSchema from '@/lib/new-playground-schema';

const SearchInput = (props) => {
  let [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
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
  } = useForm<newPlaygroundValues>({
    resolver: zodResolver(newPlaygroundSchema),
  });

  const createNewPlayground = (data: newPlaygroundValues) => {
    const newPlaygroundReq = axios
      .post('/api/playground/create-playground', {
        ...data,
      })
      .then((res) => {
        router.push('/app/playgrounds/' + res.data.id);
        closeModal();
      });
    toast.promise(newPlaygroundReq, {
      loading: 'Creating new playground...',
      error: 'Error creating new playground',
      success: `'${data.playgroundName}' created`,
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.key === '/') {
        const searchInput = document.getElementById(
          'search-input'
        ) as HTMLInputElement;
        searchInput.value === '' && e.preventDefault();
        searchInput.focus();
      }
    });
  }, []);

  return (
    <div className='flex'>
      <input
        type='search'
        name='search-input'
        id='search-input'
        autoComplete='off'
        placeholder='Search your playgrounds. Press / to focus'
        className='inline-block w-full px-2 py-1 mb-5 text-gray-600 border border-gray-400 rounded shadow focus:outline-none focus:ring focus:ring-gray-300 focus:ring-offset-1'
        {...props}
      />
      <button
        onClick={openModal}
        className='w-40 py-px ml-4 bg-gray-900 rounded shadow h-9 hover:bg-gray-700 text-gray-50'>
        <HiOutlinePlusCircle className='relative inline-block w-5 h-5 bottom-px' />{' '}
        New
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
              <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'>
                  Create new Playground
                </Dialog.Title>
                <div className='mt-2'>
                  <form onSubmit={handleSubmit(createNewPlayground)}>
                    <label className='block my-5'>
                      <span className='mb-2 text-gray-700'>
                        Playground&apos;s title
                      </span>
                      <input
                        type='text'
                        className='w-full px-2 py-1 mt-1 border border-gray-500 rounded shadow-sm focus:ring focus:ring-gray-300 focus:ring-offset-1 focus:outline-none'
                        placeholder='My awesome playground'
                        {...register('playgroundName')}
                      />
                      <p className='text-sm text-red-600'>
                        {/* @ts-ignore */}
                        {errors.playgroundName && errors.playgroundName.message}
                      </p>
                    </label>
                    <label className='block my-5'>
                      <span className='mb-2 text-gray-700'>Tags</span>
                      <input
                        type='text'
                        className='w-full px-2 py-1 mt-1 border border-gray-500 rounded shadow-sm focus:ring focus:ring-gray-300 focus:ring-offset-1 focus:outline-none'
                        placeholder='Description...'
                        {...register('tags')}
                      />
                      <small className='text-gray-500'>
                        Comma separated list of tags
                      </small>
                      <p className='text-sm text-red-600'>
                        {errors.tags &&
                          //  @ts-ignore
                          errors.tags.message}
                      </p>
                    </label>
                    <div className='mt-4'>
                      <button
                        type='submit'
                        className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'>
                        Start coding {'->'}
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

export default SearchInput;
