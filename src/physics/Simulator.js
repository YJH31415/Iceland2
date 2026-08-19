import {moveOnSphere} from "../geo/Earth.js";
import {settlingVelocity,airDensity} from "./Settling.js";
import {turbulentDiffusion} from "./Turbulence.js";
import {aggregateParticle} from "./Aggregation.js";
import {ConcentrationGrid} from "./Concentration.js";
import {updateAlerts} from "../alerts/AviationAlert.js";

export class Simulator{
 constructor({weather,particles,dt=300}){this.weather=weather;this.particles=particles;this.dt=dt;this.elapsed=0;
  this.grid=new ConcentrationGrid({latMin:40,latMax:70,lonMin:-30,lonMax:20,zMin:0,zMax:16000,dLat:0.5,dLon:0.5,dZ:500});
 }
 step(){
  this.grid.clear();
  const nextTime=this.elapsed/3600;
  for(const p of this.particles){
   if(!p.alive)continue;
   const a=this.weather.sample(p.lat,p.lon,p.z,nextTime);
   const T=(a.T||273.15),P=(a.P||101325);
   const rho=a.rho||airDensity(P,T);
   const settle=settlingVelocity(p.diameter,p.rhoParticle,P,T);
   const turb=turbulentDiffusion(8000,200, this.dt);
   const dx=(a.u||0)*this.dt+turb.east;
   const dy=(a.v||0)*this.dt+turb.north;
   const dz=(a.w||0)*this.dt-turb.vertical*0+(-settle*this.dt+turb.vertical);
   const pos=moveOnSphere(p.lat,p.lon,dx,dy);
   p.lat=pos.lat;p.lon=pos.lon;p.z+=dz;p.relativeSpeed=Math.hypot(a.u||0,a.v||0);
   if(p.z<=0){p.z=0;p.alive=false}
   if(p.z>16000){p.z=16000}
   this.grid.deposit(p.lat,p.lon,p.z,p.mass);
  }
  // concentration-derived local number density and aggregation
  for(const p of this.particles)if(p.alive){
   const c=this.grid.concentrationAt(p.lat,p.lon,p.z, this.cellVolume(p.lat,p.z));
   const n=c/Math.max(p.mass,1e-20);
   aggregateParticle(p,n,this.dt);
  }
  this.elapsed+=this.dt;
  updateAlerts(this);
 }
 cellVolume(lat,z){
  const R=6371008.8,dy=R*Math.PI/180*this.grid.dLat,dx=R*Math.cos(lat*Math.PI/180)*Math.PI/180*this.grid.dLon;
  return dx*dy*this.grid.dZ;
 }
 cityConcentration(lat,lon){
  const zmin=0,zmax=12000;let sum=0;
  for(let z=zmin;z<=zmax;z+=500)sum+=this.grid.concentrationAt(lat,lon,z,this.cellVolume(lat,z))*500;
  return sum/Math.max(1,zmax-zmin)*1000; // kg/m3 -> mg/m3
 }
}
