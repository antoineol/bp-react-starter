import {
  createStyles,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { Fragment, memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../common/app.utils';
import { SecretAT, selectShowSecret } from './secret.service';

// An issue with TypeScript prevents CSS properties auto-completion. We can
// hope to have a fix in TypeScript 3.3. Issues to follow up:
// https://github.com/Microsoft/TypeScript/issues/22077
// https://github.com/mui-org/material-ui/issues/11693
// A workaround to have auto-completion is to set CSSProperties type to class values as below.
const useStyles = makeStyles((theme: Theme) => createStyles({
  formControl: {
    margin: theme.spacing(3),
  },
}));

// Redux bindings

export enum SecretStatus {
  Show = 'Show', Hide = 'Hide',
}

// Component

function SecretAreaComp() {
  const classes = useStyles(); // MUI Styles
  const show = useSelector(selectShowSecret); // Redux Selector
  const dispatch = useAppDispatch(); // Redux dispatcher
  // Callback optimized to keep the same reference to avoid re-rendering child components
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(SecretAT.Show, e.target.value === SecretStatus.Show);
  }, [dispatch]);
  const value = show ? SecretStatus.Show : SecretStatus.Hide;

  return <Fragment>
    <FormControl className={classes.formControl}>
      <FormLabel>Affichage des secrets</FormLabel>
      <RadioGroup
        aria-label="Secret"
        name="secret"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value={SecretStatus.Show} control={<Radio />}
                          label="Montrer les secrets" />
        <FormControlLabel value={SecretStatus.Hide} control={<Radio />}
                          label="Ne rien montrer" />
      </RadioGroup>
    </FormControl>
    {show && <Typography>Voici le secret tant attendu !</Typography>}
  </Fragment>;
}

export default memo(SecretAreaComp);
