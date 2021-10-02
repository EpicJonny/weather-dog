import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

export default class SimpleAccordion extends React.Component {
  convertDate = (dt) => {
    const options = { hour: 'numeric', minute: 'numeric' };
    const currentHour = new Date(dt * 1000).toLocaleDateString("en-UK", options);

    return currentHour;
  }

  displayPop = (obj) => {
    if (obj.rain) {
      return `Rainfall ${obj.rain['1h']}mm`;
    } else {
      return `Precipitation: ${Math.round(obj.pop * 100)}%`
    }
  }
  listRows = (forecast) => {
    if (forecast) {
      let rows = [];
      forecast.map((object, i) => {
        rows.push(<Box key={i}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src={`https://openweathermap.org/img/wn/${object.weather[0].icon}@2x.png`} />
            </ListItemAvatar>
            <ListItemText
              primary={this.convertDate(object.dt)}
              secondary={
                <React.Fragment>
                  <Typography>
                    Temperature: {object.temp}&#8451;
                  </Typography>
                  <Typography>
                    Temp feels like: {object.feels_like}&#8451;
                  </Typography>
                  <Typography>
                    {this.displayPop(object)}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </Box>);
      });
      return rows;
    }
  }

  render() {
    return (
      <Box>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Recommended timings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List sx={{ width: '100%', maxWidth: 560, bgcolor: 'background.paper' }}>
              {this.props.recommendedWalks && this.listRows(this.props.recommendedWalks)}
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Other timings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List sx={{ width: '100%', maxWidth: 560, bgcolor: 'background.paper' }}>
              {this.props.otherWalks && this.listRows(this.props.otherWalks)}
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography>Avoid timings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List sx={{ width: '100%', maxWidth: 560, bgcolor: 'background.paper' }}>
              {this.props.avoidWalks && this.listRows(this.props.avoidWalks)}
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>)
  };
}
