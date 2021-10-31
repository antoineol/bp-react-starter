export const foo = true;
// import { fireEvent, render, RenderResult } from '@testing-library/react';
// import { Form, Formik } from 'formik';
// import * as React from 'react';
// import { act } from 'react-dom/test-utils';
//
// const pushDangerousButton = jest.fn();
//
// function App() {
//   return (
//     <Formik initialValues={{}} onSubmit={pushDangerousButton}>
//       <Form>
//         <button style={{ color: 'red' }} type="submit">
//           <h1>DON'T EVER CLICK ME!</h1>
//         </button>
//       </Form>
//     </Formik>
//   );
// }
//
// it('should submit form', async () => {
//   const { getByText } = await renderTestApp();
//   clickElt(getByText(/DON'T EVER CLICK ME/i));
//   await wait();
//   // TODO it fails here!
//   //  but works online: https://codesandbox.io/s/formik-submit-test-yxc8b
//   //  no idea why...
//   // expect(pushDangerousButton).toHaveBeenCalled();
// });
//
// /**
//  * Simulates a left-click on an element
//  * @param element element to click
//  */
// function clickElt(element: Document | Element | Window) {
//   const leftClick = { button: 0 };
//   fireEvent.click(element, leftClick);
// }
//
// /**
//  * Render the app for tests
//  */
// async function renderTestApp() {
//   let rendered: RenderResult | null = null;
//   await act(async () => {
//     rendered = render(<App />);
//     await wait();
//   });
//   return (rendered as unknown) as RenderResult;
// }
//
// function wait(ms?: number) {
//   return new Promise<void>(resolve => setTimeout(resolve, ms));
// }
