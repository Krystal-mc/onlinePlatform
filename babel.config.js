module.exports = {
  presets: [
    ['@vue/app', {
      useBuiltIns: 'entry'
    }]
  ],
  plugins: [
    [
      'import',
      { libraryName: 'vant', libraryDirectory: 'es', style: (name) => `${name}/style/less` },
      'vant'
    ]
  ]
}
