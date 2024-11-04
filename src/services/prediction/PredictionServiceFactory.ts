import { PredictionService } from './PredictionService';
import { ReplicatePredictionService } from './ReplicatePredictionService';
import { MockPredictionService } from './MockPredictionService';

export default function getPredictionService(name: string): PredictionService {
  switch (name) {
    case 'replicate':
      return new ReplicatePredictionService();

    case 'mock':
      return new MockPredictionService();
    default:
      throw new Error(`PredictionService with name ${name} not found`);
  }
}
