'use server'
import { AuthError } from 'next-auth';
import { signIn } from '../../../../auth';
import { z } from 'zod';
import { signInSchema } from '@/components/__TESTUserSignIngForm';

export async function authenticate(
    formData: z.infer<typeof signInSchema>,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      
      throw error;
    }
  }