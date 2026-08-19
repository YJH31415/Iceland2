/*
 Smoluchowski coagulation approximation.

 Instead of O(N²) particle-particle collisions, the simulation estimates
 local number density from the concentration grid and applies a collision
 probability to super-particles.

 Kernel:
 beta_ij = pi/4 * (di+dj)^2 * |vi-vj| * E

 E is an effective sticking efficiency. Relative Brownian/turbulent collision
 terms can be added later. Aggregation increases represented diameter and
 conserves mass; aggregate density can be reduced using a fractal relation.
*/
export function aggregateParticle(p,localNumberDensity,dt){
 const d=p.diameter;
 const sigma=Math.PI*d*d;
 const rel=Math.max(0.01,p.relativeSpeed||0.1);
 const sticking=Math.min(1,Math.max(0,p.stickingEfficiency));
 const rate=localNumberDensity*sigma*rel*sticking;
 const probability=1-Math.exp(-rate*dt);
 if(Math.random()<probability){
  p.diameter*=Math.pow(2,1/Math.max(1,p.fractalDimension));
  p.aggregateMass*=2;
  p.particleCount*=2;
  p.rhoParticle=Math.max(500,p.rhoParticle*Math.pow(2,1-3/p.fractalDimension));
 }
}
