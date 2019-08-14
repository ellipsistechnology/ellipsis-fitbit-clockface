import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import { me } from "appbit";
import { battery } from "power";
import { today as activity } from "user-activity";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> elements:
const timeText = document.getElementById("time");
const dateText = document.getElementById("date");
const heartText = document.getElementById("heart");
const batteryText = document.getElementById("battery");
const stepsText = document.getElementById("steps");
const distanceText = document.getElementById("distance");
const caloriesText = document.getElementById("calories");
const floorsText = document.getElementById("floors");
const activityText = document.getElementById("activity");

// Battery Level:
function updateBatteryCharge() {
  batteryText.text = `${Math.floor(battery.chargeLevel)}%`; 
}
battery.onchange = function () {
  updateBatteryCharge();
};
updateBatteryCharge();

// Heart Rate:
var hrm = new HeartRateSensor();
let lastReading = 0;
hrm.onreading = function() {
  let heartRate;
  if (hrm.timestamp === lastReading) {
    // timestamp has not updated, reading is stale
    heartRate = "--";
  } else {
    heartRate = hrm.heartRate;
  }
  heartText.text = `${heartRate}`;
  lastReading = hrm.timestamp;
};

// Begin monitoring the sensor
if (me.permissions.granted("access_heart_rate")) {
  hrm.start();
}

function getDayAsText(date) {
  switch(date.getDay()) {
    case 0:
      return "Sun";
      break;
    case 1:
      return "Mon";
      break;
    case 2:
      return "Tue";
      break;
    case 3:
      return "Wed";
      break;
    case 4:
      return "Thu";
      break;
    case 5:
      return "Fri";
      break;
    case 6:
      return "Sat";
      break;
  }
}

function getMonthAsText(date) {
  switch(date.getMonth()) {
    case 0:
      return "Jan";
      break;
    case 1:
      return "Feb";
      break;
    case 2:
      return "Mar";
      break;
    case 3:
      return "Apr";
      break;
    case 4:
      return "May";
      break;
    case 5:
      return "Jun";
      break;
    case 6:
      return "Jul";
      break;
    case 7:
      return "Aug";
      break;
    case 8:
      return "Sep";
      break;
    case 9:
      return "Oct";
      break;
    case 10:
      return "Nov";
      break;
    case 11:
      return "Dec";
      break;
  }
}

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  
  // TIME:
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  timeText.text = `${hours}:${mins}`;
  
  //DATE:
  let day = getDayAsText(today);
  let date = today.getDate();
  let month = getMonthAsText(today);
  dateText.text = `${day}, ${month} ${date}`;
  
  // STATS:
  stepsText.text = `${activity.local.steps || '0'}`;
  distanceText.text = `${activity.local.distance || '0'}`;
  caloriesText.text = `${activity.local.calories || '0'}`;
  activityText.text = `${activity.local.activeMinutes || '0'}`;
  floorsText.text = `${activity.local.elevationGain || '0'}`;
}
