export type ProductsCategory =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 0

// Topic type represents the associated topic of a market item
type Topic = {
  id: number;
  name: string;
};

// Enum for market type to ensure type safety
enum MarketType {
  SecondHand = "second_hand",
  LocalBusiness = "local_business",
}

// Enum for seller type to ensure type safety
enum SellerType {
  User = "user",
  Page = "page",
}
export interface Products {
  id: string;
  name: string;
  description: string;
  imageUrl: string[];
  price: string;
  marketType: MarketType;
  sellerId: string;
  sellerType: SellerType;
  countryId: number;
  cityId: number;
  topic: Topic;
}
