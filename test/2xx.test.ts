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

describe('200 Resolve Without Strategy Test', () => {
    fetch('http://www.mocky.io/v2/5a8410ba3000007f0069adf5', {}).then(
        response => {
            response
                .text()
                .then(resp => console.log('fetch without strategy:' + resp));
        }
    );
});

describe('200 Resolve With Strategy Test', () => {
    fetch('http://www.mocky.io/v2/5a8410ba3000007f0069adf5', {}, strategy).then(
        response => {
            response
                .text()
                .then(resp => console.log('fetch with strategy:' + resp));
        }
    );
});
