
import { fetch, Strategy, RetryPolicy, DefaultLogProvider } from '../src/index';

import * as mocha from 'mocha';
import * as chai from 'chai';

let strategy: Strategy;

strategy = {
    retryAttempts: 5,
    retryPolicy: RetryPolicy.EXPONENTIAL_BACKOFF,
    hardFailCodes: [400, 422],
    softFailCodes: [500, 503],
    //logProvider: new DefaultLogProvider()
};

fetch('http://www.mocky.io/v2/5a83f3a62f0000560074bfbe', {}, strategy).then(response =>{
    console.log(response.json());
}).catch( error => {
    console.log(error);
});