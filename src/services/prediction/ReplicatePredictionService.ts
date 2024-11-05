// ReplicatePredictionService.ts
import { PredictionRequest, PredictionResponse, PredictionService } from './PredictionService';
import Replicate from 'replicate';
import { getModel } from './ReplicateModels';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

type Option = Parameters<typeof replicate.predictions.create>[0];

const WEBHOOK_HOST = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NGROK_HOST;

export class ReplicatePredictionService implements PredictionService {
  async create(request: PredictionRequest): Promise<PredictionResponse> {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.');
    }

    const { prompt, width, height, negativePrompot, image } = request;

    const options: Option = {
      version: getModel(request.model?.toUpperCase() ?? 'DEFAULT'),
      input: {
        prompt,
        width,
        height,
        negative_prompt: negativePrompot,
        image,
      },
    };

    if (WEBHOOK_HOST) {
      options.webhook = `${WEBHOOK_HOST}/api/webhooks`;
      options.webhook_events_filter = ['start', 'completed'];
    }

    // Create prediction and return response
    const prediction = await replicate.predictions.create(options);
    if (prediction?.error) {
      throw new Error(prediction.error as string);
    }

    return { id: prediction.id, status: prediction.status, output: prediction.output, error: prediction.error };
  }

  async get(id: string): Promise<PredictionResponse> {
    try {
      const prediction = await replicate.predictions.get(id);
      if (prediction?.error) {
        throw new Error(prediction.error as string);
      }
      return { id: prediction.id, status: prediction.status, output: prediction.output, error: prediction.error };
    } catch (error) {
      throw new Error(`Failed to retrieve prediction with ID ${id}: ${(error as Error).message}`);
    }
  }
}
