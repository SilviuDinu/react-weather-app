import { Forecast } from '@models/forecast';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CardSummaryInfo from './CardSummaryInfo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:before': {
        display: 'none',
      },
      background: 'none',
      border: 'none',
      boxShadow: 'none',
      width: '100%',
      margin: '0',
    },
    summary: {
      display: 'flex',
      padding: '0',
      margin: '0',
      width: '100%',
      justifyContent: 'space-between',
      '&$expanded': {
        margin: 0,
      },
    },
    expanded: {
      margin: '0',
    },
    '.MuiIconButton-edgeEnd': {
      margin: '0',
    },
  })
);

export default function Card(props: any) {
  const { currentInfo } = (props.data as Forecast) || {};
  const classes = useStyles();

  const parseWrapperClass = (description: string): string => {
    if (!description) {
      return '';
    }
    return description.split(' ').join('-');
  };
  return (
    <div className={`weather-card-wrapper ${parseWrapperClass(currentInfo?.weather?.description)}`}>
      <Accordion TransitionProps={{ unmountOnExit: true }} classes={{ root: classes.root }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`weather-card-accordion-summary weather-card-accordion-${props.id}`}
          id={`weather-card-accordion-${props.id}`}
          className={`weather-card-accordion-summary weather-card-accordion-${props.id}`}
          classes={{ content: classes.summary, expanded: classes.expanded, expandIcon: classes.expanded }}>
          <CardSummaryInfo data={currentInfo} title={props.title} />
        </AccordionSummary>
        <AccordionDetails>LOREM IPSUM CONTENTLOREM IPSUM CONTENTLOREM IPSUM CONTENTLOREM IPSUM CONTENT</AccordionDetails>
      </Accordion>
    </div>
  );
}
