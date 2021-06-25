import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import { MESSAGES, MISC } from "@enums/misc.enum";

const useStyles = makeStyles({
  root: {
    width: "100%",
    backgroundColor: "#18191a",
  },
});

export default function Footer() {
  const classes = useStyles();
  const [value] = React.useState(0);

  return (
    <footer className="footer">
      <BottomNavigation value={value} className={classes.root}>
        <div className="madeWithLove">
          <span className="credits-message">
            {MESSAGES.MADE_WITH_LOVE}
            <a href={`${MISC.GITHUB_PROFILE}`}>{MISC.ME}</a>
          </span>
        </div>
      </BottomNavigation>
    </footer>
  );
}
