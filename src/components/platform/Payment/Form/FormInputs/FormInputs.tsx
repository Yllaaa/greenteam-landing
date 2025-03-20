/* eslint-disable @typescript-eslint/no-explicit-any */
// import { UseFormRegister } from 'react-hook-form';
// import styles from './form-inputs.module.scss'
// import Item from './Item';
// import * as yup from 'yup';
// import { PaymentFormSchema } from './form-inputs.data';

// type FormInputsProps = {
//     register: UseFormRegister<yup.InferType<typeof PaymentFormSchema>>
// }

// const FormInputs = ({
//     register
// }: FormInputsProps) => {
//     return (
//         <div className={styles.formInputs}>
//             <div className={styles.header}>Payment Information</div>
//             <div className={styles.content}>
//                 <Item label="Card Number" {...register('cardNumber')} placeholder="•••• •••• •••• ••••" />
//                 <Item label="Cardholder Name" {...register('cardholderName')} placeholder="John Doe" />
//                 <Item label="Expiration Date" {...register('expirationDate')} placeholder="MM/YY" />
//                 <Item label="CVV" {...register('cvv')} placeholder="•••" />
//             </div>
//         </div>
//     )
// }

// export default FormInputs;
import { UseFormRegister } from 'react-hook-form';
import styles from './form-inputs.module.scss';
import Item from './Item';
import * as yup from 'yup';
import { PaymentFormSchema } from './form-inputs.data';

type FormInputsProps = {
  register: UseFormRegister<yup.InferType<typeof PaymentFormSchema>>;
  errors?: any;
}

const FormInputs = ({
  register,
  errors
}: FormInputsProps) => {
  return (
    <div className={styles.formInputs}>
      <div className={styles.header}>Payment Information</div>
      <div className={styles.content}>
        <Item 
          label="Card Number" 
          {...register('cardNumber')} 
          placeholder="•••• •••• •••• ••••"
          error={errors?.cardNumber?.message} 
        />
        <Item 
          label="Cardholder Name" 
          {...register('cardholderName')} 
          placeholder="John Doe"
          error={errors?.cardholderName?.message}
        />
        <Item 
          label="Expiration Date" 
          {...register('expirationDate')} 
          placeholder="MM/YY"
          error={errors?.expirationDate?.message}
        />
        <Item 
          label="CVV" 
          {...register('cvv')} 
          placeholder="•••"
          error={errors?.cvv?.message}
        />
      </div>
    </div>
  );
}

export default FormInputs;