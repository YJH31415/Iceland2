import {AshParticle} from "../physics/Particle.js";
const DEFAULT_HEIGHT=8000;
export const SOURCE={lat:63.63,lon:-19.62,ventElevation:1660,defaultTopASL:DEFAULT_HEIGHT};

export function createSourceParticles({count,heightTop,massRate,time,seed=1}){
 const out=[]; const rng=mulberry(seed);
 const top=Math.max(SOURCE.ventElevation+100,heightTop);
 // Initial vertical distribution: more mass in the middle/lower part of the
 // column, but with a tail toward the top.
 for(let i=0;i<count;i++){
  const u=Math.max(1e-9,rng());
  const z=SOURCE.ventElevation+(top-SOURCE.ventElevation)*Math.pow(u,0.65);
  const d=sampleDiameter(rng); // fine ash focused distribution
  const particleMass=(massRate/count)*10;
  out.push(new AshParticle({
   lat:SOURCE.lat+(rng()-.5)*0.03,lon:SOURCE.lon+(rng()-.5)*0.03,z,
   diameter:d,mass:particleMass,aggregateMass:particleMass,particleCount:1,
   relativeSpeed:0.1
  }));
 }
 return out;
}
function sampleDiameter(r){ // log-normal mixture, micrometres -> m
 const u=r(), mu=u<0.72?Math.log(8e-6):Math.log(45e-6);
 const sigma=u<0.72?0.55:0.65;
 return Math.exp(mu+sigma*normal(r));
}
function normal(r){let a=0,b=0;while(!a)a=r();while(!b)b=r();return Math.sqrt(-2*Math.log(a))*Math.cos(2*Math.PI*b)}
function mulberry(a){return()=>{a|=0;let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
