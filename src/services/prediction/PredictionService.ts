export interface PredictionService {
  create(request: PredictionRequest): Promise<PredictionResponse>;
  get(id: string): Promise<PredictionResponse>;
}

export type PredictionResponse = {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string[];
  error?: unknown;
};

export type PredictionRequest = {
  prompt: string;
};
