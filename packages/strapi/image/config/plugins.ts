export default ({ env }) => ({
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        s3Options: {
          baseUrl: env("CF_PUBLIC_ACCESS_URL"),
          credentials: {
            accessKeyId: env("CF_ACCESS_KEY_ID"),
            secretAccessKey: env("CF_SECRET_ACCESS_KEY"),
          },
          endpoint: env("CF_ENDPOINT"),
          region: "auto",
          params: {
            Bucket: env("CF_BUCKET"),
          },
        },
      },
    },
  },
  "user-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
});
