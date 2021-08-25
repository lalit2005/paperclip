import { useUser } from '@auth0/nextjs-auth0';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  HiOutlineLogout,
  HiOutlineSupport,
  HiOutlineUserCircle,
} from 'react-icons/hi';
import Link from 'next/link';

const CustomTooltip: React.FC<{ text: string; showArrow?: boolean }> = ({
  text,
  showArrow = true,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <Tooltip.Root
        delayDuration={0.5}
        onOpenChange={(isOpen) => {
          setIsOpen(isOpen);
        }}
        open={isOpen}>
        <Tooltip.Trigger>
          <div>{props.children}</div>
        </Tooltip.Trigger>
        <Transition
          as={Fragment}
          show={isOpen}
          enter='transition ease-out duration-500'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-500'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'>
          <Tooltip.Content
            className='px-2 py-1 text-gray-100 bg-gray-900 rounded shadow-lg'
            side='top'
            sideOffset={5}>
            {showArrow && <Tooltip.Arrow className='shadow-lg' />}
            <p>{text}</p>
          </Tooltip.Content>
        </Transition>
      </Tooltip.Root>
    </div>
  );
};

export default CustomTooltip;
