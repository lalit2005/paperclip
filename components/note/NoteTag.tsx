import getRandomColor from '@/lib/getRandomColor'

export default function NoteTag(props) {
  const color = getRandomColor()
  return (
    <span
      className={`px-2 py-1 border border-${color}-300 text-[11px] mr-2 font-medium uppercase select-none rounded-xl bg-${color}-100`}>
      {props.tag}
    </span>
  )
}
