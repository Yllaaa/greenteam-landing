export interface SubscriptionTier {
  id: number;
  name: string;
  price: number;
  benefits: string[];
}
export interface CurrentTier {
  id: string;
  userId: string;
  tierId: number;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  stripeSubscriptionId: string;
  tier: {
    id: number;
    name: string;
  };
}
