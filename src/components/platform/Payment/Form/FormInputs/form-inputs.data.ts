import * as yup from 'yup';

export const PaymentFormSchema = yup.object({
  cardholderName: yup.string().required('Cardholder name is required'),
  cardNumber: yup.string().required('Card number is required'),
  expirationDate: yup.string().required('Expiration date is required'),
  cvv: yup.string().required('CVV is required'),
});