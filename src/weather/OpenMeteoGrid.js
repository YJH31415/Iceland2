export class OpenMeteoGrid{
 constructor(data){this.d=data;this.lats=data.latitudes;this.lons=data.longitudes;this.times=data.times;this.levels=data.pressureLevels;}
 sample(lat,lon,z,timeIndexFloat){
  const t=bracket(this.times,timeIndexFloat), y=bracket(this.lats,lat), x=bracket(this.lons,normLon(lon));
  const fields={u:0,v:0,w:0,T:0,RH:0,P:0,rho:0};
  for(const [k,src] of Object.entries({u:"u",v:"v",w:"w",T:"temperature",RH:"relativeHumidity",P:"pressure",rho:"airDensity"})){
   if(this.d[src]) fields[k]=interp4(this.d[src],t,y,x,z,this.levels);
  }
  return fields;
 }
}
function normLon(x){return ((x+180)%360+360)%360-180}
function bracket(a,v){if(v<=a[0])return{i0:0,i1:0,f:0};if(v>=a[a.length-1]){let i=a.length-1;return{i0:i,i1:i,f:0}};let lo=0,hi=a.length-1;while(hi-lo>1){let m=(lo+hi)>>1;if(a[m]<=v)lo=m;else hi=m}return{i0:lo,i1:hi,f:(v-a[lo])/(a[hi]-a[lo])}}
function lerp(a,b,f){return a+(b-a)*f}
function interp4(F,t,y,x,z,levels){
 // F[time][level][lat][lon]. z is altitude; interpolate each pressure level
 // using its local geopotential height, then interpolate between the two
 // bracketing levels. This is intentionally local rather than fixed-height.
 const vals=[];
 for(let k=0;k<levels.length;k++){
  const v00=F[t.i0][k][y.i0][x.i0],v01=F[t.i0][k][y.i0][x.i1],v10=F[t.i0][k][y.i1][x.i0],v11=F[t.i0][k][y.i1][x.i1];
  const a=lerp(lerp(v00,v01,x.f),lerp(v10,v11,x.f),y.f);
  const w00=F[t.i1][k][y.i0][x.i0],w01=F[t.i1][k][y.i0][x.i1],w10=F[t.i1][k][y.i1][x.i0],w11=F[t.i1][k][y.i1][x.i1];
  vals.push({a:lerp(a,lerp(lerp(w00,w01,x.f),lerp(w10,w11,x.f),y.f),t.f),z:levels[k][y.i0][x.i0]});
 }
 let lo=0;while(lo<vals.length-1 && vals[lo+1].z<z)lo++;
 let hi=Math.min(vals.length-1,lo+1);
 if(hi===lo)return vals[lo].a;
 const f=(z-vals[lo].z)/(vals[hi].z-vals[lo].z);
 return lerp(vals[lo].a,vals[hi].a,Math.max(0,Math.min(1,f)));
}
