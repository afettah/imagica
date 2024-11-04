'use client';
const PREDICTION_API = '/api/predictions';

interface Prediction {
  id: string;
  status: string;
  output?: string[];
  detail?: string;
}

export const createPrediction = async (prompt: string): Promise<Prediction> => {
  const response = await fetch(PREDICTION_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (response.status !== 201) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.detail || 'An error occurred while creating the prediction.');
  }

  return response.json();
};

export const getPredictionStatus = async (id: string): Promise<Prediction> => {
  const response = await fetch(`${PREDICTION_API}/${id}`);

  if (response.status !== 200) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.detail || 'An error occurred while fetching the prediction status.');
  }

  return response.json();
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    let prediction = await createPrediction(prompt);

    while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await sleep(1000);
      prediction = await getPredictionStatus(prediction.id);
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
