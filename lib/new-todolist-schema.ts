import * as z from 'zod';

const newTodolistSchema = z.object({
  todolistName: z
    .string()
    .min(1, "Please enter a title that's at least a character long"),
  todolistDescription: z
    .string()
    .min(1, "Please enter a description that's at least a character long"),
});

export default newTodolistSchema;
