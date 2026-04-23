/** @type {import('next').NextConfig} */
const nextConfig = {
  // …
    allowedDevOrigins: ['10.0.0.185'],
  experimental: {
    // …
    appDir: true,
    asyncWebAssembly: true ,
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
    
  },
};
export default nextConfig;
