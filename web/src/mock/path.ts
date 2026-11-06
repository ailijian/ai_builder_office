export type Point = readonly [number,number]; // B00 design pixels

export function routeLength(points:readonly Point[]) {
  return points.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p[0]-points[i][0],p[1]-points[i][1]),0);
}
export function sampleRoute(points:readonly Point[], distance:number): {position:Point; direction:Point} {
  let remaining=Math.max(0,distance);
  for(let i=1;i<points.length;i++) {
    const a=points[i-1],b=points[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);
    if(remaining<=length||i===points.length-1) {
      const t=Math.min(1,remaining/length);
      return {position:[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],direction:[(b[0]-a[0])/length,(b[1]-a[1])/length]};
    }
    remaining-=length;
  }
  return {position:points[0],direction:[0,1]};
}
