export const ReplicateModels = {
  DEFAULT: '8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f',
  SDXL: '7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
} as const;

export type ReplicateModelKey = keyof typeof ReplicateModels;

export function getModel(key: string): string {
  if (!(key in ReplicateModels)) {
    throw new Error(`Invalid model key: ${key}. Valid keys are: ${Object.keys(ReplicateModels).join(', ')}`);
  }

  return ReplicateModels[key as ReplicateModelKey];
}
