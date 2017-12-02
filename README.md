# Weather project
Hello! Here is simple weather app ([see demo here](https://weather-ligtit-app.herokuapp.com/)). In shrot, its build with MEAN2.0 (Mongo Express Angular5 Node and weather API from [openweathermap.org](http://openweathermap.org)

## Set up
In order to make projet work in dev-mode, you have to install following software:
* Node.js >= 8v
* Express >= 4v

Also, you need to have acces to MongoDB database >= 3.6v 
All nesessery parameters is easy to set or change in config file: 
```json
{	
	"Server": {
		"port":"4000"
	},
	"MongoDB": {
		"user": "TemplateUser",
		"password": "XXXXXXXXXXXXX",
		"address": "ds137435.mlab.com:37435",
		"db_name": "template_base"
	},
	"Security": {
		"tokenSecret": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
		"appid": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
	},
	"API_settings": {
		"units": "metric"
	},	
	"Tests": {
		"city": "Kiev",
		"wrong_city": "Kievs",
		"wrong_date": "2017-14-30",
		"lat": "40",
		"lon": "130",
		"wrong_lat": "99999",
		"wrong_lon": "99999"
	}		
}

```
## Make it run!
So, all preparations are done, all configs changed, all staff installed it is time to actually run these application.
In order to achieve these goal, follow these steps:
1. Go to these folder: **api-server**
1. Open command prompt in current directory (**api-server**)
1. Type in following command:  **npm install**, and press enter
1. In order to launch a tests type in following command:  **npm install**, and press enter
1. In order to launch test type in following command:  **npm install**, and press enter
1. If all test are passed correctly, type in following command:  **npm start**, and press enter 
1. Go to localhost:4000 ( default )

Short list of commands( back-end ):
* **npm start** - starts application in production mode
* **npm stop** - stops application in production mode
* **npm restart** - restarts application in production mode
* **npm run dev-server** - starts server in development mode
* **npm run test** - starts server tests

Commands for front-end could be found here: [AngularCLI](https://github.com/angular/angular-cli)

**NOTICE:** in dev mode back-end and front-end are separated. Before commit, you need to run command **ng build** inside **front-end** folder in order to build static files directly into: **api-server/public**
