const G=9.80665;
const RHO_ASH=2300;
export function airDensity(P,T){return P/(287.05*T)}
export function viscositySutherland(T){return 1.458e-6*T**1.5/(T+110.4)}
export function cunningham(d,P){
 const lambda=6.6e-8; // reference mean free path; corrected by pressure below
 const mfp=lambda*(101325/Math.max(P,100));
 return 1+(2*mfp/d)*(1.257+0.4*Math.exp(-1.1*d/(2*mfp)));
}
export function settlingVelocity(d,rhoParticle,P,T){
 const rho=airDensity(P,T),mu=viscositySutherland(T),Cc=cunningham(d,P);
 let v=G*(rhoParticle-rho)*d*d*Cc/(18*mu);
 // iterate with Schiller-Naumann drag for non-Stokes regime
 for(let i=0;i<8;i++){
  const Re=rho*Math.abs(v)*d/mu;
  const Cd=Re<1e-12?24/Math.max(Re,1e-12):Re<1000?24/Re*(1+0.15*Re**0.687):0.44;
  v=Math.sqrt(Math.max(0,4*G*d*(rhoParticle-rho)*Cc/(3*4*Cd*rho)));
 }
 return Math.max(0,v);
}
