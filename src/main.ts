interface WeatherApiResponse {
	coord: {
		lon: number;
		lat: number;
	};
	weather: Array<{
		id: number;
		main: string;
		description: string;
		icon: string;
	}>;
	base: string;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
		sea_level?: number; // Optional, as it may not be present in all responses
		grnd_level?: number; // Optional, as it may not be present in all responses
	};
	visibility: number;
	wind: {
		speed: number;
		deg: number;
		gust?: number; // Optional, as it may not be present in all responses
	};
	rain?: {
		"1h"?: number; // Optional, as rain data may not always be present
		"3h"?: number; // Optional, for longer rain duration (e.g., 3 hours)
	};
	snow?: {
		"1h"?: number; // Optional, as snow data may not always be present
		"3h"?: number; // Optional, for longer snow duration (e.g., 3 hours)
	};
	clouds: {
		all: number;
	};
	dt: number; // Timestamp of data calculation (UNIX format)
	sys: {
		type?: number; // Optional, as it may not always be present
		id?: number; // Optional, as it may not always be present
		country: string;
		sunrise: number; // Timestamp of sunrise
		sunset: number; // Timestamp of sunset
	};
	timezone: number; // Shift in seconds from UTC
	id: number; // City ID
	name: string; // City name
	cod: number; // Internal API status code
}

class Weathering {
	private api_key: ImportMetaEnv;
	private display: HTMLDivElement;
	private lon: number;
	private lat: number;

	constructor() {
		this.api_key = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
		this.display = document.querySelector("#weather-display") as HTMLDivElement;
		this.lat = 0;
		this.lon = 0;

		this.init();
	}

	init() {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				this.lon = pos.coords.longitude;
				this.lat = pos.coords.latitude;

				this.getWeather();
			},
			(err) => {
				this.display.innerHTML = `
        <p>Failed to get location: ${err.message}</p>
      `;
			},
		);
	}

	async getWeather() {
		try {
			const fetched = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=${this.api_key}`,
			);

			const data: WeatherApiResponse = await fetched.json();

			this.display.outerHTML = `
        <div class="bg-white border-2 rounded-lg px-4 py-2 w-full">
          <h2>${data.sys.country}</h2>
          <p>${data.main.temp}°C</p>
        </div>
      `;
		} catch (err) {
			this.display.innerHTML = `
        <p>Failed to fetch weather</p>
      `;
		}
	}
}

new Weathering();
