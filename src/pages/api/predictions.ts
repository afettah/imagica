import { handleError } from '@/lib/handleError';
import { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';
import { z } from 'zod';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

type Option = Parameters<typeof replicate.predictions.create>[0];

const WEBHOOK_HOST = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NGROK_HOST;

const promptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
});

export async function createPrediction(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error('The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.');
  }

  const body = req.body;
  const { prompt } = promptSchema.parse(body);

  const options: Option = {
    version: '8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f',
    input: { prompt: prompt },
  };

  if (WEBHOOK_HOST) {
    options.webhook = `${WEBHOOK_HOST}/api/webhooks`;
    options.webhook_events_filter = ['start', 'completed'];
  }

  const prediction = await replicate.predictions.create(options);

  if (prediction?.error) {
    throw new Error(prediction.error as string);
  }

  return res.status(201).json(prediction);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      return createPrediction(req, res);
    } else {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.log('handle error');
    return handleError(res, error);
  }
}
