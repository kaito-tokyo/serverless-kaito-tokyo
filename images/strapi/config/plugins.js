module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        baseUrl: env('CF_PUBLIC_ACCESS_URL'), 
        s3Options: {
          credentials: {
            accessKeyId: env('CF_ACCESS_KEY_ID'),
            secretAccessKey: env('CF_SECRET_ACCESS_KEY'),
          },
          endpoint: env('CF_ENDPOINT'),
          region: 'auto',
        },
        params: {
          Bucket: env('CF_BUCKET'),
        },
      },
    },
  },
});
