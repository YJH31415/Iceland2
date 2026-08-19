export class ConcentrationGrid{
 constructor({latMin,latMax,lonMin,lonMax,zMin,zMax,dLat,dLon,dZ}){
  this.latMin=latMin;this.latMax=latMax;this.lonMin=lonMin;this.lonMax=lonMax;
  this.zMin=zMin;this.zMax=zMax;this.dLat=dLat;this.dLon=dLon;this.dZ=dZ;
  this.nLat=Math.ceil((latMax-latMin)/dLat)+1;this.nLon=Math.ceil((lonMax-lonMin)/dLon)+1;this.nZ=Math.ceil((zMax-zMin)/dZ)+1;
  this.mass=new Float64Array(this.nLat*this.nLon*this.nZ);
 }
 clear(){this.mass.fill(0)}
 idx(i,j,k){return (k*this.nLat+j)*this.nLon+i}
 deposit(lat,lon,z,mass){
  const i=Math.floor((lon-this.lonMin)/this.dLon),j=Math.floor((lat-this.latMin)/this.dLat),k=Math.floor((z-this.zMin)/this.dZ);
  if(i<0||j<0||k<0||i>=this.nLon||j>=this.nLat||k>=this.nZ)return;
  this.mass[this.idx(i,j,k)]+=mass;
 }
 concentrationAt(lat,lon,z,cellVolume){
  const i=Math.floor((lon-this.lonMin)/this.dLon),j=Math.floor((lat-this.latMin)/this.dLat),k=Math.floor((z-this.zMin)/this.dZ);
  if(i<0||j<0||k<0||i>=this.nLon||j>=this.nLat||k>=this.nZ)return 0;
  return this.mass[this.idx(i,j,k)]/cellVolume;
 }
}
