import * as yup from 'yup';

export const PaymentFormSchema = yup.object().shape({
    cardNumber: yup.string().required('Card Number is required'),
    cardholderName: yup.string().required('Cardholder Name is required'),
    expirationDate: yup.string().required('Expiration Date is required'),
    cvv: yup.string().required('CVV is required'),
});