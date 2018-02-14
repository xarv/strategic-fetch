"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strategicFetch = function (input, options, strategy) {
    let retries = 1;
    let retryPolicy = RetryPolicy.NO_RETRY;
    let hardRejectCodes = [];
    let softRejectCodes = [];
    let logProvider = undefined;
    let delay = 100;
    if (strategy) {
        retries = strategy.retryAttempts;
        retryPolicy = strategy.retryPolicy;
        hardRejectCodes = strategy.hardFailCodes;
        softRejectCodes = strategy.softFailCodes;
        logProvider = strategy.logProvider;
        delay = _getDelay(strategy.retryPolicy);
    }
    return new Promise((resolve, reject) => {
        let count = 1;
        const attempt = () => {
            return fetch(input, options)
                .then(response => {
                if (!response.ok) {
                    if (softRejectCodes.indexOf(response.status) > -1 && count < retries) {
                        count++;
                        if (count > 1) {
                            delay = _getDelay(retryPolicy, count);
                        }
                        delay ? setTimeout(attempt, delay) : attempt();
                    }
                    else if (hardRejectCodes.indexOf(response.status) > -1) {
                        if (logProvider) {
                            logProvider.logFailure(`Response Status: ${response.status}, ${response.statusText}`, Object.assign({}, response));
                        }
                        reject(new Error('Hit a Hard reject code'));
                    }
                }
                else {
                    if (logProvider) {
                        logProvider.logSuccess(response.status);
                    }
                    resolve(response);
                }
            })
                .catch((error) => {
                if (count < retries) {
                    count++;
                    delay ? setTimeout(attempt, delay) : attempt();
                }
                else {
                    if (logProvider) {
                        logProvider.logFailure(`Response Status: ${error.message}`, Object.assign({}, error));
                    }
                    reject(error);
                }
            });
        };
        attempt();
    });
};
var RetryPolicy;
(function (RetryPolicy) {
    RetryPolicy[RetryPolicy["NO_RETRY"] = 0] = "NO_RETRY";
    RetryPolicy[RetryPolicy["LINEAR"] = 1] = "LINEAR";
    RetryPolicy[RetryPolicy["EXPONENTIAL_BACKOFF"] = 2] = "EXPONENTIAL_BACKOFF";
})(RetryPolicy = exports.RetryPolicy || (exports.RetryPolicy = {}));
function _getDelay(retryPolicy, retryCount) {
    if (retryPolicy === RetryPolicy.NO_RETRY) {
        return 0;
    }
    else if (retryPolicy === RetryPolicy.LINEAR) {
        return 100;
    }
    else if (retryPolicy === RetryPolicy.EXPONENTIAL_BACKOFF) {
        if (!retryCount) {
            return 100;
        }
        return Math.pow(2, retryCount) * 100;
    }
    else {
        return 0;
    }
}
/*
  Default Log Provider : Logs are written to console.
*/
class DefaultLogProvider {
    constructor() {
        this.logSuccess = (options) => {
            console.log(`DefaultLogProvider Network Call Success Details :: ${JSON.stringify(options)} `);
        };
        this.logFailure = (message, options) => {
            console.log(`DefaultLogProvider Network Call Failure : Message :: ${message}, Details :: ${JSON.stringify(options)} `);
        };
    }
}
exports.DefaultLogProvider = DefaultLogProvider;
