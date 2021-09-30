const openWeatherApi = {
  getHourlyForecast: async (key) => {
    const forecast = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=51.4588672&lon=-0.98304&units=metric&exclude=current,minutely,daily&appid=${key}`);
    return forecast.json();
  },
};

export default openWeatherApi;