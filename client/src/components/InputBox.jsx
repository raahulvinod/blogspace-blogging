import { useState } from 'react';
import { Field, ErrorMessage } from 'formik';

const InputBox = ({ name, type, id, placeholder, icon }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <>
      <div className="relative w-[100%] mb-4">
        <Field
          name={name}
          type={
            type === 'password' ? (passwordVisible ? 'text' : 'password') : type
          }
          placeholder={placeholder}
          id={id}
          className="input-box"
        />
        <i className={'fi ' + icon + ' input-icon'}></i>

        {type === 'password' ? (
          <i
            className={
              'fi fi-rr-eye' +
              (!passwordVisible ? '-crossed' : '') +
              ' input-icon left-[auto] right-4 cursor-pointer'
            }
            onClick={() => setPasswordVisible((currentVal) => !currentVal)}
          ></i>
        ) : (
          ''
        )}
      </div>
      <ErrorMessage name={name} component="div" className="error-message" />
    </>
  );
};

export default InputBox;
