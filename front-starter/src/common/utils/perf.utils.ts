import { useRef } from 'react';
import { appConfig } from '../app.config';

/**
 * Use it instead of logRenderForPerfInvestigation if the component is an arrow function directly
 * inside a memo or another function that prevents the stacktrace from finding the function name.
 */
export function logRenderForPerfInvestigationAnonymous(componentName: string) {
  if (appConfig.enablePerfDebug) {
    console.log('Render', componentName, 'component');
  }
}

/**
 * Logs components that were rendered.
 */
export function logRenderForPerfInvestigation() {
  if (appConfig.enablePerfDebug) {
    const stack = new Error().stack as string;
    const firstAtPosition = stack.indexOf(' at ');
    const startOfCallerNamePosition = stack.indexOf(' at ', firstAtPosition + 1) + 4;
    const endOfFunctionNamePosition = stack.indexOf(' ', startOfCallerNamePosition + 1);
    const callerName = stack.substring(startOfCallerNamePosition, endOfFunctionNamePosition);
    logRenderForPerfInvestigationAnonymous(callerName);
  }
}

export function useExplainRender(props: any) {
  const prevPropsRef = useRef<any>({});
  // if (appConfig.enablePerfDebug) {
  const prevProps = prevPropsRef.current;
  const changedProps = [];
  for (const [k, v] of Object.entries(props)) {
    if (v !== prevProps[k]) {
      changedProps.push([k, prevProps[k], v]);
    }
  }
  for (const [k, prev, next] of changedProps) {
    console.log('Prop', k, 'changed from', prev, 'to', next);
  }
  prevPropsRef.current = props;
  // }
}
