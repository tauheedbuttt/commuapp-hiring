import * as yup from 'yup';

export const locationFormSchema = yup.object({
  country: yup.string().trim().required('Select a country.'),
  city: yup.string().trim().required('Enter your city.'),
});

export type LocationFormValues = yup.InferType<typeof locationFormSchema>;
