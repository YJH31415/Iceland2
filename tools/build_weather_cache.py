#!/usr/bin/env python3
import argparse,json,time
from pathlib import Path
import requests
BASE="https://archive-api.open-meteo.com/v1/archive"
LEVELS=[1000,925,850,800,750,700,650,600,550,500,450,400,350,300,250,200,150,100]
def variables():
    return ",".join(x for p in LEVELS for x in [f"temperature_{p}hPa",f"relative_humidity_{p}hPa",f"wind_speed_{p}hPa",f"wind_direction_{p}hPa",f"geopotential_height_{p}hPa",f"vertical_velocity_{p}hPa"])
def main():
    a=argparse.ArgumentParser();a.add_argument("--lat-min",type=float,default=40);a.add_argument("--lat-max",type=float,default=70);a.add_argument("--lon-min",type=float,default=-30);a.add_argument("--lon-max",type=float,default=20);a.add_argument("--step",type=float,default=.25);a.add_argument("--start",default="2010-04-14");a.add_argument("--end",default="2010-04-21");a.add_argument("--out",default="data/atmosphere/raw");o=a.parse_args();out=Path(o.out);out.mkdir(parents=True,exist_ok=True)
    lat=o.lat_min
    while lat<=o.lat_max+1e-9:
        lon=o.lon_min
        while lon<=o.lon_max+1e-9:
            p={"latitude":round(lat,5),"longitude":round(lon,5),"start_date":o.start,"end_date":o.end,"hourly":variables(),"wind_speed_unit":"ms","timezone":"GMT","models":"era5"}
            r=requests.get(BASE,params=p,timeout=60);r.raise_for_status()
            (out/f"lat_{lat:+07.2f}_lon_{lon:+08.2f}.json").write_text(json.dumps(r.json()),encoding="utf-8")
            lon+=o.step;time.sleep(.05)
        lat+=o.step
if __name__=="__main__":main()
