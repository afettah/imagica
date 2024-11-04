import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface GeneratedImageProps {
  imageUrl?: string;
  loading: boolean;
}

export const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageUrl, loading }) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold mb-4">Generated Image</h2>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <span className="animate-pulse text-lg font-semibold">Loading</span>
            <span className="animate-bounce text-lg font-semibold">...</span>
          </div>
        ) : imageUrl ? (
          <Image src={imageUrl} alt="Generated" width={500} height={500} className="w-full max-w-md mx-auto rounded-lg shadow-lg" unoptimized />
        ) : (
          <div>No image generated yet</div>
        )}
      </CardContent>
    </Card>
  );
};
