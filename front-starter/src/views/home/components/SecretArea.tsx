import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import React, { FC, memo, useCallback, useState } from 'react';

export const SecretArea: FC = memo(() => {
  const [show, setShow] = useState(false);
  const handleChange = useCallback(() => setShow(show => !show), []);

  return (
    <>
      <FormControl sx={{ margin: 3 }}>
        <FormLabel>Affichage des secrets</FormLabel>
        <RadioGroup
          aria-label='Secret'
          name='secret'
          value={show}
          onChange={handleChange}
        >
          <FormControlLabel
            value={true}
            control={<Radio />}
            label='Montrer les secrets'
          />
          <FormControlLabel
            value={false}
            control={<Radio />}
            label='Ne rien montrer'
          />
        </RadioGroup>
      </FormControl>
      {show && <Typography>Voici le secret tant attendu !</Typography>}
    </>
  );
});
