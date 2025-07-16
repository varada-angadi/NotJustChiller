import * as Yup from 'yup';

export const transactionSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .max(25, 'Max 25 characters'),

  amount: Yup.number()
    .typeError('Amount must be a number')
    .positive('Must be positive')
    .required('Amount is required'),

  date: Yup.date()
  .required('Date is required'),

  category: Yup.string()
  .required('Please select a category'),

  description: Yup.string()
  .max(100, 'Max 100 characters'),
});
