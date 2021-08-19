import Nav from '@/components/Nav'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0'

export default function Home() {
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    router.prefetch('/app')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (user) {
    router.push('/app')
  }

  return (
    <div>
      <div>
        <div className='text-center pb-36'>
          <Nav />
          <div className='max-w-3xl mx-auto mt-28'>
            <h1 className='text-4xl font-extrabold'>
              The only note taking and productivity tool you will ever need
            </h1>
            <h2 className='text-xl text-gray-600 mt-11'>
              From notes, todo lists, sticky notes, calendar to expense tracker,
              pomorodo timer and HTML-CSS playgorund, Paperclip is everything
              you will ever need
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}
