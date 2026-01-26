/** @type {import('next').NextConfig} */
const nextConfig = {
  // …
  experimental: {
    // …
    asyncWebAssembly: true ,
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
    
  },
};
export default nextConfig;
