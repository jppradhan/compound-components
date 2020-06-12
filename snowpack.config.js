module.exports = {
  scripts: {
    'mount:public': 'mount public --to /',
    'mount:src': 'mount src --to /_dist_',
  },
  plugins: [
    [
      '@snowpack/plugin-webpack',
      {
        extendConfig: (config) => {
          const updatedConfig = {
            ...config,
            output: {
              ...config.output,
              filename: 'js/compound-components.js',
            },
          };
          return updatedConfig;
        },
      },
    ],
  ],
};
