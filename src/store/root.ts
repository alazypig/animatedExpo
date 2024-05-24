import Logger from '@/utils/logger'
import { Stores } from '.'
import { action, makeAutoObservable, observable } from 'mobx'
import { STORAGE_KEY_THEME_DARK, get, store } from '@/storage'

class RootStore {
  private __stores?: Stores

  @observable
  private __dark: 'light' | 'dark'

  @observable
  private __loading: boolean = true

  constructor() {
    makeAutoObservable(this)
    this.init()
  }

  @action
  async init() {
    const darkMode = await get(STORAGE_KEY_THEME_DARK)
    if (darkMode === '') {
      this.__dark = 'light'
      await store(STORAGE_KEY_THEME_DARK, 'dark')
    } else {
      this.__dark = darkMode === 'dark' ? 'dark' : 'light'
    }

    this.__loading = false
    // Logger.info(`darkMode: ${this.__dark}`)
  }

  @action
  async toggleDark() {
    this.__dark = this.__dark === 'light' ? 'dark' : 'light'
    await store(STORAGE_KEY_THEME_DARK, this.__dark)
  }

  initStores(stores) {
    this.__stores = stores
  }

  get stores() {
    return this.__stores
  }

  get dark() {
    return this.__dark
  }

  get loading() {
    return this.__loading
  }
}

export default RootStore
