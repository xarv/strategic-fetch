export declare const strategicFetch: (input: RequestInfo, options?: RequestInit, strategy?: Strategy) => Promise<Response>;
export interface Strategy {
    retryAttempts: number;
    retryPolicy: RetryPolicy;
    hardFailCodes: number[];
    softFailCodes: number[];
    internalLoggingEnabled?: boolean;
    logProvider?: LogProvider;
}
export declare enum RetryPolicy {
    NO_RETRY = 0,
    LINEAR = 1,
    EXPONENTIAL_BACKOFF = 2,
}
export interface LogProvider {
    logSuccess: (options: object) => void;
    logFailure: (message: string, options: object) => void;
}
export declare class DefaultLogProvider implements LogProvider {
    logSuccess: (options: object) => void;
    logFailure: (message: string, options: object) => void;
}
