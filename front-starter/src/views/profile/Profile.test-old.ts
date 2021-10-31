export const foo = true;
// import { within } from '@testing-library/react';
// import { wait } from '../../common/utils/app.utils';
// import { clickElt, renderTestAppSignedIn } from '../../test/test.utils';
//
// it('should display the profile page when clicking Profile button', async () => {
//   const { getByTestId, getByLabelText, getByText } = await renderTestAppSignedIn('/profile');
//
//   // Alternative to render /profile: click "Profile" button to navigate to this page.
//   // clickElt(getByText(/Profile/i));
//
//   // Example querying in the header only (we may have another "Profile" label somewhere else)
//   const { getByText: getInHeader } = within(getByTestId('header'));
//   expect(getInHeader(/Profile/i)).toBeInTheDocument();
//
//   // Check that the form text field with label "Name" contains the default value "John"
//   // (from model in profile service)
//   expect(getByLabelText(/Name/i)).toHaveValue('John');
//   // Check that the list of authors has "Jane" listed by default (from graphql subscription mock)
//   expect(getByText(/Jane/i)).toBeInTheDocument();
//   clickElt(getByText(/Add author/i));
//   await wait();
//   // TODO to fix. Check src/test/formik-submit-sample.test-old.tsx that should work first.
//   // expect(addAuthorMock.result).toHaveBeenCalled();
// });
