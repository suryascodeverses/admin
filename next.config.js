/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
      },
    ];
  },
  images: {
    domains: [
      "i.ibb.co",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "localhost",
      "192.168.1.5", // add your backend IP here
    ],
  },
};

module.exports = nextConfig;
