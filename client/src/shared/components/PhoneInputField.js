import React from 'react';
import PhoneInput from 'react-phone-input-2';
import { Form } from '@8base/boost';

import 'react-phone-input-2/lib/style.css';

export const PhoneInputField = ({ input, meta, maxFiles, label, ...rest }) => {
  const onChange = (value, data) => {
    const code = data.dialCode;
    const number = value.slice(code.length);
    input.onChange({ code, number });
  };

  const value = input.value || { code: '', phone: '' };
  return (
    <Form.Field label={label} input={input} meta={meta}>
      <PhoneInput
        country={'ru'}
        onChange={onChange}
        value={`${value.code}${value.number}`}
      />
    </Form.Field>
  );
};
