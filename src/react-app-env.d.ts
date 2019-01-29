/// <reference types="react-scripts" />

declare module 'react-snapshot' {
  import { Renderer } from 'react-dom';

  export const render: Renderer;
}
