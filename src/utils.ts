import { createBucketClient } from '@cosmicjs/sdk';

const cosmic = createBucketClient({
  bucketSlug: 'bbhss-production',
  readKey: '03yvDMKwn7se777PUBvEOgYyGZk3nG7MfU26f8cXVhWCFDEScx',
});

export const fetchSiteMetadata = async () => {
  try {
    const response = await cosmic.objects.findOne({
      type: 'site-meta',
      slug: 'bhogail-bagadi-secondary-school-alamdanga',
    }).props('slug,title,metadata').depth(1);

    return response.object.metadata;
  } catch (error) {
    console.error('Error fetching site metadata:', error);
    return null;
  }
};
