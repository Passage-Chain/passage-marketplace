
/**
 * A very simple 'canceled' property to the Promise interface and sets its
 * initial value to false.
 */
export class BackoffPromise<T> extends Promise<T> {
    public canceled = false;
}

/**
 * To be polite, our errors are a distinct subclass of Error so they may be
 * checked using `instanceof` in catch blocks.
 */
export class BackoffError extends Error {}

/**
 * Returns the delay times for an exponential backoff that never gets any 
 * slower than 32 seconds
 * @returns The numbers [0, 1, 2, 4, ... 32, 32, 32 ...]
 */
function* series(): Generator<number, number, number> {
    yield 0;
    let n = 1;
    while(true) {
        if(n < 32) {
            yield n;
            n = n * 2;
        } else {
            yield 32;
        }    
    }
}

/**
 * Retries a function with exponential backoff until timeout expires. The retry 
 * intervals are 1, 2, 4, ... 32 seconds, after which the retry interval is 
 * always 32 seconds.
 * @param timeout The duration (in seconds), to wait until no more retries are 
 * made. If you're tempted to "run forever", 3600 seconds (one hour) is
 * probably a better choice.
 * @param fn The function to retry, which is expected to be async and to throw
 * an error when it fails.
 * @returns a BackoffPromise which can be canceled so it stops 
 */
export const backoff = <T>(
    timeout: number,
    fn: () => Promise<T>): BackoffPromise<T> =>
{
    const delays = series();
    const promise = new BackoffPromise<T>((resolve, reject) => {
        let timedout = false;
        const handle = setTimeout(
            () => {
                timedout = true;
                reject(new BackoffError('backoff() timed out'))
            },
            timeout * 1000);
        
        const retry = async () => {
            try {
                if(promise.canceled) {
                    clearTimeout(handle);
                    reject(new BackoffError('backoff() canceled'));
                    return;
                }
                if(timedout) return;

                const result = await fn();
                clearTimeout(handle);
                resolve(result);
            } catch(error) {
                // logging this error just generates log spam for a function we 
                // *expect* to fail, which is why we're retrying in the first 
                // place.
                setTimeout(retry, delays.next().value * 1000);
            }
        };
        
        retry();
    });
    return promise;
}