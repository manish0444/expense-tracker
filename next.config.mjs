/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['framer-motion'],
    webpack: (config) => {
      config.resolve.extensions = [...config.resolve.extensions, '.mjs']
      return config
    }
  };
  
  export default nextConfig;