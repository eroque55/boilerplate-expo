import axios from 'axios';

import { TViaCEPResponse } from '@/types/viaCEP';

export const zipCodeService = {
  getAddress: async (zipCode: string) => {
    const normalizedZipCode = zipCode.replace(/\D/g, '');

    const { data } = await axios.get<TViaCEPResponse>(
      `https://viacep.com.br/ws/${normalizedZipCode}/json/`,
    );
    return data;
  },
};
