import { handleError } from '@/lib/handleError';
import getPredictionService from '@/services/prediction/PredictionServiceFactory';
import { NextApiRequest, NextApiResponse } from 'next';

const predictionService = getPredictionService(process.env.PREDICTION_SERVICE || 'replicate');

export async function getPrediction(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') {
    throw new Error('Invalid prediction ID');
  }

  return predictionService.get(id).then((prediction) => {
    if (prediction?.error) {
      throw new Error(prediction.error as string);
    }

    return res.status(200).json(prediction);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      return getPrediction(req, res).catch((error) => handleError(res, error));
    } else {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    return handleError(res, error);
  }
}
