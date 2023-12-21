import { useState } from 'react';

const CustomInput = ({
  name,
  type,
  id,
  placeholder,
  icon,
  value,
  disable = false,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative w-[100%] mb-4">
      <input
        name={name}
        type={
          type === 'password' ? (passwordVisible ? 'text' : 'password') : type
        }
        placeholder={placeholder}
        id={id}
        className="input-box"
        disabled={disable}
        defaultValue={value}
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
  );
};

export default CustomInput;
