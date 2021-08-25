import { notes } from '@prisma/client';

const getNotesDataByTags = (notesData: notes[], tag: string) => {
  return notesData.filter((note) => note.tags.includes(tag));
};

export default getNotesDataByTags;
