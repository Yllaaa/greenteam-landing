import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51MJPIeEOoCJm1yBYdZ5YoW8kydKr0BNjP6Mj8rAbU4MKMkc6EK2Jf865rQGMRLr1RkncWEnYzZpoLTbQ1lTg4ADa003R3wOon1"
);

export default stripePromise;