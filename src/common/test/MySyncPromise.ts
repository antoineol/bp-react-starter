enum States {
  pending = 'Pending',
  resolved = 'Resolved',
  rejected = 'Rejected'
}

/** @experimental */
export class MySyncPromise<T> {

  // @ts-ignore
  then: <U>(callback: (value: T) => U) => void;
  // @ts-ignore
  catch: <U>(callback: (reason: any) => U) => void;
  private value?: T;
  private state?: States;

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
    const tryCall = (callback: (value?: T) => T) => MySyncPromise.try(() => callback(this.value));
    const laterCalls: (() => void)[] = [];
    const callLater = (getMember: <U>() => (((value: T) => U) | ((reason: any) => U))) => (callback: (value?: T) => T) => new MySyncPromise(
      resolve => laterCalls.push(() => resolve(getMember()(callback as any))));
    const members = {
      [States.resolved]: {
        state: States.resolved,
        then: tryCall,
        catch: (_: any) => this,
      },
      [States.rejected]: {
        state: States.rejected,
        then: (_: any) => this,
        catch: tryCall,
      },
      [States.pending]: {
        state: States.pending,
        then: callLater(() => this.then as any),
        catch: callLater(() => this.catch as any),
      },
    };
    const changeState = (state: States) => Object.assign(this, members[state]);
    const apply = (value: T, state: States) => {
      if (this.state === States.pending) {
        this.value = value;
        changeState(state);
        for (const laterCall of laterCalls) {
          laterCall();
        }
      }
    };

    const getCallback = (state: States) => (value: T | MySyncPromise<T>) => {
      if (value instanceof MySyncPromise && state === States.resolved) {
        value.then(((value: T) => apply(value, States.resolved)) as any);
        value.catch((value: T) => apply(value, States.rejected));
      } else {
        apply(value as T, state);
      }
    };

    const resolve = getCallback(States.resolved);
    const reject = getCallback(States.rejected);
    changeState(States.pending);
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  static resolve<T>(value: T): MySyncPromise<T> {
    return new MySyncPromise<T>(resolve => resolve(value));
  }

  static reject(reason: any) {
    return new MySyncPromise((_, reject) => reject(reason));
  }

  static try<T>(callback: (value?: T) => T) {
    return new MySyncPromise(resolve => resolve(callback()));
  }
}
