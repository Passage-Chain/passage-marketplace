export interface World {
  _id: string
  owner: string
  worldName?: string
  shortDescription?: string
  longDescription?: string
  isFavourite?: boolean
  isInWorld?: boolean
  worldHeaderImage?: string
  worldPromoImage?: string
  worldLogo?: string
  worldIcon?: string
  tags?: string[]
  genres?: string[]
  tours?: Tour[]
}

export interface Tour {
  startDate: Date
  endDate: Date
}

export interface RootState {
  world: World
  account: any
  app: any
}

export interface NFT {
  id: string
  name: string
  image: string
  owner: string
  base: string
  market: string
  price: number
  forSale: boolean
  attributes: {}
}
