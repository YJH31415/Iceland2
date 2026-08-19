export function turbulentDiffusion(Kh,Kv,dt,rng=Math.random){
 // Lagrangian random walk: variance = 2 K dt.
 const sx=Math.sqrt(Math.max(0,2*Kh*dt));
 const sz=Math.sqrt(Math.max(0,2*Kv*dt));
 return {east:normal(rng)*sx,north:normal(rng)*sx,vertical:normal(rng)*sz};
}
function normal(r){let u=0,v=0;while(!u)u=r();while(!v)v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
