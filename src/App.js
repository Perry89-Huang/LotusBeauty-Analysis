import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import RestaurantOrderApp from './RestaurantOrderApp';

// Apollo Client 設置（保持不變）
const hasuraLink = process.env.REACT_APP_HASURA_LINK;
if (!hasuraLink) {
  throw new Error('REACT_APP_HASURA_LINK is not defined in the environment');
}

const httpLink = createHttpLink({
  uri: hasuraLink,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-hasura-admin-secret': process.env.REACT_APP_HASURA_ADMIN_SECRET,
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});


const App = () => (
  <ApolloProvider client={client}>
    <RestaurantOrderApp restaurantId={1} />
  </ApolloProvider>
);

export default App;
