import React, { FunctionComponent } from "react";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Box from "@material-ui/core/Box";
import { IconButton, makeStyles, Typography } from "@material-ui/core";
import { format } from "date-fns";

interface DateTogglerProp {
  startOfWeek: Date;
  endOfWeek: Date;
  handleDateToggler: (action: "forward" | "backward") => void;
  isPublished: boolean;
}

const useStyles = makeStyles((theme) => ({
  textPublished: {
    color: theme.color?.turqouise
  },
  text: {
    color: "inherit"
  },
  button: {
    height: "40px",
    "min-width": "40px !important",
    padding: "2px",
    border: "1px solid grey",
    borderRadius: "5px"
  },
}));


const DateToggler: FunctionComponent<DateTogglerProp> = ({ startOfWeek, endOfWeek, handleDateToggler, isPublished }) => {
  const classes = useStyles();
  return (
    <Box data-testid='date-toggler' display="flex" alignItems="center" flexWrap="wrap">
      <IconButton
        className={classes.button}
        onClick={() => handleDateToggler("backward")}
      >
        <ArrowBackIosIcon style={{ marginLeft: "8px" }} />
      </IconButton>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Typography
        component="h1"
        variant="h6"
        className={isPublished ? classes.textPublished : classes.text}
        noWrap
      >
        {`${format(startOfWeek, "MMM dd")} -  ${format(endOfWeek, "MMM dd")}`}
      </Typography>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <IconButton
        className={classes.button}
        onClick={() => handleDateToggler("forward")}
      >
        <ArrowForwardIosIcon style={{ margin: "0px !important" }} />
      </IconButton>
    </Box>
  );
};

export default DateToggler;
