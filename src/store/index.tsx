import React from 'react'
import storeFactory from './storeFactory'
import { useLocalObservable, useLocalStore } from 'mobx-react-lite'

export type Stores = ReturnType<typeof storeFactory>

const storeContext = React.createContext<Stores | null>(null)

export const StoreProvider = ({ children }: any) => {
  const store = useLocalStore(storeFactory)

  return <storeContext.Provider value={store}>{children}</storeContext.Provider>
}

const useStore = () => {
  const store = React.useContext(storeContext)
  if (!store) {
    throw new Error('Store not found')
  }

  return store
}

export default useStore
