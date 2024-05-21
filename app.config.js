import 'ts-node/register' // Add this to import TypeScript files

const IS_DEV = process.env.APP_VARIANT === 'development'
const IS_PREVIEW = process.env.APP_VARIANT === 'preview'

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.edward.animatedExpo.dev'
  }

  if (IS_PREVIEW) {
    return 'com.edward.animatedExpo.preview'
  }

  return 'com.edward.animatedExpo'
}

const getAppName = () => {
  if (IS_DEV) {
    return 'Animated Expo (Dev)'
  }

  if (IS_PREVIEW) {
    return 'Animated Expo (Preview)'
  }

  return 'Animated Expo'
}

export default {
  name: getAppName(),
  ios: {
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    package: getUniqueIdentifier(),
  },
}
