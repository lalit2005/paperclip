import { useUser } from '@auth0/nextjs-auth0';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  HiOutlineLogout,
  HiOutlineSupport,
  HiOutlineTrash,
  HiOutlineUserCircle,
} from 'react-icons/hi';
import Link from 'next/link';
import * as Avatar from '@radix-ui/react-avatar';

const ProfileDropdown = () => {
  const {
    user: { email, picture, name },
  } = useUser();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button className=''>
            <Tooltip.Root
              delayDuration={0.5}
              onOpenChange={(isOpen) => {
                setIsOpen(isOpen);
              }}
              open={isOpen}>
              <Tooltip.Trigger className='w-8 h-8'>
                <div>
                  <Avatar.Root>
                    <Avatar.Image
                      src={picture}
                      className='rounded-full'
                      alt={name}
                    />
                    <Avatar.Fallback className='p-2 uppercase bg-blue-600 rounded-full text-gray-50'>
                      {name?.substr(0, 2)}
                    </Avatar.Fallback>
                  </Avatar.Root>
                </div>
              </Tooltip.Trigger>
              <Transition
                as={Fragment}
                show={isOpen}
                enter='transition ease-out duration-700'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-700'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'>
                <Tooltip.Content
                  className='px-2 py-1 text-gray-100 bg-gray-900 rounded shadow-lg'
                  side='left'
                  sideOffset={5}>
                  {/* <Tooltip.Arrow className='shadow-lg' /> */}
                  <p className='capitalize'>{name || email?.split('@')[0]}</p>
                </Tooltip.Content>
              </Transition>
            </Tooltip.Root>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'>
          <Menu.Items className='absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='px-1 py-1'>
              <Menu.Item disabled>
                <div className='p-2 text-base'>
                  <p>Hello {name || email?.split('@')[0]} 👋🏻</p>
                  <p className='text-xs text-gray-500'>{email}</p>
                </div>
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-200 text-gray-900' : 'text-gray-900'
                    } group flex rounded-md items-center w-full text-sm`}>
                    <Link href='/account'>
                      <a className='px-2 py-2'>
                        <HiOutlineUserCircle
                          className='inline-block w-5 h-5 mr-2 text-gray-700'
                          aria-hidden='true'
                        />
                        Manage Account
                      </a>
                    </Link>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-200 text-gray-900' : 'text-gray-900'
                    } group flex rounded-md items-center w-full text-sm`}>
                    <Link href='/app/trash'>
                      <a className='px-2 py-2'>
                        <HiOutlineTrash
                          className='inline-block w-5 h-5 mr-2 text-gray-700'
                          aria-hidden='true'
                        />
                        Trash
                      </a>
                    </Link>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-200 text-gray-900' : 'text-gray-900'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                    <HiOutlineSupport
                      className='w-5 h-5 mr-2 text-gray-700'
                      aria-hidden='true'
                    />
                    Support
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className='px-1 py-1'>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href='/logout'
                    className={`${
                      active ? 'bg-gray-200 text-gray-900' : 'text-gray-900'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                    <HiOutlineLogout
                      className='w-5 h-5 mr-2 text-gray-700'
                      aria-hidden='true'
                    />
                    Logout
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default ProfileDropdown;
