export const foo = true;
// import { AxiosRequestConfig } from 'axios';
// import { defaultOptions } from '../../common/utils/http.utils';
// import {
//   changeInput,
//   clickElt,
//   mockApiGet,
//   renderTestAppSignedIn,
//   submitInput,
// } from '../../test/test.utils';
// import { TodoItem } from './count.service';
//
// it('should display the home page by default and with / URL', async () => {
//   const { getByText, queryByText, getByLabelText } = await renderTestAppSignedIn();
//   // `/` URL renders the home page
//   // store.dispatch(push('/'));
//   // Alternatively: click a link to navigate:
//   // leftClick(getByText(/go to page/i));
//
//   // The home page is rendered by default
//   expect(getByText(/save to reload/i)).toBeInTheDocument();
//   // The button is initialized with count 1
//   expect(getByText(/Fetch/)).toHaveTextContent('Fetch n°1');
//   // The secret is hidden by default
//   expect(queryByText('Voici le secret tant attendu !')).not.toBeInTheDocument();
//   // Clicking the radio button shows the secret. Set 'secret' radio to 'Show'.
//   clickElt(getByLabelText('Montrer les secrets'));
//   expect(queryByText('Voici le secret tant attendu !')).toBeInTheDocument();
// });
//
// describe('Webservice interactions', () => {
//
//   it('should increment the count by 1 when clicking its button', async () => {
//     const apiMock = mockWebservice(); // Mock HTTP requests
//     const expectedRequestParams = { id: 1 };
//     const { getByText, findByText } = await renderTestAppSignedIn();
//     const btn = getByText('Fetch n°1');
//     clickElt(btn);
//     await findByText('Fetch n°2'); // Wait for the button label to update to this value
//     expect(apiMock).toHaveBeenCalledTimes(1);
//     expect(apiMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos',
//       { ...defaultOptions, params: expectedRequestParams } as AxiosRequestConfig);
//     expect(btn).toHaveTextContent('Fetch n°2');
//   });
//
//   it('should double the count when submitting the form (enter)', async () => {
//     const apiMock = mockWebservice(); // Mock HTTP requests
//     const { getByText, getByLabelText } = await renderTestAppSignedIn();
//     const btn = getByText(/Fetch/);
//     const input = getByLabelText('Count');
//     changeInput(input, '12');
//     expect(btn).toHaveTextContent('Fetch n°12');
//     submitInput(input);
//     expect(apiMock).toHaveBeenCalledTimes(0);
//     expect(btn).toHaveTextContent('Fetch n°24');
//   });
// });
//
// function mockWebservice() {
//   return mockApiGet('https://jsonplaceholder.typicode.com/todos',
//     [{ 'id': 1, 'title': 'delectus aut autem' } as TodoItem]);
// }
