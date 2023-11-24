import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import InputBox from '../components/InputBox';
import AnimationWrapper from '../utils/animation';
import googleIcon from '../images/google.png';

const validationSchema = Yup.object({
  fullname: Yup.string().test({
    test: function (value) {
      if (this.parent.type === 'sign-up') {
        return (
          (value && value.length >= 3) ||
          this.createError({
            message: 'Full name required. must be at least 3 characters',
          })
        );
      }
      return true;
    },
  }),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
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

const UserAuth = ({ type }) => {
  const initialValues = {
    fullname: type === 'sign-up' ? '' : undefined,
    email: '',
    password: '',
    type: type,
  };

  const handleSubmit = (values) => {
    // Handle form submission here
    console.log(values);
  };

  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="w-[80%] max-w-[400px]">
            <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
              {type === 'sign-in' ? 'Welcome back' : 'Join us today'}
            </h1>
            {type !== 'sign-in' && (
              <Field name="fullname">
                {({ field }) => (
                  <InputBox
                    {...field}
                    type="text"
                    placeholder="Full Name"
                    icon="fi-rr-user"
                  />
                )}
              </Field>
            )}

            <Field name="email">
              {({ field }) => (
                <InputBox
                  {...field}
                  type="email"
                  placeholder="Email"
                  icon="fi-rr-envelope"
                />
              )}
            </Field>

            <Field name="password">
              {({ field }) => (
                <InputBox
                  {...field}
                  type="password"
                  placeholder="Password"
                  icon="fi-rr-key"
                />
              )}
            </Field>

            <button className="btn-dark center mt-14" type="submit">
              {type.replace('-', ' ')}
            </button>

            <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
              <hr className="w-1/2 border-black" />
              <p>or</p>
              <hr className="w-1/2 border-black" />
            </div>

            <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
              <img src={googleIcon} alt="google logo" className="w-5" />
              continue with google
            </button>

            {type === 'sign-in' ? (
              <p className="mt-6 text-dark-grey text-xl text-center">
                Don't have an account ?{' '}
                <Link
                  to="/signup"
                  className="underline text-black text-xl ml-1"
                >
                  Join us today
                </Link>
              </p>
            ) : (
              <p className="mt-6 text-dark-grey text-xl text-center">
                Already a member ?
                <Link
                  to="/signin"
                  className="underline text-black text-xl ml-1"
                >
                  Sign in here.
                </Link>
              </p>
            )}
          </Form>
        </Formik>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuth;
