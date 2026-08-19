import maplibregl from "https://unpkg.com/maplibre-gl@5.15.0/dist/maplibre-gl.js";
export class MapView{
 constructor(id="map"){this.map=new maplibregl.Map({container:id,style:"https://demotiles.maplibre.org/style.json",center:[0,53],zoom:3});this.map.addControl(new maplibregl.NavigationControl(),"top-right");this.map.on("load",()=>this.init());}
 init(){this.map.addSource("ash",{type:"geojson",data:{type:"FeatureCollection",features:[]}});this.map.addLayer({id:"ash",type:"circle",source:"ash",paint:{"circle-radius":3,"circle-opacity":.35}});
 [["London",-0.1276,51.5074],["Paris",2.3522,48.8566],["Frankfurt",8.6821,50.1109]].forEach(x=>new maplibregl.Marker().setLngLat([x[1],x[2]]).setPopup(new maplibregl.Popup().setText(x[0])).addTo(this.map));}
 render(ps){let s=this.map.getSource("ash");if(!s)return;s.setData({type:"FeatureCollection",features:ps.map(p=>({type:"Feature",geometry:{type:"Point",coordinates:[p.lon,p.lat]},properties:{mass:p.mass}}))});}
}