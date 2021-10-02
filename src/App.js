import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import openWeatherApi from './services/openWeatherAPI';
import DatePicker from './components/DatePicker';
import SimpleAccordion from './components/Accordian';
import logo from './Weather Dog-logos.jpeg';

import { Slider, AppBar, Toolbar, TextField, Paper, Button } from '@mui/material';
require('dotenv').config();

class App extends React.Component {

  state = {
    forecast: null,
    walks: 2,
    marks: [],
    recommendedWalks: [],
    otherWalks: [],
    avoidWalks: []
  };

  async componentDidMount() {
    this.populateMarks();
    this.refresh();
  }

  refresh = async () => {
    const forecast = await openWeatherApi.getHourlyForecast(process.env.REACT_APP_OPEN_WEATHER_API_KEY);
    this.setState({ forecast });

    forecast.hourly.sort(this.sortForecast);

    const today = new Date().toLocaleDateString();
    const todayEpoch = new Date(today).getTime() / 1000;

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowEpoch = new Date(tomorrow.toLocaleDateString()).getTime() / 1000;

    const forecastHourly = forecast.hourly.filter((hourForecast) => hourForecast.dt >= todayEpoch && hourForecast.dt < tomorrowEpoch);

    const recommendedWalks = [];
    const otherWalks = [];
    const avoidWalks = [];
    forecastHourly.forEach((hourlyForecast, i) => {

      if (i < this.state.walks) {
        recommendedWalks.push(hourlyForecast);
      } else {
        if (hourlyForecast.rain || hourlyForecast.snow) {
          avoidWalks.push(hourlyForecast);
        } else {
          otherWalks.push(hourlyForecast);
        }
      }
    });

    this.setState({ recommendedWalks, otherWalks, avoidWalks });
  }

  sortForecast = (a, b) => {

    // Snow
    if (a.snow && !b.snow) {
      return 1;
    } else if (b.snow && !a.snow) {
      return -1;
    } else if (a.snow && b.snow) {
      if (a.snow['1h'] === b.snow['1h']) {
        return b.feels_like - a.feels_like;
      }
      return a.snow['1h'] - b.snow['1h'];
    }

    // Rain
    if (a.rain && !b.rain) {
      return 1;
    } else if (b.rain && !a.rain) {
      return -1;
    } else if (a.rain && b.rain) {
      if (a.rain['1h'] === b.rain['1h']) {
        return b.feels_like - a.feels_like;
      }
      return a.rain['1h'] - b.rain['1h'];
    }

    // Precipitation
    if (a.pop > 0.5 || b.pop > 0.5) {
      return (a.pop - b.pop);
    }

    // Temp
    return b.feels_like - a.feels_like;
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

  async handleChange(e) {
    this.setState({ walks: e.target.value });
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
          {/* <DatePicker></DatePicker> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>forecast</Typography>
          {JSON.stringify(this.state.forecast)}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>recommendedWalks</Typography>
          {JSON.stringify(this.state.recommendedWalks)}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>otherWalks</Typography>
          {JSON.stringify(this.state.otherWalks)}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>avoidWalks</Typography>
          {JSON.stringify(this.state.avoidWalks)}

          <TextField
            id="outlined-number"
            label="How many walks"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => { this.handleChange(e) }}
            defaultValue={this.state.walks}
            className="clickable"
          />

          <Button variant="contained" className="clickable" onClick={this.refresh}>Search</Button>

          <Box p={4}>
            {/* <Slider sx={{ width: '100%', maxWidth: 560, bgcolor: 'background.paper' }}
              defaultValue={[9, 17]}
              step={1}
              min={0}
              max={23}
              valueLabelDisplay="auto"
            // marks={this.state.marks}
            /> */}
          </Box>

          <Box>
            <SimpleAccordion
              recommendedWalks={this.state.recommendedWalks}
              otherWalks={this.state.otherWalks}
              avoidWalks={this.state.avoidWalks}></SimpleAccordion>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default App;
