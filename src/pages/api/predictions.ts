import { handleError } from '@/lib/handleError';
import { PredictionRequest } from '@/services/prediction/PredictionService';
import getPredictionService from '@/services/prediction/PredictionServiceFactory';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const getSingleValue = <T>(value: T | T[]): T | undefined => {
  return Array.isArray(value) ? value[0] : value;
};

const extractFileAsBase64 = (files: formidable.Files, fieldName: string): string | undefined => {
  const file = Array.isArray(files[fieldName]) ? files[fieldName][0] : files[fieldName];
  if (file && file.filepath) {
    try {
      const fileData = fs.readFileSync(file.filepath);
      return `data:${file.mimetype};base64,${fileData.toString('base64')}`;
    } catch (error) {
      throw new Error(`Error reading file: ${fieldName} ${error}`);
    }
  }
  return undefined;
};

const parseForm = (req: NextApiRequest): Promise<PredictionRequest> =>
  new Promise((resolve, reject) => {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);

      const prompt = getSingleValue(fields.prompt);
      const service = getSingleValue(fields.service);

      if (!prompt) {
        return reject(new Error("The 'prompt' field is required."));
      }
      if (!service) {
        return reject(new Error("The 'service' field is required."));
      }

      let image;
      try {
        image = extractFileAsBase64(files, 'images[0]');
      } catch (fileError) {
        return reject(fileError);
      }

      resolve({
        prompt,
        service,
        negativePrompot: getSingleValue(fields.negativePrompot),
        model: getSingleValue(fields.model),
        width: fields.width ? Number(getSingleValue(fields.width)) : undefined,
        height: fields.height ? Number(getSingleValue(fields.height)) : undefined,
        image: image,
      } as PredictionRequest);
    });
  });

function createPrediction(req: NextApiRequest, res: NextApiResponse) {
  return parseForm(req).then((request) => {
    return getPredictionService(request.service)
      .create(request)
      .then((prediction) => {
        if (prediction?.error) {
          throw new Error(prediction.error as string);
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json(prediction);
      });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      return createPrediction(req, res).catch((error) => handleError(res, error));
    } else {
      res.setHeader('Allow', ['POST']);
      res.setHeader('Content-Type', 'application/json');
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    return handleError(res, error);
  }
}
