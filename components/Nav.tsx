import Link from 'next/link'

const Nav = (props) => {
  return (
    <div className='flex items-center justify-around h-full py-4 border-b border-b-[#fff]'>
      <h1 className='text-3xl font-extrabold select-none'>
        {/* <span className="px-1 py-1 mr-1 text-white bg-gray-900 rounded-md"> */}
        Paper
        {/* </span> */}
        <span>clip</span>
      </h1>
      <div className='flex flex-row gap-3'>
        <Link href='/signup'>
          <a className='px-3 py-1 bg-gray-700 rounded shadow text-gray-50 hover:bg-gray-900'>
            Sign up
          </a>
        </Link>
        <Link href='/login'>
          <a className='px-3 py-1 bg-gray-700 rounded shadow text-gray-50 hover:bg-gray-900'>
            Login
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Nav
