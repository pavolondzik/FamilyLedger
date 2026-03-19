import { QueryClient } from '@tanstack/react-query';

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        staleTime: 30_000,
      },
      mutations: {
        retry: 0,
      },
    },
  });
};

export const queryClient = createQueryClient();