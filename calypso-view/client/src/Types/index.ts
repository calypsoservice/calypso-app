export interface IAppContext {
  user?: IUserContext
  tokens?: ITokenContext[]
  stakes?: IStakeContext[]
}

export interface IUserContext {
  id: number
  accountNonExpired: boolean
  accountNonLocked: boolean
  credentialsNonExpired: boolean
  email: string
  enabled: boolean
  totalChildUser: number | string | null
  totalPayout: number | string | null
  totalRefReward: number | string | null
  totalReward: number | string | null
  totalActiveChildUser: number | string | null
  totalStake: number | string | null
  username: string
  verifyEmail: boolean
  userWallet: {
    id: number
    walletAddresses: IWalletContext[]
  }
  userStakes: IUserStakeContext[]
  messages: IMessageContext[]
  childLVL1: IReferralUser[]
  childLVL2: IReferralUser[]
  childLVL3: IReferralUser[]
  childLVL4: IReferralUser[]
  childLVL5: IReferralUser[]
  childLVL6: IReferralUser[]
  childLVL7: IReferralUser[]
  walletTransactions: IWalletTransaction[]
}

export interface IWalletTransaction {
  amount: number
  dateCreated: string
  hash: string
  id: number
  status: {
    id: number
    status: "prepared" | "confirmation" | "completed" | "error"
  }
  type: {
    id: number
    type: string
  }
  walletAddress: IWalletContext
  receiveHash: string | null
  memo: string
  receiveAddress: string
  hidden: boolean
}

export interface IReferralUser {
  amountParentReward: string
  amountStake: string
  email: string
  username: string
}

export interface IWalletContext {
  address: string
  balance: string
  id: number
  token: ITokenContext
}

export interface IStakeContext {
  id: number
  name: string
  maxAmount: number
  minAmount: number
  percentDay: number
  periodDays: number
}

export interface IUserStakeContext {
  amount: number | string
  closed: boolean
  currentReward: number | string
  dateCreated: string
  id: number
  periodReward: number
  stake: IStakeContext
  token: ITokenContext
}

export interface IMessageContext {
  id: number
  text: string
  sendingTime: string
  admin: boolean
  read: boolean
}

export interface ITokenContext {
  id: number
  decimalLength: number
  image: string
  name: string
  native: boolean
  percentChange: string
  price: number
  smartContract: string
  symbol: string
  network: INetworkContext
}

export interface INetworkContext {
  id: number
  chainId: number
  image: string
  name: string
  node: string
  symbol: string
  testNode: string
}
