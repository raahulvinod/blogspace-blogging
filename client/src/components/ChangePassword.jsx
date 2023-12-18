import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import AnimationWrapper from '../utils/animation';
import InputBox from './InputBox';
import { Toaster } from 'react-hot-toast';

const validationSchema = Yup.object({
  currentPassword: Yup.string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    )
    .required('Password is required'),
  newPassword: Yup.string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    )
    .required('Password is required'),
});

const initialValues = {
  currentPassword: '',
  newPassword: '',
};

const handleSubmit = (values) => {
  console.log(values);
};

const ChangePassword = () => {
  return (
    <AnimationWrapper>
      <Toaster />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="w-full md:max-w-[400px]">
          <h1 className="max-md:hidden mb-8">Change Password</h1>
          <Field name="currentPassword">
            {({ field }) => (
              <InputBox
                {...field}
                type="password"
                placeholder="Current password"
                className="profile-edit-input"
                icon="fi-rr-unlock"
              />
            )}
          </Field>

          <Field name="newPassword">
            {({ field }) => (
              <InputBox
                {...field}
                type="password"
                placeholder="New password"
                className="profile-edit-input"
                icon="fi-rr-unlock"
              />
            )}
          </Field>
          <button className="btn-dark px-10" type="submit">
            Change Password
          </button>
        </Form>
      </Formik>
    </AnimationWrapper>
  );
};

export default ChangePassword;
