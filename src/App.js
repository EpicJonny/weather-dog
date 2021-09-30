import * as React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import openWeatherApi from './services/openWeatherAPI';
import DatePicker from './components/DatePicker';
import Accordian from './components/Accordian';

import { Slider, AppBar, Toolbar, TextField } from '@mui/material';
require('dotenv').config();

class App extends React.Component {

  state = {
    forecast: null,
    marks: [],
    recommendedWalks: [],
    otherWalks: [],
    avoidWalks: []
  };

  async componentDidMount() {
    this.populateMarks();
    const forecast = await openWeatherApi.getHourlyForecast(process.env.REACT_APP_OPEN_WEATHER_API_KEY);
    this.sortForecast(forecast);

    this.setState({ forecast });
  }

  sortForecast = (forecast) => {
    const forecasts = forecast.slice(0);
    let recommendedWalks;
    let otherWalks;
    let avoidWalks;

    avoidWalksforecast.filter(hourlyForecast => hourlyForecast.rain);

    // Check how many walks needed
    // Check if sunny/cloudy
    // Check hours

    // Loop through forecasts
    // Remove hours outside of range
    // Check how many rain, snow and too hot
    // If walks left > walks needed move to avoid

    // Check hottest walks and lowest chance of precipitation
    // Move to recommended walks

    // Others move to otherWalks
  };

  populateMarks = () => {
    const marks = [];
    for (let index = 0; index < 24; index++) {
      marks.push({
        value: ('0' + index).slice(-2),
        label: ('0' + index).slice(-2),
      });
    }

    this.setState({ marks });
  }

  convertDate = (dt) => {
    const options = { hour: 'numeric', minute: 'numeric' };
    const currentHour = new Date(dt * 1000).toLocaleDateString("en-UK", options);

    return currentHour;
  }

  listRows = (forecast) => {
    console.log(forecast);
    if (forecast && forecast.hourly) {
      let rows = [];
      forecast.hourly.map((object, i) => {
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
                    feels_like: {object.feels_like}&#8451;
                  </Typography>
                  <Typography>
                    humidity: {object.humidity}%
                  </Typography>
                  <Typography>
                    wind_speed: {object.wind_speed} metre/sec
                  </Typography>
                  <Typography>
                    Precipitation: {object.pop * 100}%
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
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Weather Dog
          </Typography>
          </Toolbar>
        </AppBar>

        <Box p={4}>
          <DatePicker></DatePicker>

          <TextField
            id="outlined-number"
            label="How many walks"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Box p={4}>
            <Slider sx={{ width: '100%', maxWidth: 560, bgcolor: 'background.paper' }}
              defaultValue={[9, 17]}
              step={1}
              min={0}
              max={23}
              valueLabelDisplay="auto"
            // marks={this.state.marks}
            />
          </Box>

          <Box>
            <Accordian></Accordian>
          </Box>

          <List sx={{ width: '100%', maxWidth: 560, bgcolor: 'background.paper' }}>
            {this.state.forecast && this.listRows(this.state.forecast)}
          </List>
        </Box>
      </Box>
    );
  }
}

export default App;
