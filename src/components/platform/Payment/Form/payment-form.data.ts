import { getToken } from "@/Utils/userToken/LocalToken";
import axios from "axios";

export const handlePayment = async () => {
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  try {
    // Make API call to your backend
    const response = await axios.post(
      "https://greenteam.yllaaa.com/api/v1/subscriptions/tiers/2/subscribe",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Get the clientSecret from the response
    const { clientSecret } = response.data;

    // Redirect to the Stripe checkout page
    window.location.href = `/checkout?payment_intent_client_secret=${clientSecret}`;
  } catch (error) {
    console.error("Payment error:", error);
    // Handle error appropriately
  }
};
