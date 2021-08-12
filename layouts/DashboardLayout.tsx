import DashboardNav from '@/components/dashboard/DashboardNav'
import { Toaster } from 'react-hot-toast'

const DashboardLayout = (props) => {
  return (
    <div className='min-h-screen'>
      <div className='z-50 px-5 mb-10'>
        <DashboardNav />
        <Toaster />
      </div>
      <div className='px-5 mx-auto max-w-7xl'>{props.children}</div>
    </div>
  )
}

export default DashboardLayout
