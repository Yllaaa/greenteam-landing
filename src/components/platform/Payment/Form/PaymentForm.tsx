/* eslint-disable react-hooks/exhaustive-deps */
// "use client"
// import Image from 'next/image'
// import styles from './payment-form.module.scss'
// import footImage from '@/../public/payments/foot.png'
// import FormInputs from './FormInputs/FormInputs'

// import { useForm } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup'
// import { PaymentFormSchema } from './FormInputs/form-inputs.data'
// import { handlePayment } from './payment-form.data'

// export default function PaymentForm() {
//     const { register, handleSubmit } = useForm({ resolver: yupResolver(PaymentFormSchema) });

//     return (
//         <div className={styles.paymentForm}>
//             <div className={styles.logo}>
//                 <Image src={footImage} alt="Logo" />
//             </div>
//             <div className={styles.content}>
//                 <h1 className={styles.header}>Complete registration payment</h1>
//                 <FormInputs register={register} />
//                 <button className={styles.action} onClick={handleSubmit(handlePayment)}>Pay now</button>
//             </div>
//         </div>
//     )
// }

"use client";

import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "../stripe-config";
import CheckoutForm from "./CheckoutForm";
import styles from "./payment-form.module.scss";
// import CustomerForm from "./CustomerForm";
import { getToken } from "@/Utils/userToken/LocalToken";
import footImage from "@/../public/payments/foot.png";
import Image from "next/image";
import { useParams } from "next/navigation";

// Define form validation schema
// const schema = yup.object({
//   name: yup.string().required("Name is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   address: yup.string().required("Address is required"),
// });

// type FormData = yup.InferType<typeof schema>;

export default function PaymentForm() {
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<FormData>({
  //   resolver: yupResolver(schema),
  // });

  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Call the backend API to create a subscription
      axios
        .post(
          `https://greenteam.yllaaa.com/api/v1/subscriptions/tiers/${params&&params.planId}/subscribe`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        });
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError("Failed to initialize payment. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image src={footImage} alt="Logo" />
      </div>
      {!clientSecret ? (
        <div className={styles.formWrapper}>
          <h1 className={styles.header}>Complete registration payment</h1>
          {/* <form onSubmit={handleSubmit(onSubmit)}> */}
          {/* <CustomerForm register={register} errors={errors} /> */}

          <button
            // onClick={onSubmit}
            type="submit"
            className={styles.action}
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue to Payment"}
          </button>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {/* </form> */}
        </div>
      ) : (
        <div className={styles.stripeWrapper}>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        </div>
      )}
    </div>
  );
}
