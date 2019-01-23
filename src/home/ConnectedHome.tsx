import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { AppStore } from '../common/app.models';
import Home from './Home';
import { CounterModel, increment, selectCount, selectIncrementLoading } from './home.service';

type Selection = CounterModel;

interface Props {
}

class ConnectedHome extends Component<Props & Selection & typeof mapDispatchToProps> {
  render(): ReactNode {
    return <Home {...this.props} />;
  }
}

const mapStateToProps = createStructuredSelector<AppStore, Selection>(
  {
    count: selectCount(),
    loading: selectIncrementLoading(),
  });
const mapDispatchToProps = {
  increment,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedHome);
