import { QueryClient } from '@tanstack/react-query';


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60000,
            retry: 5,
        },
    },
});



export default queryClient;