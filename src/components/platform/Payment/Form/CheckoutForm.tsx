import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import styles from "./payment-form.module.scss";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: "if_required"
    });

    if (error) {
      setMessage(error.message || "Something went wrong with your payment");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment successful!");
      setTimeout(() => {
        router.push("/payment-success");
      }, 1500);
    } else {
      setMessage("Unexpected payment status. Please contact support.");
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className={styles.formSection}>
        <h2>Payment Details</h2>
        <div className={styles.paymentElementWrapper}>
          <PaymentElement />
        </div>
      </div>
      
      <button 
        className={styles.submitButtonStripe}
        disabled={isProcessing || !stripe || !elements}
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
      
      {message && <div className={styles.messageBox}>{message}</div>}
    </form>
  );
}