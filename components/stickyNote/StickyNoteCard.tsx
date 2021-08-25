import truncate from 'lodash.truncate';

const StickyNoteCard = ({ stickyNote }) => {
  return (
    <div
      className={`h-48 px-2 py-1 border border-${stickyNote.color}-300 rounded w-52 mr-7 bg-${stickyNote.color}-100 overflow-scroll`}>
      <p className='mt-5 text-gray-600'>
        {truncate(stickyNote.stickyNote, { length: 50 })}
      </p>
    </div>
  );
};

export default StickyNoteCard;
