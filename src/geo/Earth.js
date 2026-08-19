export const EARTH_RADIUS_M=6371008.8;
const DEG=Math.PI/180;

export function moveOnSphere(latDeg,lonDeg,dxEastM,dyNorthM){
  const lat=latDeg*DEG, lon=lonDeg*DEG;
  const dLat=dyNorthM/EARTH_RADIUS_M;
  const cosLat=Math.max(Math.cos(lat),1e-6);
  const dLon=dxEastM/(EARTH_RADIUS_M*cosLat);
  let lat2=lat+dLat;
  lat2=Math.max(-Math.PI/2+1e-9,Math.min(Math.PI/2-1e-9,lat2));
  let lon2=lon+dLon;
  lon2=((lon2+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
  return {lat:lat2/DEG,lon:lon2/DEG};
}

export function haversineM(a,b){
 const p1=a.lat*DEG,p2=b.lat*DEG,dp=(b.lat-a.lat)*DEG,dl=(b.lon-a.lon)*DEG;
 const h=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
 return 2*EARTH_RADIUS_M*Math.asin(Math.min(1,Math.sqrt(h)));
}
