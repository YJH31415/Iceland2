const BASE="https://archive-api.open-meteo.com/v1/archive";
export const LEVELS=[1000,925,850,800,750,700,650,600,550,500,450,400,350,300,250,200,150,100];
export async function fetchAtmosphere({lat,lon,startDate="2010-04-14",endDate="2010-04-21"}){
 const vars=LEVELS.flatMap(p=>[`temperature_${p}hPa`,`relative_humidity_${p}hPa`,`wind_speed_${p}hPa`,`wind_direction_${p}hPa`,`geopotential_height_${p}hPa`,`vertical_velocity_${p}hPa`]).join(",");
 const u=new URL(BASE);u.searchParams.set("latitude",lat);u.searchParams.set("longitude",lon);u.searchParams.set("start_date",startDate);u.searchParams.set("end_date",endDate);u.searchParams.set("hourly",vars);u.searchParams.set("wind_speed_unit","ms");u.searchParams.set("timezone","GMT");u.searchParams.set("models","era5");
 const r=await fetch(u);if(!r.ok)throw Error(`Open-Meteo HTTP ${r.status}`);return r.json();
}