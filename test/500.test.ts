import { fetch, Strategy, RetryPolicy, DefaultLogProvider } from '../src/index';

let strategy: Strategy;

strategy = {
    retryAttempts: 5,
    retryPolicy: RetryPolicy.EXPONENTIAL_BACKOFF,
    hardFailCodes: [400, 422],
    softFailCodes: [500, 503],
    internalLoggingEnabled: true,
    logProvider: new DefaultLogProvider(),
};

describe('Soft Reject Test', () => {
    fetch('http://www.mocky.io/v2/5a83f3a62f0000560074bfbe', {}, strategy)
        .then(response => {
            response
                .text()
                .then(resp => console.log('fetch with strategy:' + resp));
        })
        .catch(error => {
            console.log(error);
        });
});
