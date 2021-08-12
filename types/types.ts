export interface StickyNote {
  note: String
  color: 'red' | 'blue' | 'green' | 'purple' | 'gray'
  id: Number
}

export interface newNoteValues {
  noteHeading: String
  noteDescription: String
  tags: String
}
