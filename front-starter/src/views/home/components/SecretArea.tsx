import {
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { memo, useCallback, useState } from 'react';

// An issue with TypeScript prevents CSS properties auto-completion. We can
// hope to have a fix in TypeScript 3.3. Issues to follow up:
// https://github.com/Microsoft/TypeScript/issues/22077
// https://github.com/mui-org/material-ui/issues/11693
// A workaround to have auto-completion is to set CSSProperties type to class values as below.
const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
}));

// Component

function SecretAreaComp() {
  const classes = useStyles(); // MUI Styles
  const [show, setShow] = useState(false);
  const handleChange = useCallback(() => setShow(show => !show), []);

  return <>
    <FormControl className={classes.formControl}>
      <FormLabel>Affichage des secrets</FormLabel>
      <RadioGroup
        aria-label="Secret"
        name="secret"
        value={show}
        onChange={handleChange}
      >
        <FormControlLabel value={true} control={<Radio />}
                          label="Montrer les secrets" />
        <FormControlLabel value={false} control={<Radio />}
                          label="Ne rien montrer" />
      </RadioGroup>
    </FormControl>
    {show && <Typography>Voici le secret tant attendu !</Typography>}
  </>;
}

export default memo(SecretAreaComp);
