import { Button, CircularProgress } from "@material-ui/core";
import React, { FC, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import ErrorComp from "../../../common/components/ErrorComp";
import { fetchIsAlive, selectIsAlive, selectIsAliveError, selectIsAliveLoading } from "../api.redux";
import { useHomeStyles } from "../home-css";
import { useAppSelector } from "../../../core/redux/hooks";

export const ApiPublicBox: FC = memo(() => {
  const classes = useHomeStyles(); // MUI Styles
  const isAlive = useAppSelector(selectIsAlive);
  const isAliveLoading = useAppSelector(selectIsAliveLoading);
  const isAliveError = useAppSelector(selectIsAliveError);
  const dispatch = useDispatch();
  const handleClick = useCallback(() => dispatch(fetchIsAlive()), [dispatch]);

  return (
    <>
      <Button
        variant="outlined"'}
        color="primary"'}
className = { classes.incrButton };
disabled = { isAliveLoading };
onClick = { handleClick }
  >
  Fetch;
API;
public
route;
{
  isAliveLoading && (
    <CircularProgress className={classes.loader} size={20} />
  );
}
</Button>
{
  isAlive != null &&
  (isAlive ? <>API is alive.</> : <>API is not alive.</>);
}
<ErrorComp error={isAliveError} />;
</>
)
;
})
;
