'use strict';
const ReadLine = require('readline');
const rl = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
const matcher = require('./matcher');
const weather = require('./weather');
const { currentWeather, WeatherForecast } = require('./parser');

rl.setPrompt('> ');
rl.prompt();
rl.on('line', reply => {
    matcher(reply, data => {
        switch (data.intent) {
            case 'Hello':
                console.log(`Hello, I am ninja...`);
                rl.prompt();
                break;
            case 'Exit':
                console.log('Have a great day!');
                process.exit(0);
                break;
            case 'CurrentWeather':
                console.log(`Let me check..`)
                weather(data.entities.city, 'current')
                    .then(response => {
                        let parseResult = currentWeather(response)
                        console.log(parseResult)
                        rl.prompt()
                    })
                    .catch(error => {
                        console.log(`There seems to be a problem connecting toWeather service`)
                        rl.prompt()
                    })
                //console.log(`Checking weather for ${data.entities.city}`);
                break;
            case 'WeatherForecast':
                console.log(`Let me check..WeatherForecast`)
                weather(data.entities.city)
                    .then(response => {
                        let parseResult = WeatherForecast(response, data.entities)
                        console.log(parseResult)
                        rl.prompt()
                    })
                    .catch(error => {
                        console.log(error);
                        
                        console.log(`There seems to be a problem connecting toWeather service`)
                        rl.prompt()
                    })
                //console.log(`Checking weather for ${data.entities.city}`);
                break;
            default: {
                console.log(`I don't what you mean :(`);
                rl.prompt()
            }

        }
    })
})
