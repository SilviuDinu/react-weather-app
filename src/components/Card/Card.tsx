import { Forecast } from '@models/forecast';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CurrentForecastInfo from '../CurrentForecastInfo/CurrentForecastInfo';
import HourlyForecastInfo from '../HourlyForecastInfo/HourlyForecastInfo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: 'none',
      border: 'none',
      boxShadow: 'none',
      width: '100%',
      margin: '0',
    },
  })
);

export default function Card(props: any) {
  const { currentInfo, hourlyInfo } = (props.data as Forecast) || {};
  const classes = useStyles();
  console.log(props.data)
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
          classes={{ content: 'summary', expanded: 'expanded', expandIcon: 'expanded' }}>
          <CurrentForecastInfo data={currentInfo} title={props.title} />
        </AccordionSummary>
        <AccordionDetails classes={{ root: 'expanded' }}>
          <HourlyForecastInfo data={hourlyInfo} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
