import { handleError } from '@/lib/handleError';
import getPredictionService from '@/services/prediction/PredictionServiceFactory';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const predictionService = getPredictionService(process.env.PREDICTION_SERVICE || 'replicate');

const promptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
});

function createPrediction(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  const { prompt } = promptSchema.parse(body);

  const request = { prompt: prompt };

  return predictionService.create(request).then((prediction) => {
    if (prediction?.error) {
      throw new Error(prediction.error as string);
    }
    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json(prediction);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      return createPrediction(req, res).catch((error) => handleError(res, error));
    } else {
      res.setHeader('Allow', ['POST']);
      res.setHeader('Content-Type', 'application/json'); // Ensure JSON content type
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    return handleError(res, error);
  }
}
