import { NextApiResponse } from 'next';

export const handleError = (res: NextApiResponse, error: unknown) => {
  const err = error instanceof Error ? error : new Error('An unknown error occurred');
  const status = err.message === 'Request timed out' ? 504 : 500;
  console.error('Error occurred:', err);
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json({
    message: err.message === 'Request timed out' ? 'Request timed out' : 'Failed to create prediction',
    error: err.message,
  });
};
