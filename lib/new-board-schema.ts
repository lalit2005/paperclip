import * as z from 'zod';

const newboardSchema = z.object({
  boardName: z
    .string()
    .min(
      1,
      "Please enter a name for whiteboard that's at least a character long"
    ),
  boardDescription: z
    .string()
    .min(1, "Please enter a description that's at least a character long"),
  tags: z.string(),
});

export default newboardSchema;
