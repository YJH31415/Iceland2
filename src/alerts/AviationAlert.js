const thresholds=[["verylow",0.2],["low",2],["medium",5],["high",10],["veryhigh",Infinity]];
export function classifyMgM3(c){
 if(c<0.2)return"verylow";if(c<2)return"low";if(c<5)return"medium";if(c<10)return"high";return"veryhigh";
}
export const CITIES={
 London:{lat:51.5074,lon:-0.1278},
 Paris:{lat:48.8566,lon:2.3522},
 Frankfurt:{lat:50.1109,lon:8.6821}
};
export function updateAlerts(sim){
 for(const [name,p] of Object.entries(CITIES)){
  const c=sim.cityConcentration(p.lat,p.lon);
  const cls=classifyMgM3(c);
  const el=document.getElementById(name.toLowerCase());
  el.className=cls;
  el.innerHTML=`<strong>${name}</strong><br>${c.toFixed(3)} mg/m³ — ${cls.toUpperCase()}`;
 }
}
