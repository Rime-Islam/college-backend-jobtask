import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../interfaces/error';

const handleCastError = (error: mongoose.Error.CastError) => {
  const errors: IGenericErrorMessage[] = [
    {
      path: error.path,
      message: 'Invalid Id',
    },
  ];

  const status_code = 400;
  return {
    status_code,
    message: 'Cast Error',
    error_messages: errors,
  };
};
export default handleCastError;
