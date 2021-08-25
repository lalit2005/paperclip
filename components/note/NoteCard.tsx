import truncate from 'lodash.truncate';

const NoteCard = ({ note }) => {
  return (
    <div className='h-48 px-2 py-1 border border-gray-300 rounded w-52 mr-7'>
      <h3 className='text-lg font-medium'>
        {truncate(note.noteHeading, {
          length: 30,
        })}
      </h3>
      <p className='mt-5 text-gray-600 font-base'>
        {truncate(note.noteDescription, {
          length: 30,
        })}
      </p>
    </div>
  );
};

export default NoteCard;
