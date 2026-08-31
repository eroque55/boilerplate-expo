import { useMutation } from '@tanstack/react-query';

import { zipCodeService } from '@/services/api/cep';
import { normalize } from '@/utils/format';

export const useZipCode = (zipCode: string) => {
  return useMutation({
    mutationFn: () => zipCodeService.getAddress(normalize(zipCode)),
  });
};
