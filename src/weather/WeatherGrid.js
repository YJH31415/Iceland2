export class WeatherGrid{
 constructor(g){this.g=g}
 sample(lat,lon,z,t){let g=this.g,T=b(g.time,t),Z=b(g.altitude,z),Y=b(g.latitude,lat),X=b(g.longitude,((lon+180)%360+360)%360-180);let f=n=>g[n]?i(g[n],T,Z,Y,X):0;return{u:f("u"),v:f("v"),w:f("w"),temperature:f("temperature"),pressure:f("pressure"),relativeHumidity:f("relativeHumidity")}}
}
function b(a,v){if(v<=a[0])return{i0:0,i1:0,f:0};if(v>=a[a.length-1]){let i=a.length-1;return{i0:i,i1:i,f:0}}let l=0,h=a.length-1;while(h-l>1){let m=(l+h)>>1;a[m]<=v?l=m:h=m}return{i0:l,i1:h,f:(v-a[l])/(a[h]-a[l])}}
function i(F,t,z,y,x){let q=(ti,zi)=>{let c=[F[ti][zi][y.i0][x.i0],F[ti][zi][y.i0][x.i1],F[ti][zi][y.i1][x.i0],F[ti][zi][y.i1][x.i1]];return l(l(c[0],c[1],x.f),l(c[2],c[3],x.f),y.f)};return l(l(q(t.i0,z.i0),q(t.i0,z.i1),z.f),l(q(t.i1,z.i0),q(t.i1,z.i1),z.f),t.f)}
const l=(a,b,f)=>a+(b-a)*f;