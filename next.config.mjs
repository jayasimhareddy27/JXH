/** @type {import('next').NextConfig} */
const nextConfig = {
  // …
  experimental: {
    // …
    appDir: true,
    asyncWebAssembly: true ,
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
    
  },
};
export default nextConfig;
