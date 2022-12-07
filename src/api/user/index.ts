import * as TE from 'fp-ts/TaskEither';
import axios from 'axios';
import { Config } from '@/config';

const BaseUrl = `${Config.BaseURL}/user`;

export const getAllUsers = () => {
  TE.tryCatch(
    async () => axios.get(`${BaseUrl}/all`),
    (reason) => reason,
  );
};
