import Logger from '@/utils/logger'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const STORAGE_KEY_THEME_DARK = '@dark'

export const store = async (key: string, value: string | object) => {
  try {
    if (typeof value === 'object') {
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } else {
      await AsyncStorage.setItem(key, value)
    }

    // Logger.info(`Stored ${key} in storage successfully., value: ${value}`)
  } catch (e) {
    Logger.warn(`Failed to store ${key} in storage.: ${e}`)
  }
}

export const get = async (key: string) => {
  try {
    const value = (await AsyncStorage.getItem(key)) ?? ''

    // Logger.info(`Got ${key} from storage successfully., value: ${value}`)
    return value
  } catch (e) {
    Logger.warn(`Failed to get ${key} from storage.: ${e}`)
  }
}

export const remove = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key)

    Logger.info(`Removed ${key} from storage successfully.`)
  } catch (e) {
    Logger.warn(`Failed to remove ${key} from storage.: ${e}`)
  }
}
