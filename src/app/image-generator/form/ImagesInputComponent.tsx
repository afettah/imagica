import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Trash } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import Image from 'next/image';

export const ImagesInputComponent = () => {
  const { setValue, control } = useFormContext();
  const uploadedImages = useWatch({ control, name: 'uploadedImages' }) || [];

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setValue('uploadedImages', [...uploadedImages, ...acceptedFiles]);
    },
    [setValue, uploadedImages]
  );

  const removeImage = (index: number) => {
    setValue(
      'uploadedImages',
      uploadedImages.filter((_: unknown, i: number) => i !== index)
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
  });
  return (
    <div>
      <div {...getRootProps()} className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here ...</p>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto" />
            <p>Drag and drop some images here, or click to select images</p>
          </div>
        )}
      </div>

      {uploadedImages.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {uploadedImages.map((file: File, index: number) => {
            const imageUrl = URL.createObjectURL(file);
            return (
              <div key={index} className="relative">
                <Image
                  src={imageUrl}
                  alt="uploaded"
                  width={96} // Specify a fixed width (e.g., 96px)
                  height={96} // Specify a fixed height (e.g., 96px)
                  className="w-full h-24 object-cover rounded-md"
                  unoptimized // Disable Next.js optimization for object URLs
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  aria-label="Delete image"
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
