import Image from 'next/image'
import styles from './payment-form.module.scss'
import footImage from '@/../public/payments/foot.png'
import FormInputs from './FormInputs/FormInputs'
import PaymentMethods from './Methods/Methods'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { PaymentFormSchema } from './FormInputs/form-inputs.data'
import { handlePayment } from './payment-form.data'

export default function PaymentForm() {
    const { register, handleSubmit } = useForm({ resolver: yupResolver(PaymentFormSchema) });

    return (
        <div className={styles.paymentForm}>
            <div className={styles.logo}>
                <Image src={footImage} alt="Logo" />
            </div>
            <div className={styles.content}>
                <h1 className={styles.header}>Complete registration payment</h1>
                <FormInputs register={register} />
                <PaymentMethods />
                <button className={styles.action} onClick={handleSubmit(handlePayment)}>Pay now</button>
            </div>
        </div>
    )
}


