import { fetch, Strategy, RetryPolicy, DefaultLogProvider } from '../src/index';

import * as mocha from 'mocha';
import * as chai from 'chai';

let strategy: Strategy;

strategy = {
    retryAttempts: 3,
    retryPolicy: RetryPolicy.LINEAR,
    hardFailCodes: [400, 422],
    softFailCodes: [500, 503],
    logProvider: new DefaultLogProvider()
};

describe('200 Result' , () => {
    fetch('http://www.mocky.io/v2/5a83f4272f0000754b74bfc4', {}, strategy).then(response =>{
        console.log(response.json());
    });
});

