import { Theme } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { FC, memo } from 'react';

interface Option {
  label: string;
  value: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
  radioButtons: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    '& > *': {
      margin: theme.spacing(0.5),
      display: 'flex',
      flexDirection: 'row',
    },
  },
}));

interface Props {
  name: string;
  value: any;
  label: string;
  onChange: any;
  options: Option[];
}

const RadioFormControl: FC<Props> = ({ options, label, ...others }) => {
  const classes = useStyles();

  return <FormControl className={classes.formControl}>
    <div className={classes.radioButtons}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup {...others}>
        {options.map(option =>
          <FormControlLabel
            key={option.value}
            name={others.name}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />,
        )}
      </RadioGroup>
    </div>
  </FormControl>;
};

export default memo(RadioFormControl);
