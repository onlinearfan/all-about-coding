/**
 * !how to use react hook form with yup package,
 * 1)yarn add react-hook-form yup @hookform/resolver/yup
 * 2)make a basic form with your require input fields,
 * 3)import react form hook and yup , and resolver, [useForm,yup-resolver,yup,]
 * 4)make a schema form validate by yup.object.shape(),,
 * 4)get {register,submitHandle,errors} = useForm({ resolver:yupResolver(schema)})
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookForm/resolver/yup';
import * as yup from 'yup';

const schema = yup.object.shape({
   firstName: yup.string().required(),
   lastName: yup.string().required('last name is required'),
   email: yup.string().email().required(),
   password: yup.string().max(15).min(4).required(),
   confirmPass: yup.string().oneOf([yup.ref('password'), null]),
});

//form component
function Form() {

    const {register,handleSubmit,errors} = useForm({
        resolver:yupResolver(schema)
    })

   //submit form data will get in this function
   function submitForm(data) {
      //this from will be handle form react hook form function called handleSubmit
      //we will find all the input value form data object in all is ok,
      console.log(data);
   }
   return (
      <>
         <form action="" onSubmit={handleSubmit(submitForm)}>
            <input type="text" name="firstName" placeholder="first name" ref={register}/>
            { errors.firstName?.message}
            <input type="text" name="lastName" placeholder="last name" ref={register}/>
            {errors.lastName && <p>last name is required</p>}
            <input type="email" name="email" placeholder="email" ref={register}/>
            <input type="password" name="password" ref={register}/>
            <input type="password" name="confirmPass" ref={register}/>
            <input type="submit" value="Submit" ref={register}/>
         </form>
      </>
   );
}

export default Form;
