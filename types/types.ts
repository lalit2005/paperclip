export interface StickyNote {
  note: string
  color: 'red' | 'blue' | 'green' | 'purple' | 'gray'
  id: Number
}

export interface newNoteValues {
  noteHeading: string
  noteDescription: string
  tags: string
}
