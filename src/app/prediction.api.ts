'use client';
const PREDICTION_API = '/api/predictions';

interface Prediction {
  id: string;
  status: string;
  output?: string[];
}

export interface PredictionRequest {
  prompt: string;
  service: string;
  negativePrompot?: string;
  model?: string;
  width?: number;
  height?: number;
  images?: File[];
}

export const createPrediction = async (request: PredictionRequest): Promise<Prediction> => {
  const formData = new FormData();

  formData.append('prompt', request.prompt);
  formData.append('service', request.service);

  if (request.negativePrompot) {
    formData.append('negativePrompot', request.negativePrompot);
  }
  if (request.model) {
    formData.append('model', request.model);
  }
  if (request.width !== undefined) {
    formData.append('width', request.width.toString());
  }
  if (request.height !== undefined) {
    formData.append('height', request.height.toString());
  }

  if (request.images) {
    request.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });
  }

  const response = await fetch(PREDICTION_API, {
    method: 'POST',
    body: formData,
  });

  if (response.status !== 201) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.detail || 'An error occurred while creating the prediction.');
  }

  return response.json();
};

export const getPredictionStatus = async ({ id, service }: { id: string; service: string }): Promise<Prediction> => {
  const response = await fetch(`${PREDICTION_API}/${id}?service=${service}`);

  if (response.status !== 200) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.detail || 'An error occurred while fetching the prediction status.');
  }

  return response.json();
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const generateImage = async (request: PredictionRequest): Promise<string> => {
  try {
    let prediction = await createPrediction(request);

    while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await sleep(1000);
      prediction = await getPredictionStatus({
        id: prediction.id,
        service: request.service,
      });
    }
    if (prediction.status === 'succeeded' && prediction.output && prediction.output.length > 0) {
      return prediction.output[prediction.output.length - 1];
    }
    throw new Error('Prediction failed ', {
      cause: prediction,
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
