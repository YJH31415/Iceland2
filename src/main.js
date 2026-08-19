import {OpenMeteoGrid} from "./weather/OpenMeteoGrid.js";
import {createSourceParticles,SOURCE} from "./source/SourceModel.js";
import {Simulator} from "./physics/Simulator.js";
import {updateAlerts} from "./alerts/AviationAlert.js";

const map=new maplibregl.Map({
 container:"map",
 style:"https://demotiles.maplibre.org/style.json",
 center:[-5,55],zoom:3,projection:{type:"globe"}
});
map.addControl(new maplibregl.NavigationControl());

const slider=document.getElementById("heightSlider");
const heightValue=document.getElementById("heightValue");
const start=document.getElementById("start");
const reset=document.getElementById("reset");
const status=document.getElementById("status");
const timeEl=document.getElementById("time");

slider.addEventListener("input",()=>heightValue.textContent=slider.value);

let weather,sim,running=false,last=0;

async function loadGrid(){
 try{
  status.textContent="Open-Meteo grid 로딩…";
  const r=await fetch("./data/atmosphere/open_meteo_grid.json",{cache:"no-store"});
  if(!r.ok)throw new Error("open_meteo_grid.json 없음");
  weather=new OpenMeteoGrid(await r.json());
  status.textContent="실제 Open-Meteo Historical Weather 대기장 로드 완료";
 }catch(e){
  status.textContent="대기장 없음: tools/download_open_meteo_grid.py를 먼저 실행하세요.";
  start.disabled=true;console.error(e);
 }
}
start.onclick=()=>{
 if(!weather)return;
 const height=Number(slider.value);
 const particles=createSourceParticles({count:7000,heightTop:height,massRate:2.8e5,time:0});
 sim=new Simulator({weather,particles,dt:300});
 running=true;
 slider.disabled=true;start.disabled=true;
 status.textContent=`실행 중 — 분출 고도 ${height} m ASL (잠금)`;
 last=performance.now();requestAnimationFrame(loop);
};
reset.onclick=()=>location.reload();

function loop(now){
 if(!running)return;
 const elapsed=(now-last)/1000;
 if(elapsed>0.02){sim.step();last=now;timeEl.textContent=`모델 시간: ${(sim.elapsed/3600).toFixed(2)} h`;}
 requestAnimationFrame(loop);
}
loadGrid();
