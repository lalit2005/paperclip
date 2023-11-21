import getRandomColor from '@/lib/get-random-color';

export default function NoteTag(props) {
  const color = getRandomColor();
  if (props.tag) {
    return (
      <span
        className={`px-2 py-1 border border-${color}-400 text-sm text-${color}-700 mr-2 font-medium lowercase select-none rounded-md bg-${color}-100 mb-2 inline-block`}>
        {props.tag}
      </span>
    );
  }
  return null;
}
