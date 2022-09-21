/** @type {import('next').NextConfig} */
module.exports = {
  compiler: {
    relay: {
      src: './src',
      language: 'typescript',
      artifactDirectory: './src/__generated__/relay',
      styledComponents: true,
    },
  },
  reactStrictMode: true,
}
