import { fetch, Strategy, RetryPolicy, DefaultLogProvider } from '../src/index';

let strategy: Strategy;

strategy = {
    retryAttempts: 3,
    retryPolicy: RetryPolicy.LINEAR,
    hardFailCodes: [400, 422],
    softFailCodes: [500, 503],
    internalLoggingEnabled: true,
    logProvider: new DefaultLogProvider(),
};

describe('Hard Reject Error', () => {
    fetch('http://www.mocky.io/v2/5a83f34f2f0000840074bfbc', {}, strategy)
        .then(response => {
            response
                .text()
                .then(resp => console.log('fetch with strategy:' + resp));
        })
        .catch(error => {
            console.log(' Hard Reject Exception Caught: ' + error);
        });
});
