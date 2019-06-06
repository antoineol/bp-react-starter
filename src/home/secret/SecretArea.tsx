import {
  createStyles,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import React, { Fragment, PureComponent, ReactNode } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { AppStore } from '../../common/app.models';
import { Dispatcher, mapDispatchToProps } from '../../common/app.utils';
import { SecretAT, SecretModel, selectShowSecret, ShowAction } from './secret.service';

// An issue with TypeScript prevents CSS properties auto-completion. We can
// hope to have a fix in TypeScript 3.3. Issues to follow up:
// https://github.com/Microsoft/TypeScript/issues/22077
// https://github.com/mui-org/material-ui/issues/11693
// A workaround to have auto-completion is to set CSSProperties type to class values as below.
const styles = ({ palette, spacing }: Theme) => createStyles({
  formControl: {
    margin: spacing(3),
  },
});

// Redux bindings

type Selection = SecretModel;

const mapStateToProps = createStructuredSelector<AppStore, Selection>({
  show: selectShowSecret(),
});

// Props and State definition

export interface Props extends WithStyles<typeof styles>, Selection, Dispatcher {
}

export interface State {
}

export enum SecretStatus {
  Show = 'Show', Hide = 'Hide',
}

// Component

export class SecretAreaComp extends PureComponent<Props, State> {
  handleChange = (e: React.ChangeEvent</*HTMLInputElement*/ any>) => {
    this.props.dispatch(
      { type: SecretAT.Show, show: e.target.value === SecretStatus.Show } as ShowAction);
  };

  render(): ReactNode {
    const { classes, show } = this.props;
    const value = show ? SecretStatus.Show : SecretStatus.Hide;
    return (
      <Fragment>
        <FormControl className={classes.formControl}>
          <FormLabel>Affichage des secrets</FormLabel>
          <RadioGroup
            aria-label="Secret"
            name="secret"
            value={value}
            onChange={this.handleChange}
          >
            <FormControlLabel value={SecretStatus.Show} control={<Radio />}
                              label="Montrer les secrets" />
            <FormControlLabel value={SecretStatus.Hide} control={<Radio />}
                              label="Ne rien montrer" />
          </RadioGroup>
        </FormControl>
        {show && <Typography>Voici le secret tant attendu !</Typography>}
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SecretAreaComp));
