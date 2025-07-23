export type ThrottleOptions = {
  wait_ms?: number;
  leading?: boolean;
};

export type IFunc<I extends any[], O> = (...args: I) => Promise<O>;

type ThrottledExecution<I extends any[], O> = {
  args: I;
  resolve: (results: O) => void;
  reject: (error: Error) => void;
};

/**
 * Given an execution function, return a throttled execution function which executes a maximum of
 * once every `wait_ms`.
 *
 * This is conceptually the same as _.throttle except this handles promises correctly
 */
export const throttle = <I extends any[], O>(func: IFunc<I, O>, options?: ThrottleOptions): IFunc<I, O> => {
  let pending_executions: ThrottledExecution<I, O>[] = [];

  let leading = false;
  let i: NodeJS.Timeout | undefined;

  const execute = async () => {
    i = undefined;
    const executions = pending_executions;
    pending_executions = [];

    const latest = executions[executions.length - 1];
    try {
      let res = await func(...latest.args);

      for (const execution of executions) {
        execution.resolve(res);
      }
    } catch (err) {
      for (const execution of executions) {
        execution.reject(err);
      }
    }
  };

  return (...args: I) => {
    return new Promise((resolve, reject) => {
      pending_executions.push({
        args: args,
        resolve: resolve,
        reject: reject
      });

      if (options?.leading && !leading) {
        leading = true;
        execute();
      }

      if (i == null) {
        i = setTimeout(execute, options?.wait_ms || 100);
      }
    });
  };
};
