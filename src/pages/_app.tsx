import { Auth0Provider } from '@auth0/auth0-react';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

import { DTIApolloProvider } from '@/providers/DTIApolloProvider';
import { setupLogging } from '@/utils/setupLogging';
import { theme } from '@/theme';

const DressToImpress = ({ Component, pageProps }: AppProps) => {
  useEffect(() => setupLogging(), []);
  return (
    <Auth0Provider
      domain="openneo.us.auth0.com"
      clientId="8LjFauVox7shDxVufQqnviUIywMuuC4r"
      authorizationParams={{
        redirect_uri:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://impress-2020.openneo.net',
        audience: 'https://impress-2020.openneo.net/api',
        scope: '',
      }}
    >
      <DTIApolloProvider additionalCacheState={pageProps.graphqlState ?? {}}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </DTIApolloProvider>
    </Auth0Provider>
  );
};

export default DressToImpress;
