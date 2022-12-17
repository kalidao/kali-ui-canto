import create from 'zustand'
import { ethers } from 'ethers'
import { DAO_ABI } from '~/constants'
import { fetchProposals } from '~/utils/fetchProposals'

interface DaoStore {
  chainId: number
  address: string
  setAddress: (address: string) => void
  token: {
    name: string
    symbol: string
    docs: string
  }
  setToken: (address: string) => void
  meta: {
    mission: string
    logo: string
  }
  setMeta: (docs: string) => void
  proposals: any[]
  setProposals: (address: string) => void
}

export const useDaoStore = create<DaoStore>((set) => ({
  chainId: 7700,
  address: '',
  setAddress: (address: string) => {
    set({ address })
  },
  token: {
    name: '',
    symbol: '',
    docs: '',
  },
  setToken: async (address: string) => {
    if (address == '') return
    const provider = new ethers.providers.JsonRpcProvider('https://canto.slingshot.finance/')
    const contract = new ethers.Contract(address, DAO_ABI, provider)
    const name = await contract.name()
    const symbol = await contract.symbol()
    const docs = await contract.docs()
    set({ token: { name, symbol, docs } })
  },
  meta: {
    mission: '',
    logo: '',
  },
  setMeta: async (docs: string) => {
    if (docs == '') return
    const meta = await fetch(docs)
    const { mission, logo } = await meta.json()
    set({ meta: { mission, logo } })
  },
  proposals: [],
  setProposals: async (address: string) => {
    if (address == '') return
    const proposals = await fetchProposals(address)
    set({
      proposals: proposals,
    })
  },
}))
