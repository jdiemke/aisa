"use strict";(self.webpackChunkaisa=self.webpackChunkaisa||[]).push([[2719],{2719:(t,e,i)=>{i.r(e),i.d(e,{Scene7:()=>g});var r=i(7574),n=i(6075),a=i(7552);class s{points;normals;uv;faces;points2;normals2}var o=i(3362),l=i(9999),h=i(82),u=i(8931),c=i(4766);class d extends l.p{tunnelScene=new c.R;accumulationBuffer;init(t){return this.accumulationBuffer=new Uint32Array(t.width*t.height),Promise.all([this.tunnelScene.init(t)])}render(t,e){this.tunnelScene.render(t,e),this.applyRadialBlur(t,e)}applyRadialBlur(t,e){const i=new u.x;i.texture=this.accumulationBuffer,i.width=t.width,i.height=t.height;const r=1.018*t.width,n=1.018*t.height,a=.5*Math.sin(5e-5*e)+.5;t.drawScaledTextureClipBi(Math.round(t.width/2-r/2),Math.round(t.height/2-n/2),r,n,i,1*a),t.fastFramebufferCopy(this.accumulationBuffer,t.framebuffer)}}var p=i(7401);class M{currtentMatrix;tempMatrix;temp;transformation;constructor(){this.currtentMatrix=new p.C,this.tempMatrix=new p.C,this.temp=new p.C,this.transformation=new p.C}getMatrix(){return this.currtentMatrix}setIdentity(){this.currtentMatrix.setIdentityMatrix()}multMatrix(t){this.currtentMatrix=this.currtentMatrix.multiplyMatrix(t)}translate(t,e,i){this.transformation.setTranslationMatrix(t,e,i),this.applyMat()}scal(t,e,i){this.transformation.setScaleMatrix(t,e,i),this.applyMat()}xRotate(t){this.transformation.setXRotationMatrix(t),this.applyMat()}zRotate(t){this.transformation.setZRotationMatrix(t),this.applyMat()}yRotate(t){this.transformation.setYRotationMatrix(t),this.applyMat()}rotate(t,e,i,r){this.transformation.setRotationMatrix(t,e,i,r),this.applyMat()}applyMat(){this.tempMatrix.multiply2(this.currtentMatrix,this.transformation),this.temp=this.currtentMatrix,this.currtentMatrix=this.tempMatrix,this.tempMatrix=this.temp}}class x extends l.p{logoTexture;floor;modelViewMatrix;logo;face;ground;scene;texturedRenderingPipeline;init(t){return this.modelViewMatrix=new M,this.texturedRenderingPipeline=new o.W(t),this.texturedRenderingPipeline.enableAlphaBlending(),this.texturedRenderingPipeline.setAlpha(1),this.texturedRenderingPipeline.setCullFace(r.u.DISABLED),this.scene=new d,Promise.all([this.scene.init(t),h.O.load(i(4e3),!0).then((t=>this.logo=t)),h.O.load(i(7169),!1).then((t=>this.logoTexture=t)),h.O.load(i(1013),!0).then((t=>this.face=t)),h.O.load(i(5476),!0).then((t=>this.ground=t))])}onInit(){const t=new s;t.points=[new a.l(-1,-0,1),new a.l(1,-0,1),new a.l(1,-0,-1),new a.l(-1,-0,-1)],t.uv=[new n.l(0,0),new n.l(1,0),new n.l(1,1),new n.l(0,1)],t.points2=t.points.map((()=>new a.l(0,0,0,0))),t.faces=[{uv:[0,1,2],vertices:[0,1,2]},{uv:[2,3,0],vertices:[2,3,0]}],this.floor=t}render(t,e){this.drawRotoZoomer(t,e);const i=130*(.5*Math.sin(2e-4*e)+.5)+370;this.logo.setClamp(!1);for(let r=0;r<200;r++)for(let n=0;n<320;n++){const a=(.5*Math.sin(41e-5*e+.022*r)+.5)*i+.001*e,s=(.5*Math.cos(42e-5*e+.016*n)+.5)*i+.002*e,o=this.logo.getBilinearFilteredPixel2(2.1*n+a,2.1*r+s),l=t.framebuffer[n+320*r],h=(o>>24&255)/255*(.5*Math.sin(.02*e)+.5)*1.2,u=1-h,c=(l>>0&255)*u+(o>>0&255)*h,d=(l>>8&255)*u+(o>>8&255)*h,p=(l>>16&255)*u+(o>>16&255)*h;t.framebuffer[n+320*r]=c|d<<8|p<<16|255<<24}this.scene.applyRadialBlur(t,e),this.texturedRenderingPipeline.setModelViewMatrix(this.modelViewMatrix.getMatrix()),t.setTexture(this.ground),t.clearDepthBuffer(),this.texturedRenderingPipeline.setAlpha(Math.max(.89,0)*(.5*Math.sin(2e-4*e)+.5)*.5+.5),this.modelViewMatrix.setIdentity(),this.modelViewMatrix.translate(0,0,-7),this.modelViewMatrix.rotate(1,0,0,180+35*Math.sin(19e-5*e)),this.modelViewMatrix.rotate(0,1,0,35*Math.sin(18e-5*e)+.19*e),this.modelViewMatrix.rotate(0,0,1,10*+Math.sin(8e-4*e)),this.modelViewMatrix.rotate(1,0,0,90),this.modelViewMatrix.scal(3.2,4,1.2),this.texturedRenderingPipeline.draw(t,this.floor),t.drawTexture(179,0,this.face,1)}drawRotoZoomer(t,e){const i=Math.sin(5e-4*e)+1.1,r=Math.sin(3e-4*e)*i,n=Math.cos(3e-4*e)*i,a=n,s=-r;let o=512*Math.sin(2e-4*e),l=512*Math.cos(2e-4*e),h=0,u=0,c=0;for(let e=0;e<t.height;e++){u=l,h=o;for(let e=0;e<t.width;e++)t.framebuffer[c++]=this.logoTexture.getBilinearFilteredPixel2(u,h),u+=a,h+=s;l+=r,o+=n}}}var f=i(4377),w=i(1762);class m extends l.p{renderingPipeline;cubeMesh=new f.X;fairlight;init(t){return this.renderingPipeline=new w.M(t),this.renderingPipeline.setCullFace(r.u.BACK),Promise.all([h.O.load(i(9679),!1).then((t=>this.fairlight=t))])}render(t,e){t.fastFramebufferCopy(t.framebuffer,this.fairlight.texture),t.clearDepthBuffer(),this.renderCube(t,e)}renderCube(t,e){const i=.02*e;this.renderingPipeline.draw(t,this.cubeMesh.getMesh(),this.getModelViewMatrix(i))}renderBackground(t,e){const i=.02*e;t.clearDepthBuffer(),this.renderingPipeline.draw(t,this.cubeMesh.getMesh(),this.getModelViewMatrix(i))}getModelViewMatrix(t){const e=6.2+3*Math.sin(.05*t);return p.C.constructTranslationMatrix(8*Math.sin(.08*t),6*Math.sin(.05*t),-20).multiplyMatrix(p.C.constructScaleMatrix(e,e,e).multiplyMatrix(p.C.constructYRotationMatrix(.09*t)).multiplyMatrix(p.C.constructXRotationMatrix(.08*t)))}}class g{RotoZoomerScene;CubeScene;logo;init(t){return this.RotoZoomerScene=new x,this.CubeScene=new m,Promise.all([this.CubeScene.init(t),this.RotoZoomerScene.init(t),h.O.load(i(4302),!0).then((t=>this.logo=t))])}onInit(){this.RotoZoomerScene.onInit()}render(t,e){this.RotoZoomerScene.render(t,e),this.CubeScene.renderBackground(t,e),t.drawTexture(0,t.height-this.logo.height,this.logo,1)}}},4377:(t,e,i)=>{i.d(e,{X:()=>a});var r=i(7552),n=i(9941);class a extends n.l{constructor(){super();const t=.5,e=[new r.l(-t,-t,-t),new r.l(t,-t,-t),new r.l(t,t,-t),new r.l(-t,t,-t),new r.l(-t,-t,t),new r.l(t,-t,t),new r.l(t,t,t),new r.l(-t,t,t)];this.buildMesh(e,[0,2,1,0,3,2,5,7,4,5,6,7,1,6,5,1,2,6,4,3,0,4,7,3,4,1,5,4,0,1,3,6,2,3,7,6])}}},1013:(t,e,i)=>{t.exports=i.p+"2cb82263d30a7a0c2e39.png"},5476:(t,e,i)=>{t.exports=i.p+"3798a32406d102c36d09.png"},9679:(t,e,i)=>{t.exports=i.p+"78ff22e625afd8495b4c.png"},4302:(t,e,i)=>{t.exports=i.p+"02bd09e668c6b0faadc0.png"},4e3:(t,e,i)=>{t.exports=i.p+"4208105f5cfbcbdb6ece.png"},7169:(t,e,i)=>{t.exports=i.p+"83e88ad71c6521471af8.png"}}]);
//# sourceMappingURL=2719.js.map