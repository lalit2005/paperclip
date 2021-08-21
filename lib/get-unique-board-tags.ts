import { whiteboards } from '@prisma/client';

const getUniqueTags = (notesData: whiteboards[]) => {
  const allTags = notesData?.reduce((acc, note) => {
    return acc.concat(note.tags);
  }, []);
  return allTags?.filter((tag, index, array) => {
    return array.indexOf(tag) === index;
  }, []);
};

export default getUniqueTags;
