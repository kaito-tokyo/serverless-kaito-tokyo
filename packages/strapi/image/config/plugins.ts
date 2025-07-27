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
  "github-actions-dispatcher": {
    enabled: true,
    config: {
      appId: env("GITHUB_APP_ID"),
      installationId: env("GITHUB_INSTALLATION_ID"),
      privateKey: env("GITHUB_PRIVATE_KEY").replace(/\\n/g, '\n'),
      owner: env("GITHUB_OWNER"),
      repo: env("GITHUB_REPO"),
    }
  }
});
