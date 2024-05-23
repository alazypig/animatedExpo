module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['react-native-reanimated/plugin'],
      ['@babel/plugin-transform-export-namespace-from'],
      ['@babel/plugin-transform-class-properties', { loose: false }],
      [
        '@babel/plugin-transform-private-methods',
        {
          assumptions: {
            setPublicClassFields: true,
            privateFieldsAsSymbols: true,
          },
        },
      ],
      ['@babel/plugin-transform-private-property-in-object', { loose: false }],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: false }],
      ['@babel/plugin-transform-flow-strip-types'], // prevent compile
    ],
    assumptions: {
      setPublicClassFields: false,
    },
    overrides: [
      {
        test: (fileName) => !fileName.includes('node_modules'),
        plugins: [
          [
            require('@babel/plugin-transform-class-properties'),
            { loose: false },
          ],
          [
            require('@babel/plugin-transform-private-methods'),
            { loose: false },
          ],
          [
            require('@babel/plugin-transform-private-property-in-object'),
            { loose: false },
          ],
        ],
      },
    ],
  }
}
