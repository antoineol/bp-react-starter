import { createContext, FC, useContext, useEffect, useRef, useState } from 'react';
import { Control, FieldError, FieldValues } from 'react-hook-form';

interface Props<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
}

const WatchErrorsContext = createContext<Control | null>(null);

WatchErrorsContext.displayName = 'RHFControlContext';

const useWatchErrorsContext = <TFieldValues extends FieldValues>(): Control<TFieldValues> =>
  (useContext(WatchErrorsContext) as unknown) as Control<TFieldValues>;

export const WatchErrorsProvider: FC<Props> = props => (
  <WatchErrorsContext.Provider value={props.control as Control}>
    {props.children}
  </WatchErrorsContext.Provider>
);

export function useWatchErrors(name: string) {
  const [error, setError] = useState<FieldError>();
  const errRef = useRef<FieldError>();
  const subRef = useRef<{ unsubscribe: () => void }>();
  const control = useWatchErrorsContext();
  useEffect(() => {
    const sub = control.formStateSubjectRef.current.subscribe({
      next: ({ errors }) => {
        if (errors) {
          const err: FieldError = errors?.[name];
          if (err !== errRef.current) {
            errRef.current = err;
            setError(err);
          }
        }
      },
    });
    subRef.current?.unsubscribe();
    subRef.current = sub;
    return () => sub.unsubscribe();
  }, [control.formStateSubjectRef, name]);
  return error;
}
