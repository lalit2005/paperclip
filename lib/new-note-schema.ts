import * as z from 'zod';

const newNoteSchema = z.object({
  noteHeading: z
    .string()
    .min(1, "Please enter a title that's at least a character long"),
  noteDescription: z
    .string()
    .min(1, "Please enter a description that's at least a character long"),
  tags: z.string(),
});

export default newNoteSchema;
