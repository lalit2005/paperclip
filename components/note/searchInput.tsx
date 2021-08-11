import { HiOutlinePlusCircle } from 'react-icons/hi'

const SearchInput = (props) => {
  return (
    <div className='flex'>
      <input
        type='search'
        name='search-input'
        id='search-input'
        placeholder='Search your notes and their content too'
        className='inline-block w-full px-2 py-1 mb-5 text-gray-600 border border-gray-400 rounded shadow focus:outline-none focus:ring focus:ring-gray-300 focus:ring-offset-1'
        {...props}
      />
      <button className='w-40 py-px ml-4 bg-gray-900 rounded shadow h-9 hover:bg-gray-700 text-gray-50'>
        <HiOutlinePlusCircle className='relative inline-block w-5 h-5 bottom-px' />{' '}
        New note
      </button>
    </div>
  )
}

export default SearchInput
