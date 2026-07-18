import { z } from 'zod';

export const displayNameSchema = z.string().trim().min(2).max(40);
export const commentContentSchema = z.string().trim().min(2).max(2000);
export const reportDetailsSchema = z.string().trim().max(500);

export type CommentFormValues = {
  displayName: string;
  content: string;
};
