import { whiteboards } from '@prisma/client';

const getBoardsDataByTags = (boards: whiteboards[], tag: string) => {
  return boards.filter((note) => note.tags.includes(tag));
};

export default getBoardsDataByTags;
