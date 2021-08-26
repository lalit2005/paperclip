import CommandPalette from '@/components/dashboard/CommandPalette';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

const DashboardLayout = (props) => {
  useEffect(() => {
    window.onbeforeunload = function () {
      return '';
    };
  }, []);
  return (
    <div className='min-h-screen'>
      <div className='z-50 px-5 mb-10'>
        <DashboardNav />
        <Toaster />
      </div>
      <div className='px-5 mx-auto max-w-7xl' {...props}>
        {props.children}
      </div>
    </div>
  );
};

export default DashboardLayout;
