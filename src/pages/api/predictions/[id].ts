import { handleError } from '@/lib/handleError';
import { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function getPrediction(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') {
    throw new Error('Invalid prediction ID');
  }

  const prediction = await replicate.predictions.get(id);

  if (prediction?.error) {
    throw new Error(prediction.error as string);
  }

  return res.status(200).json(prediction);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      return getPrediction(req, res);
    } else {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    return handleError(res, error);
  }
}
