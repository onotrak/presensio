module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@global_components': './src/components/globals/',
          '@styles': './src/styles/',
          '@assets': './src/assets/',
          '@utils': './src/utils/',
          '@screens': './src/screens/',
          '@navigations': './src/navigations/',
        },
      },
    ],
  ]
};
