/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  webpack(config) {
    // Allow importing GLSL shader files
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      use: "raw-loader",
    });
    return config;
  },
};

export default nextConfig;
