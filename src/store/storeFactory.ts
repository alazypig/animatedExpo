import RootStore from './root'

const storeFactory = () => {
  const root = new RootStore()

  const stores = { root }

  root.initStores(stores)

  return stores
}

export default storeFactory
