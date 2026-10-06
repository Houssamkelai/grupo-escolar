// Convex exterior collision prisms, extracted from the Blender volumes.
export class CollisionWorld {
 constructor(data){this.radius=data.radius;this.minHeight=data.minCameraHeight;this.flightHeight=data.safeFlightHeight;this.solids=data.solids;}
 planes(s){const p=s.polygon;return p.map((a,i)=>{const b=p[(i+1)%p.length],dx=b[0]-a[0],dz=b[1]-a[1],nx=dz,nz=-dx;return [nx,0,nz,nx*a[0]+nz*a[1]+this.radius*Math.hypot(nx,nz)];}).concat([[0,1,0,s.maxY+this.radius],[0,-1,0,-s.minY+this.radius]]);}
 intersects(a,b,s){let lo=0,hi=1;for(const [x,y,z,c] of this.planes(s)){const start=x*a.x+y*a.y+z*a.z-c,delta=x*(b.x-a.x)+y*(b.y-a.y)+z*(b.z-a.z);if(Math.abs(delta)<1e-9){if(start>0)return false;continue;}const t=-start/delta;if(delta>0)hi=Math.min(hi,t);else lo=Math.max(lo,t);if(lo>hi)return false;}return hi>=0&&lo<=1;}
 blocked(a,b){if(b.y<this.minHeight||Math.abs(b.x)>160||Math.abs(b.z)>160||b.y>150)return true;return this.solids.some(s=>this.intersects(a,b,s));}
}
