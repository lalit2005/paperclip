import DashboardLayout from 'layouts/DashboardLayout';
import { UserProfile, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { HiOutlineInformationCircle, HiOutlineXCircle } from 'react-icons/hi';
import { useState } from 'react';

const Account: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { name, email, email_verified, picture } = user;
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <DashboardLayout>
        {isOpen && (
          <div className='flex items-center justify-between px-4 py-2 my-10 border border-blue-500 rounded bg-blue-50'>
            <span>
              <HiOutlineInformationCircle className='inline-block w-6 h-6 text-gray-500' />{' '}
              You can edit your account details in your GitHub or Google account
            </span>
            <button onClick={() => setIsOpen(false)}>
              <HiOutlineXCircle className='inline-block w-6 h-6 text-gray-500' />
            </button>
          </div>
        )}
        <h1 className='text-4xl font-extrabold capitalize'>
          {name}&apos;s Paperclip Account
        </h1>
        <hr className='text-gray-200' />
        <div className='mt-5'>
          <h3 className='mt-10 mb-2 text-2xl font-bold'>Name</h3>
          <p className='mb-5 text-gray-700 text-md'>{name}</p>
          <h3 className='mt-10 mb-2 text-2xl font-bold'>E-mail Address</h3>
          <p className='mb-5 text-gray-700 text-md'>{email}</p>
          <h3 className='mt-10 mb-2 text-2xl font-bold'>E-mail Verified?</h3>
          <p className='mb-5 text-gray-700 text-md'>
            {email_verified
              ? "Yes, It's verified"
              : "No, it's not verified yet"}
          </p>
          <h3 className='mt-10 mb-2 text-2xl font-bold'>Profile Picture</h3>
          <p className='mb-5 text-gray-700 text-md'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={picture}
              alt='Profile Picture'
              className='h-32 rounded-full'
            />
          </p>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default withPageAuthRequired(Account);
