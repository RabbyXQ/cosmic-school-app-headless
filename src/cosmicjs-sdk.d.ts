// src/types/cosmicjs-sdk.d.ts
declare module '@cosmicjs/sdk' {
    export function createBucketClient(config: {
      bucketSlug: string;
      readKey: string;
    }): {
      objects: {
        findOne(query: {
          type: string;
          slug: string;
        }): {
          props(fields: string): {
            depth(level: number): Promise<any>;
          };
        };
      };
    };
  }
  