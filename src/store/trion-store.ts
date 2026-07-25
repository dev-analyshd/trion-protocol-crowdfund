import { create } from 'zustand'

export type View = 'landing' | 'mint' | 'dashboard' | 'manifesto'

interface TrionState {
  currentView: View
  isConnected: boolean
  walletAddress: string | null
  email: string
  contributionAmount: string
  contributionCurrency: 'ETH' | 'USDC'
  isContributing: boolean
  contributionSuccess: boolean
  mintedNFT: { tokenId: number; tier: string } | null
  totalContributions: number
  totalContributors: number
  fundingGoal: number
  citizenData: {
    tier: string
    totalContributed: string
    tokenBalance: string
    vestedAmount: string
    nftTokenId: number | null
  } | null

  // Actions
  setView: (view: View) => void
  connectWallet: (address: string) => void
  disconnectWallet: () => void
  setEmail: (email: string) => void
  setContributionAmount: (amount: string) => void
  setContributionCurrency: (currency: 'ETH' | 'USDC') => void
  setContributing: (v: boolean) => void
  setContributionSuccess: (v: boolean) => void
  setMintedNFT: (nft: { tokenId: number; tier: string } | null) => void
  setTotalContributions: (v: number) => void
  setTotalContributors: (v: number) => void
  setCitizenData: (data: TrionState['citizenData']) => void
}

export const useTrionStore = create<TrionState>((set) => ({
  // Initial state — simulates real on-chain contract data
  currentView: 'landing',
  isConnected: false,
  walletAddress: null,
  email: '',
  contributionAmount: '',
  contributionCurrency: 'ETH',
  isContributing: false,
  contributionSuccess: false,
  mintedNFT: null,
  totalContributions: 67_250,
  totalContributors: 147,
  fundingGoal: 250_000,
  citizenData: null,

  // ── Actions ────────────────────────────────────────────────
  setView: (view) => set({ currentView: view }),

  connectWallet: (address) =>
    set({
      isConnected: true,
      walletAddress: address,
    }),

  disconnectWallet: () =>
    set({
      isConnected: false,
      walletAddress: null,
      citizenData: null,
      mintedNFT: null,
      contributionSuccess: false,
      email: '',
    }),

  setEmail: (email) => set({ email }),

  setContributionAmount: (amount) => set({ contributionAmount: amount }),

  setContributionCurrency: (currency) =>
    set({ contributionCurrency: currency }),

  setContributing: (v) => set({ isContributing: v }),

  setContributionSuccess: (v) => set({ contributionSuccess: v }),

  setMintedNFT: (nft) => set({ mintedNFT: nft }),

  setTotalContributions: (v) => set({ totalContributions: v }),

  setTotalContributors: (v) => set({ totalContributors: v }),

  setCitizenData: (data) => set({ citizenData: data }),
}))
