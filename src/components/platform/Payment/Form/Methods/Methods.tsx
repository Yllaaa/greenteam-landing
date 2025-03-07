import styles from './methods.module.scss';
import visaIcon from '@/../public/payments/methods/visa.svg'
import mastercardIcon from '@/../public/payments/methods/mastercard.svg'
import stripeIcon from '@/../public/payments/methods/stripe.svg'
import payPalIcon from '@/../public/payments/methods/payPal.svg'
import googlePayIcon from '@/../public/payments/methods/googlePay.svg'
import Image from 'next/image';

const PaymentMethods: React.FC = () => {
    const methods = [
        { name: "Visa", icon: visaIcon },
        { name: "MasterCard", icon: mastercardIcon },
        { name: "Stripe", icon: stripeIcon },
        { name: "PayPal", icon: payPalIcon },
        { name: "Google Pay", icon: googlePayIcon },
    ];

    return (
        <div className={styles.methods}>
            <div className={styles.header}>Payment Methods</div>
            <div className={styles.content}>
                {methods.map((method) => (
                    <div key={method.name} className={styles.item}>
                        <Image src={method.icon} alt={method.name} width={40} height={40} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentMethods;

