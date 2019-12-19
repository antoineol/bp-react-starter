// import './common/test/global-mocks'; // global mocks should be first import
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// This file is automatically loaded by CRA to initialize jest tests
configure({ adapter: new Adapter() });
