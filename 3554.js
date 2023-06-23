"use strict";(self.webpackChunkaisa=self.webpackChunkaisa||[]).push([[3554],{4140:(e,t,n)=>{n.d(t,{d:()=>o});var r=n(7552),i=n(7401),a=n(82),s=n(6075),l=n(3362);class o{back;down;front;left;right;up;texturedRenderingPipeline=new l.W(null);init(){return Promise.all([a.O.load(n(4167),!1).then((e=>this.back=e)),a.O.load(n(1237),!1).then((e=>this.down=e)),a.O.load(n(3661),!1).then((e=>this.front=e)),a.O.load(n(7796),!1).then((e=>this.left=e)),a.O.load(n(2488),!1).then((e=>this.right=e)),a.O.load(n(4046),!1).then((e=>this.up=e))]).then((()=>{this.back.setClamp(!0),this.down.setClamp(!0),this.front.setClamp(!0),this.left.setClamp(!0),this.right.setClamp(!0),this.up.setClamp(!0)}))}draw(e,t){this.texturedRenderingPipeline.setFramebuffer(e),this.drawSkyBox(e,t.getRotation())}drawSkyBox(e,t){const n=20,a=[this.back,this.left,this.front,this.right];let l,o,c;const u=[new r.l(1,1,-1,1),new r.l(-1,1,-1,1),new r.l(-1,-1,-1,1),new r.l(1,1,-1,1),new r.l(-1,-1,-1,1),new r.l(1,-1,-1,1)];for(let h=0;h<4;h++)l=t.multiplyMatrix(i.C.constructXRotationMatrix(Math.PI).multiplyMatrix(i.C.constructYRotationMatrix(2*+Math.PI/4*h))),o=l.multiplyMatrix(i.C.constructScaleMatrix(n,n,n)),c={points:u,points2:u.map((()=>new r.l(0,0,0))),uv:[new s.l(1,1),new s.l(0,1),new s.l(0,0),new s.l(1,1),new s.l(0,0),new s.l(1,0)],faces:[{vertices:[0,1,2],uv:[0,1,2]},{vertices:[3,4,5],uv:[3,4,5]}]},e.setTexture(a[h]),this.texturedRenderingPipeline.setFramebuffer(e),this.texturedRenderingPipeline.setModelViewMatrix(o),this.texturedRenderingPipeline.draw(e,c);l=t.multiplyMatrix(i.C.constructXRotationMatrix(Math.PI)).multiplyMatrix(i.C.constructYRotationMatrix(0).multiplyMatrix(i.C.constructYRotationMatrix(2*Math.PI/4*1).multiplyMatrix(i.C.constructXRotationMatrix(2*-Math.PI/4)))),o=l.multiplyMatrix(i.C.constructScaleMatrix(n,n,n)),c={points:u,points2:u.map((()=>new r.l(0,0,0))),uv:[new s.l(0,0),new s.l(1,0),new s.l(1,1),new s.l(0,0),new s.l(1,1),new s.l(0,1)],faces:[{vertices:[0,1,2],uv:[0,1,2]},{vertices:[3,4,5],uv:[3,4,5]}]},e.setTexture(this.up),this.texturedRenderingPipeline.setModelViewMatrix(o),this.texturedRenderingPipeline.draw(e,c),l=t.multiplyMatrix(i.C.constructXRotationMatrix(Math.PI)).multiplyMatrix(i.C.constructYRotationMatrix(0).multiplyMatrix(i.C.constructYRotationMatrix(2*Math.PI/2).multiplyMatrix(i.C.constructXRotationMatrix(2*Math.PI/4)))),o=l.multiplyMatrix(i.C.constructScaleMatrix(n,n,n)),c={points:u,points2:u.map((()=>new r.l(0,0,0))),uv:[new s.l(1,1),new s.l(0,1),new s.l(0,0),new s.l(1,1),new s.l(0,0),new s.l(1,0)],faces:[{vertices:[0,1,2],uv:[0,1,2]},{vertices:[3,4,5],uv:[3,4,5]}]},e.setTexture(this.down),this.texturedRenderingPipeline.setModelViewMatrix(o),this.texturedRenderingPipeline.draw(e,c)}}},5710:(e,t,n)=>{n.d(t,{H:()=>s});var r=n(7552),i=n(6075),a=n(7758);class s{static parse(e,t=!1){const n=[];return e.forEach((e=>{const i=new Array,a=new Array;e.vertices.forEach((e=>{i.push(new r.l(e.x,e.y,e.z).mul(1))})),e.normals.forEach((e=>{a.push(t?new r.l(e.x,e.y,e.z).normalize().mul(-1):new r.l(e.x,e.y,e.z).normalize())}));const s=[];e.faces.forEach((e=>{s.push({n1:e.normals[0],n2:e.normals[1],n3:e.normals[2],v1:e.vertices[0],v2:e.vertices[1],v3:e.vertices[2]})}));const l={faces:s,normals:a,points:i,transformedNormals:a.map((()=>new r.l(0,0,0,0))),transformedPoints:i.map((()=>new r.l(0,0,0,0)))};n.push(l)})),n}static getBlenderScene(e,t=!0){const n=[];return e.forEach((e=>{const s=new Array,l=new Array;let o;e.uv&&(o=[],e.uv.forEach((e=>{const t=new i.l;t.u=e.u,t.v=1-e.v,o.push(t)}))),e.vertices.forEach((e=>{t?s.push(new r.l(e.x,e.y,e.z).mul(2).add(new r.l(0,-2.7,0,0))):s.push(new r.l(e.x,e.y,e.z).mul(2))})),e.normals.forEach((e=>{l.push(new r.l(e.x,e.y,e.z))}));const c=(new a.o).computeBoundingSphere(s);c.getCenter().w=1;const u={points:s,normals:l,uv:o,faces:e.faces,points2:s.map((()=>new r.l(0,0,0,0))),normals2:l.map((()=>new r.l(0,0,0,0))),boundingSphere:c,name:e.name};n.push(u)})),n}}},3554:(e,t,n)=>{n.r(t),n.d(t,{Scene15:()=>d});var r=n(7574),i=n(7401),a=n(9999),s=n(4140),l=n(8931),o=n(82),c=n(518),u=n(3362);class h extends a.p{skyBox;baked;noise;blenderObj8;accumulationBuffer;texturedRenderingPipeline;init(e){return this.texturedRenderingPipeline=new u.W(e),this.accumulationBuffer=new Uint32Array(e.width*e.height),e.setCullFace(r.u.BACK),this.skyBox=new s.d,Promise.all([this.skyBox.init(),c.v.loadWithTexture(n(7269)).then((e=>this.blenderObj8=e)),o.O.load(n(6040),!1).then((e=>this.baked=e)),o.O.generateProceduralNoise().then((e=>this.noise=e))])}render(e,t){this.texturedRenderingPipeline.setCullFace(r.u.BACK),this.drawBlenderScene7(e,t-11e5);const n=new l.x(this.accumulationBuffer,e.width,e.height);e.drawTexture(0,0,n,.75),e.fastFramebufferCopy(this.accumulationBuffer,e.framebuffer),e.noise(t,this.noise)}drawBlenderScene7(e,t){t*=.2,e.clearDepthBuffer();const n=i.C.constructTranslationMatrix(0,0,17*(.5*Math.sin(7e-5*t)+.5)-134).multiplyMatrix(i.C.constructXRotationMatrix(6e-4*t).multiplyMatrix(i.C.constructYRotationMatrix(5e-4*-t).multiplyMatrix(i.C.constructTranslationMatrix(0,-25,0)))).multiplyMatrix(i.C.constructScaleMatrix(13,13,13));this.skyBox.draw(e,n),e.clearDepthBuffer(),e.setTexture(this.baked),this.texturedRenderingPipeline.setModelViewMatrix(n),this.texturedRenderingPipeline.drawMeshArray(e,this.blenderObj8)}}class d{BakedLighting;init(e){return this.BakedLighting=new h,Promise.all([this.BakedLighting.init(e)])}render(e,t){this.BakedLighting.render(e,t)}}},7758:(e,t,n)=>{n.d(t,{o:()=>a});var r=n(7552),i=n(6653);class a{computeBoundingSphere(e){if(0===e.length)throw new Error("More than one vertex required.");if(1===e.length)return new i.a(e[0],0);let t=new r.l(0,0,0,0),n=0;return e.forEach((e=>{t=t.add(new r.l(e.x,e.y,e.z,0))})),t=t.mul(1/e.length),e.forEach((e=>{n=Math.max(n,t.sub(e).length())})),new i.a(t,n)}}},6653:(e,t,n)=>{n.d(t,{a:()=>r});class r{center;radius;constructor(e,t){this.center=e,this.radius=t}isInsidePositiveHalfSpace(e){return e.getNormal().dot(this.center)-e.getDistance()>-this.radius}getTran(e){return e.multiplyHom(this.center)}getRadius(){return this.radius}getCenter(){return this.center}}},518:(e,t,n)=>{n.d(t,{v:()=>i});var r=n(5710);class i{static load(e){return fetch(e).then((e=>e.json())).then((e=>r.H.parse(e)))}static loadWithTexture(e){return fetch(e).then((e=>e.json())).then((e=>r.H.getBlenderScene(e,!1)))}constructor(){}}},6040:(e,t,n)=>{e.exports=n.p+"627a342d6eba738cf103.png"},7269:(e,t,n)=>{e.exports=n.p+"c0190c8ec953bd7420ee.jsx"},4167:(e,t,n)=>{e.exports=n.p+"29fc676286325d45f7de.png"},1237:(e,t,n)=>{e.exports=n.p+"fe1ca8bac15e02a2d14c.png"},3661:(e,t,n)=>{e.exports=n.p+"780c7edd8a9410b8261f.png"},7796:(e,t,n)=>{e.exports=n.p+"c83bb5502d841707edd4.png"},2488:(e,t,n)=>{e.exports=n.p+"8f18731da1a9e273cf04.png"},4046:(e,t,n)=>{e.exports=n.p+"5cf778e15448cf90b764.png"}}]);
//# sourceMappingURL=3554.js.map