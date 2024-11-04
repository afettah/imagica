import { PredictionResponse, PredictionService } from './PredictionService';

const imageUrl = '/images/prediction.webp';

export class MockPredictionService implements PredictionService {
  async create(): Promise<PredictionResponse> {
    return {
      id: 'mock-id',
      status: 'starting',
      output: [imageUrl],
    };
  }

  async get(id: string): Promise<PredictionResponse> {
    if (id === 'mock-id') {
      return {
        id,
        status: 'succeeded',
        output: [imageUrl],
      };
    } else {
      return {
        id,
        status: 'failed',
        error: 'Mock error: Prediction ID not found',
      };
    }
  }
}
