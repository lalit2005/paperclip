// @ts-check

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/

// @ts-ignore
module.exports = {
  async redirects() {
    return [
      {
        source: '/signup',
        destination: '/api/auth/login',
        permanent: false,
      },
      {
        source: '/signin',
        destination: '/api/auth/login',
        permanent: false,
      },
      {
        source: '/login',
        destination: '/api/auth/login',
        permanent: false,
      },
      {
        source: '/logout',
        destination: '/api/auth/logout',
        permanent: false,
      },
    ];
  },
};
