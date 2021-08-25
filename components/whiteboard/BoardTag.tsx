import getRandomColor from '@/lib/get-random-color';

export default function NoteTag(props) {
  const color = getRandomColor();
  return (
    <span
      className={`px-2 py-1 border border-gray-400 text-[11px] text-${color}-700 mr-2 font-medium uppercase select-none rounded-xl bg-${color}-100 mb-2 inline-block`}>
      {props.tag}
    </span>
  );
}
