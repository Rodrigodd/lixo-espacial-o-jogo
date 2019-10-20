let texts = {
  map: [
    "523 people have died from a plane crash\nbecause the airplane lost contact\nwith the control tower.",
    "Sr. Jorge doesn't find the way to his new job.\nNow he don't have a job.",
    "Ricardo the Trucker got lost on his way\nbecause he didn't have GPS anymore.\nNow Sandro freight are 30% more expensive."
  ],
  internet: [
    "Teenagers can not play\nLeague of Legends today.",
    "Nathan missed his university\napplication deadline because\nhe lost internet connection.\nNathan lost a year."
  ],
  meteorological: [
    "Thousands of people don't know\nif they'll need to get an umbrella\nto the job tomorrow or not!",
    "Jorge Jr. is stuck in school,\nbecause it is raining,\nand he don't have a umbrella."
  ],
  scientific: [
    "Scientists around the world are supposed\nto use satellite's data to work on it.\nBut….. It seems that they won't do this today!",
    "Now, the global warming cannot be prove."
  ]
};

let history =
  "    In 21xx space junk became an irreversible problem.\n" +
  "Large concentrations of debris along Earth's orbit\n" +
  "have begun to cause constant collisions with active\n" +
  "satellites, causing constant failure in the media,\n" +
  "monitoring of nature phenomena and causing air disasters.\n\n" +
  "    To alleviate this fact, a division called Athens 11\n" +
  "was created, responsible for lauching advanced ships to\n" +
  "protect satellites from the threat.";

let gps_satelites_names = [];
let internet_satelites_names = [];
let weather_satelites_names = [];
let science_satelites_names = [];
let gps_ops;
let internet_ops;
let weather_ops;
let science_ops;

function loadGPSNames() {
  for (let i = 0; i<gps_ops.length; i+=3){
    gps_satelites_names.push(trim(gps_ops[i]));
  }

  for (let i = 0; i<internet_ops.length; i+=3){
    internet_satelites_names.push(trim(internet_ops[i]));
  }

  for (let i = 0; i<weather_ops.length; i+=3){
    weather_satelites_names.push(trim(weather_ops[i]));
  }

  for (let i = 0; i<science_ops.length; i+=3){
    science_satelites_names.push(trim(science_ops[i]));
  }
}

