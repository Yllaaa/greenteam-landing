export type ProductsCategory = 1 | 2 | 3 | 4 | 5 | 6 | 0;

// Topic type represents the associated topic of a market item
type Topic = {
  id: number;
  name: string;
};

// Enum for market type to ensure type safety
enum MarketType {
  SecondHand = 'second_hand',
  LocalBusiness = 'local_business',
}

// Enum for seller type to ensure type safety
enum SellerType {
  User = 'user',
  Page = 'page',
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
  images: {
    id: string;
    mediaUrl: string;
    mediaType: string;
  }[];
  isFavorited: boolean;
}

// Image/Media type definition
interface ProductImage {
  id: string;
  mediaUrl: string;
  mediaType: string; // Typically "image" but could be other types
}

// Seller type definition
interface Seller {
  id: string;
  name: string;
  avatar: string | null;
}

// Main Product type definition
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string; // Using string for price to maintain decimal precision
  marketType: string; // e.g., "local_business"
  sellerId: string;
  sellerType: string; // e.g., "page"
  countryId: number;
  cityId: number;
  topic: Topic;
  images: ProductImage[];
  seller: Seller;
  website?: string; // Optional field for website URL
}
