
import { fetch, Strategy, RetryPolicy, DefaultLogProvider } from '../src/index';

import * as mocha from 'mocha';
import * as chai from 'chai';

let strategy: Strategy;

strategy = {
    retryAttempts: 3,
    retryPolicy: RetryPolicy.LINEAR,
    hardFailCodes: [400, 422],
    softFailCodes: [500, 503],
    internalLoggingEnabled: true
    //logProvider: new DefaultLogProvider()
};

fetch('http://www.mocky.io/v2/5a83f34f2f0000840074bfbc', {}, strategy).then(response =>{
    console.log(response.json());
}).catch( error => {
    console.log( " Hard Reject Exception Caught: " + error);
});