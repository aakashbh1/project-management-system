import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
    uri: 'http://localhost:8000/graphql/',
    credentials: 'include',
});

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                allProjects: {
                    merge(existing = [], incoming) {
                        return incoming;
                    },
                },
                allTasks: {
                    merge(existing = [], incoming) {
                        return incoming;
                    },
                },
            },
        },
    },
});

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});
