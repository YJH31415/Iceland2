export class AshParticle{
 constructor(o){Object.assign(this,o);this.alive=true;this.rhoParticle=o.rhoParticle??2300;this.fractalDimension=o.fractalDimension??2.9;this.stickingEfficiency=o.stickingEfficiency??0.2}
}
