 
export const strategicFetch = function( input: RequestInfo, options?: RequestInit, strategy? : Strategy): Promise<Response>{
    let retries = 1;
    let retryPolicy = RetryPolicy.NO_RETRY;
    let hardRejectCodes: number[] = [];
    let softRejectCodes: number[] = [];
    let logProvider = undefined;
    let delay = 100;

    if( strategy ) {
        retries = strategy.retryAttempts;
        retryPolicy = strategy.retryPolicy;
        hardRejectCodes = strategy.hardFailCodes;
        softRejectCodes = strategy.softFailCodes;
        logProvider = strategy.logProvider;
        delay = _getDelay(strategy.retryPolicy);
    }

    return new Promise( (resolve, reject) => {

        let count = 1;

        const attempt = () => {
            return fetch(input, options)
              .then(response => {
                if ( !response.ok ) {
                    if (softRejectCodes.indexOf(response.status) > -1 && count < retries) {
                        count++;
                        if( count > 1){
                          delay = _getDelay(retryPolicy, count);
                        }
                        delay ? setTimeout(attempt, delay) : attempt()
                      } else if(hardRejectCodes.indexOf(response.status) > -1 ){
                          if(logProvider){
                            logProvider.logFailure(`Response Status: ${response.status}, ${response.statusText}`, { ...response});
                          }
                          reject(new Error('Hit a Hard reject code'));
                      }
                } else {
                    if(logProvider){
                      logProvider.logSuccess(response.status);
                    }
                    resolve(response);
                }
                
              })
              .catch((error) => {
                if (count < retries) {
                  count++
                  delay ? setTimeout(attempt, delay) : attempt()
                } else {
                  if(logProvider){
                    logProvider.logFailure(`Response Status: ${error.message}`, { ...error});
                  }
                  reject(error)
                }
              })
          }
          attempt();
    });
}


/*
  Main Strategy Object which governs the working of the fetch call
  @param retryAttempts 
*/
export interface Strategy {
    retryAttempts: number;
    retryPolicy: RetryPolicy;
    hardFailCodes: number[];
    softFailCodes: number[];
    logProvider?: LogProvider; // Optional provider if not provided no logging will be done.
}

export enum RetryPolicy {
    NO_RETRY, LINEAR, EXPONENTIAL_BACKOFF
}

function _getDelay( retryPolicy :RetryPolicy, retryCount?: number): number{
    if(retryPolicy === RetryPolicy.NO_RETRY) {
        return 0;
    } else if (retryPolicy === RetryPolicy.LINEAR) {
        return 100;
    } else if (retryPolicy === RetryPolicy.EXPONENTIAL_BACKOFF) {
        if(!retryCount){
            return 100;
        }
        return Math.pow(2,retryCount) * 100;
    } else {
        return 0;
    }

}

/*
  LogProvider: To be used for telemetry, implement this and pass it as the part of strategy Object.
  You can implement with your custom implementation such as Aria or other logging service. 
*/
export interface LogProvider {
    logSuccess: (options: object) => void;
    logFailure: (message: string, options: object) => void;
}

/*
  Default Log Provider : Logs are written to console.
*/

export class DefaultLogProvider implements LogProvider {

    logSuccess = (options: object) => {
        console.log(`DefaultLogProvider Network Call Success Details :: ${JSON.stringify(options)} `);
    }

    logFailure = (message: string, options: object): void => {
        console.log(`DefaultLogProvider Network Call Failure : Message :: ${message}, Details :: ${JSON.stringify(options)} `);
    }
}