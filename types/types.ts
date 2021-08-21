import { notes, whiteboards } from '@prisma/client';

export interface StickyNote {
  note: string;
  color: 'red' | 'blue' | 'green' | 'purple' | 'gray';
  id: Number;
}

export interface newNoteValues {
  noteHeading: string;
  noteDescription: string;
  tags: string;
}
export interface newBoardValues {
  boardName: string;
  boardDescription: string;
  tags: string;
}

export interface TrashResponse {
  notes: notes[];
  boards: whiteboards[];
}
