(()=>{"use strict";var t={138:(t,a,e)=>{Object.defineProperty(a,"__esModule",{value:!0}),a.LabToXYZ=a.XYZToLab=a.XYZToRGB=a.RGBToXYZ=a.LabToColor=a.ColorToLab=a.I3DXAlphaBlend=a.ARGB=a.XRGB=void 0;const r=e(555);function o(t,a,e){return r.pack(255,t,a,e)}function n(t,a,e){let r=t/255,o=a/255,n=e/255;return r>.04045?r=Math.pow((r+.055)/1.055,2.4):r/=12.92,r*=100,o>.04045?o=Math.pow((o+.055)/1.055,2.4):o/=12.92,o*=100,n>.04045?n=Math.pow((n+.055)/1.055,2.4):n/=12.92,n*=100,[.4124*r+.3576*o+.1805*n,.2126*r+.7152*o+.0722*n,.0193*r+.1192*o+.9505*n]}function d(t,a,e){const r=t/100,o=a/100,n=e/100;let d=3.2406*r+-1.5372*o+-.4986*n,s=-.9689*r+1.8758*o+.0415*n,i=.0557*r+-.204*o+1.057*n;return Math.abs(d)>.0031308?d=1.055*Math.pow(d,1/2.4)-.055:d*=12.92,Math.abs(s)>.0031308?s=1.055*Math.pow(s,1/2.4)-.055:s*=12.92,Math.abs(i)>.0031308?i=1.055*Math.pow(i,1/2.4)-.055:i*=12.92,[Math.min(Math.max(Math.round(255*d),0),255),Math.min(Math.max(Math.round(255*s),0),255),Math.min(Math.max(Math.round(255*i),0),255)]}a.XRGB=o,a.ARGB=function(t,a,e,o){return r.pack(t,a,e,o)},a.I3DXAlphaBlend=function(t,a){let[e,o,n,d]=r.unpack(t),[s,i,c,I]=r.unpack(a);if(0===s)return t;if(0===e)return a;e/=255,s/=255;let u=s+e*(1-s);const D=Math.round((i*s+o*e*(1-s))/u),l=Math.round((c*s+n*e*(1-s))/u),h=Math.round((I*s+d*e*(1-s))/u);return u=Math.min(255,Math.round(255*u)),r.pack(u,D,l,h)},a.ColorToLab=function(t){const[a,e,o,d]=r.unpack(t),[s,i,I]=n(e,o,d);return c(s,i,I)},a.LabToColor=function(t,a,e){const[r,n,s]=I(t,a,e),[i,c,u]=d(r,n,s);return o(i,c,u)},a.RGBToXYZ=n,a.XYZToRGB=d;const s=95.047,i=108.883;function c(t,a,e){let r=t/s,o=a/100,n=e/i;return r=r>.008856?Math.pow(r,1/3):7.787*r+16/116,o=o>.008856?Math.pow(o,1/3):7.787*o+16/116,n=n>.008856?Math.pow(n,1/3):7.787*n+16/116,[116*o-16,500*(r-o),200*(o-n)]}function I(t,a,e){let r=(t+16)/116,o=a/500+r,n=r-e/200;return o=Math.pow(o,3)>.008856?Math.pow(o,3):(o-16/116)/7.787,r=Math.pow(r,3)>.008856?Math.pow(r,3):(r-16/116)/7.787,n=Math.pow(n,3)>.008856?Math.pow(n,3):(n-16/116)/7.787,[o*s,100*r,n*i]}a.XYZToLab=c,a.LabToXYZ=I},210:(t,a,e)=>{Object.defineProperty(a,"__esModule",{value:!0}),a.I3DXDevice=a.I3DPT_TRIANGLEFAN=a.I3DPT_TRIANGLESTRIP=a.I3DPT_TRIANGLELIST=a.I3DPT_LINESTRIP=a.I3DPT_LINELIST=a.I3DPT_POINTLIST=a.I3DTS_PROJECTION=a.I3DTS_VIEW=a.I3DTS_WORLD=void 0;const r=e(555),o=e(138),n=e(31),d=e(573);a.I3DTS_WORLD="world",a.I3DTS_VIEW="view",a.I3DTS_PROJECTION="projection",a.I3DPT_POINTLIST=1,a.I3DPT_LINELIST=2,a.I3DPT_LINESTRIP=3,a.I3DPT_TRIANGLELIST=4,a.I3DPT_TRIANGLESTRIP=5,a.I3DPT_TRIANGLEFAN=6,a.I3DXDevice=class{constructor(t,e,r){this.WIDTH=e,this.HWIDTH=e/2,this.HEIGHT=r,this.HHEIGHT=r/2,this._canvas=document.createElement("canvas"),this._canvas.width=e,this._canvas.height=r,t.appendChild(this._canvas),this._ctx=this._canvas.getContext("2d"),this._backBuffer=this._ctx.createImageData(e,r);const o=d.I3DXMatrixLookAtLH(n.I3DXVector3(0,0,10),n.I3DXVector3(0,0,0),n.I3DXVector3(0,1,0)),s=d.I3DXMatrixPerspectiveFovLH(n.I3DXToRadian(45),e/r,1,100);this._transforms={[a.I3DTS_WORLD]:n.I3DXMatrixIdentity(4),[a.I3DTS_VIEW]:o,[a.I3DTS_PROJECTION]:s};const i=this.WIDTH*this.HEIGHT;this._zbufferData=new Int32Array(i),this._zbufferDepth=new Float32Array(i)}SetTransform(t,a){this._transforms[t]=a}MultiplyTransform(t,a){this._transforms[t]=n.I3DXMatrixMultiply(a,this._transforms[t])}BeginScene(){this.ZBufferClear(),this._backBuffer=this._ctx.createImageData(this.WIDTH,this.HEIGHT)}DrawPrimitive(t,e){let s;s=n.I3DXMatrixMultiply(this._transforms[a.I3DTS_VIEW],this._transforms[a.I3DTS_WORLD]),s=n.I3DXMatrixMultiply(this._transforms[a.I3DTS_PROJECTION],s);const i=n.I3DXVector3(0,0,1);switch(t){case a.I3DPT_POINTLIST:for(let t=0;t<e.length;t++){const a=n.I3DXMatrixMultiply(s,e[t].coordinates),r=a.data[0]/a.data[3],o=a.data[1]/a.data[3],d=a.data[2]/a.data[3];if(Math.abs(r)<=1&&Math.abs(o)<=1&&Math.abs(d)<=1){const a=Math.round((1-r)*this.HWIDTH),n=Math.round((1-o)*this.HHEIGHT);this.ZBufferSet(a,n,e[t].color,d)}}break;case a.I3DPT_LINELIST:case a.I3DPT_LINESTRIP:for(let o=0;o<e.length-1;o++){const d=e[o],i=e[o+1],c=n.I3DXMatrixMultiply(s,d.coordinates),I=n.I3DXMatrixMultiply(s,i.coordinates),u=c.data[0]/c.data[3],D=c.data[1]/c.data[3],l=c.data[2]/c.data[3],h=I.data[0]/I.data[3],X=I.data[1]/I.data[3],T=I.data[2]/I.data[3],[M,f,x,m]=r.unpack(e[o].color),[w,_,b,p]=r.unpack(e[o+1].color),S=w-M,L=_-f,R=b-x,v=p-m,A=t=>r.pack(Math.round(S*t+M),Math.round(L*t+f),Math.round(R*t+x),Math.round(v*t+m)),V=h-u,E=X-D,H=T-l,P=t=>[V*t+u,E*t+D,H*t+l],N=Math.round((1-u)*this.HWIDTH),y=Math.round((1-h)*this.HWIDTH),B=Math.abs(y-N);for(let t=0;t<=B;t++){const a=t/B,[e,r,o]=P(a),n=A(a);if(Math.abs(e)<1&&Math.abs(r)<1&&Math.abs(o)<1){const t=Math.round((1-e)*this.HWIDTH),a=Math.round((1-r)*this.HHEIGHT);this.ZBufferSet(t,a,n,o)}}t===a.I3DPT_LINELIST&&o++}break;case a.I3DPT_TRIANGLELIST:case a.I3DPT_TRIANGLESTRIP:case a.I3DPT_TRIANGLEFAN:for(let c=0;c<e.length-2;){let I,u,D;t===a.I3DPT_TRIANGLELIST?(I=c,u=c+1,D=c+2,c+=3):t===a.I3DPT_TRIANGLESTRIP?(I=c,u=c+1,D=c+2,c%2==1&&([u,D]=[D,u]),c++):(I=0,u=c+1,D=c+2,c++);const l=n.I3DXMatrixMultiply(s,e[I].coordinates),h=n.I3DXMatrixMultiply(s,e[u].coordinates),X=n.I3DXMatrixMultiply(s,e[D].coordinates),T=n.I3DXVector3(l.data[0]/l.data[3],l.data[1]/l.data[3],l.data[2]/l.data[3]),M=n.I3DXVector3(h.data[0]/h.data[3],h.data[1]/h.data[3],h.data[2]/h.data[3]),f=n.I3DXVector3(X.data[0]/X.data[3],X.data[1]/X.data[3],X.data[2]/X.data[3]),x=n.I3DXMatrixSubtract(M,T),m=n.I3DXMatrixSubtract(f,T),w=n.I3DXMatrixSubtract(f,M),_=n.I3DXMatrixSubtract(T,f),b=n.I3DXVectorUnit(n.I3DXVectorCross(x,m)),p=n.I3DXVectorDot(i,T),S=n.I3DXVectorDot(b,i);if(S<=0)continue;const L=Math.round((1-T.data[0])*this.HWIDTH),R=Math.round((1-T.data[1])*this.HHEIGHT),v=Math.round((1-M.data[0])*this.HWIDTH),A=Math.round((1-M.data[1])*this.HHEIGHT),V=Math.round((1-f.data[0])*this.HWIDTH),E=Math.round((1-f.data[1])*this.HHEIGHT),H=Math.max(Math.min(R,A,E),0),P=Math.min(Math.max(R,A,E),this.HEIGHT),N=Math.max(Math.min(L,v,V),0),y=Math.min(Math.max(L,v,V),this.WIDTH),[B]=r.unpack(e[I].color),G=o.ColorToLab(e[I].color),[k]=r.unpack(e[u].color),O=o.ColorToLab(e[u].color),[g]=r.unpack(e[u].color),W=o.ColorToLab(e[D].color);for(let t=H;t<=P;t++)for(let a=N;a<=y;a++){const e=1-a/this.HWIDTH,s=1-t/this.HHEIGHT,i=n.I3DXVector3(e,s,0),c=(p-n.I3DXVectorDot(b,i))/S,I=n.I3DXVector3(e,s,c);if(!(n.I3DXVectorDot(n.I3DXVectorCross(x,n.I3DXMatrixSubtract(I,T)),b)>=0&&n.I3DXVectorDot(n.I3DXVectorCross(w,n.I3DXMatrixSubtract(I,M)),b)>=0&&n.I3DXVectorDot(n.I3DXVectorCross(_,n.I3DXMatrixSubtract(I,f)),b)>=0))continue;const[u,D,l]=d.I3DXBarycentricCoords(a,t,L,R,v,A,V,E),h=G[0]*u+O[0]*D+W[0]*l,X=G[1]*u+O[1]*D+W[1]*l,m=G[2]*u+O[2]*D+W[2]*l,[H,P,N,y]=r.unpack(o.LabToColor(h,X,m)),C=r.pack(Math.round(B*u+k*D+g*l),P,N,y);this.ZBufferSet(a,t,C,c)}}}}EndScene(){const t=this.WIDTH*this.HEIGHT*4;for(let a=0;a<t;){const[t,e,o,n]=r.unpack(this._zbufferData[a/4]);this._backBuffer.data[a++]=e,this._backBuffer.data[a++]=o,this._backBuffer.data[a++]=n,this._backBuffer.data[a++]=t}}Present(){this._ctx.putImageData(this._backBuffer,0,0)}ZBufferSet(t,a,e,n){const d=this.WIDTH*(a-1)+t,s=this._zbufferDepth[d],i=this._zbufferData[d],[c]=r.unpack(i);if(c>=255&&s<n)return;const[I]=r.unpack(e);if(I>=255&&n<s||0===c)return this._zbufferData[d]=e,void(this._zbufferDepth[d]=n);this._zbufferData[d]=n>s?o.I3DXAlphaBlend(e,i):o.I3DXAlphaBlend(i,e),n<s&&(this._zbufferDepth[d]=n)}ZBufferClear(){const t=this.WIDTH*this.HEIGHT;this._zbufferData=new Int32Array(t),this._zbufferDepth=new Float32Array(t)}}},573:(t,a,e)=>{Object.defineProperty(a,"__esModule",{value:!0}),a.I3DXBarycentricCoords=a.I3DXMatrixOrthoLH=a.I3DXMatrixPerspectiveFovLH=a.I3DXMatrixLookToLH=a.I3DXMatrixLookAtLH=a.I3DXVertex=void 0;const r=e(31);function o(t,a,e){const o=r.I3DXVectorUnit(r.I3DXMatrixSubtract(a,t)),n=r.I3DXVectorUnit(r.I3DXVectorCross(e,o)),d=r.I3DXVectorCross(o,n),s=r.I3DXVectorDot(n,t),i=r.I3DXVectorDot(d,t),c=r.I3DXVectorDot(o,t);return new r.I3DXMatrix(4,4,[n.data[0],n.data[1],n.data[2],-s,d.data[0],d.data[1],d.data[2],-i,o.data[0],o.data[1],o.data[2],-c,0,0,0,1])}a.I3DXVertex=class{constructor(t,a,e,o){const n=r.I3DXVector(4,[t,a,e,1]);this.coordinates=n,this.color=o}},a.I3DXMatrixLookAtLH=o,a.I3DXMatrixLookToLH=function(t,a,e){return o(t,r.I3DXMatrixAdd(t,a),e)},a.I3DXMatrixPerspectiveFovLH=function(t,a,e,o){const n=1/Math.tan(t/2),d=n/a,s=o/(o-e);return new r.I3DXMatrix(4,4,[d,0,0,0,0,n,0,0,0,0,s,-e*s,0,0,1,0])},a.I3DXMatrixOrthoLH=function(t,a,e,o){const n=o-e;return new r.I3DXMatrix(4,4,[2/t,0,0,0,0,2/a,0,0,0,0,1/n,-e/n,0,0,0,1])},a.I3DXBarycentricCoords=function(t,a,e,r,o,n,d,s){const i=n-s,c=d-o,I=e-d,u=t-d,D=a-s,l=i*I+c*(r-s),h=(i*u+c*D)/l,X=((s-r)*u+I*D)/l;return[h,X,1-h-X]}},148:function(t,a,e){var r=this&&this.__createBinding||(Object.create?function(t,a,e,r){void 0===r&&(r=e),Object.defineProperty(t,r,{enumerable:!0,get:function(){return a[e]}})}:function(t,a,e,r){void 0===r&&(r=e),t[r]=a[e]}),o=this&&this.__exportStar||function(t,a){for(var e in t)"default"===e||Object.prototype.hasOwnProperty.call(a,e)||r(a,t,e)};Object.defineProperty(a,"__esModule",{value:!0}),o(e(138),a),o(e(210),a),o(e(573),a),o(e(31),a)},31:(t,a)=>{Object.defineProperty(a,"__esModule",{value:!0}),a.I3DXVectorUnit=a.I3DXVectorLength=a.I3DXVectorDot=a.I3DXVectorCross=a.I3DXVector3=a.I3DXVector=a.I3DXVec=a.I3DXMatrixScale=a.I3DXMatrixSubtract=a.I3DXMatrixAdd=a.I3DXMatrixMultiply=a.I3DXMatrixTranspose=a.I3DXRotateZMatrix=a.I3DXRotateYMatrix=a.I3DXRotateXMatrix=a.I3DXToRadian=a.I3DXScaleMatrix=a.I3DXTranslateMatrix=a.I3DXMatrixIdentity=a.I3DXMatrix=void 0;class e{constructor(t,a,e){if(void 0===a&&(a=t),this.rows=t,this.cols=a,e){if(e.length!==t*a)throw new Error("data does not match matrix dimension");this.data=Float32Array.from(e)}else this.data=new Float32Array(t*a)}_idx(t,a){return t*this.cols+a}get(t,a){return this.data[this._idx(t,a)]}set(t,a,e){this.data[this._idx(t,a)]=e}incr(t,a,e){this.data[this._idx(t,a)]+=e}debug(){const t=[];for(let a=0;a<this.rows;a++){t.push([]);for(let e=0;e<this.cols;e++)t[a].push(this.get(a,e))}console.table(t)}}function r(t){const a=new e(t,t);for(let e=0;e<t;e++)a.set(e,e,1);return a}function o(t,a){const r=new e(t.rows,t.cols),o=t.rows*t.cols;for(let e=0;e<o;e++)r.data[e]=t.data[e]*a;return r}a.I3DXMatrix=e,a.I3DXMatrixIdentity=r,a.I3DXTranslateMatrix=function(t,a,e){const o=r(4);return o.set(0,3,t),o.set(1,3,a),o.set(2,3,e),o},a.I3DXScaleMatrix=function(t,a,e){const o=r(4);return o.set(0,0,t),o.set(1,1,a),o.set(2,2,e),o},a.I3DXToRadian=function(t){return t/180*Math.PI},a.I3DXRotateXMatrix=function(t){const a=r(4),e=Math.cos(t),o=Math.sin(t);return a.set(1,1,e),a.set(1,2,-o),a.set(2,1,o),a.set(2,2,e),a},a.I3DXRotateYMatrix=function(t){const a=r(4),e=Math.cos(t),o=Math.sin(t);return a.set(0,0,e),a.set(0,2,o),a.set(2,0,-o),a.set(2,2,e),a},a.I3DXRotateZMatrix=function(t){const a=r(4),e=Math.cos(t),o=Math.sin(t);return a.set(0,0,e),a.set(0,1,-o),a.set(1,0,o),a.set(1,1,e),a},a.I3DXMatrixTranspose=function(t){const a=new e(t.cols,t.rows);for(let e=0;e<t.rows;e++)for(let r=0;r<t.cols;r++)a.set(r,e,t.get(e,r));return a},a.I3DXMatrixMultiply=function(t,a){if(t.cols!==a.rows){const e=`(${t.rows},${t.cols})`,r=`(${a.rows},${a.cols})`;throw new Error(`Matrices must be multiplicable! ${e}:${r}`)}const r=new e(t.rows,a.cols);if(3===t.rows&&3===t.cols&&3===a.rows&&3===a.cols)r.data[0]=t.data[0]*a.data[0]+t.data[1]*a.data[3]+t.data[2]*a.data[6],r.data[1]=t.data[0]*a.data[1]+t.data[1]*a.data[4]+t.data[2]*a.data[7],r.data[2]=t.data[0]*a.data[2]+t.data[1]*a.data[5]+t.data[2]*a.data[8],r.data[3]=t.data[3]*a.data[0]+t.data[4]*a.data[3]+t.data[5]*a.data[6],r.data[4]=t.data[3]*a.data[1]+t.data[4]*a.data[4]+t.data[5]*a.data[7],r.data[5]=t.data[3]*a.data[2]+t.data[4]*a.data[5]+t.data[5]*a.data[8],r.data[6]=t.data[6]*a.data[0]+t.data[7]*a.data[3]+t.data[8]*a.data[6],r.data[7]=t.data[6]*a.data[1]+t.data[7]*a.data[4]+t.data[8]*a.data[7],r.data[8]=t.data[6]*a.data[2]+t.data[7]*a.data[5]+t.data[8]*a.data[8];else if(4===t.rows&&4===t.cols&&4===a.rows&&4===a.cols)r.data[0]=t.data[0]*a.data[0]+t.data[1]*a.data[4]+t.data[2]*a.data[8]+t.data[3]*a.data[12],r.data[1]=t.data[0]*a.data[1]+t.data[1]*a.data[5]+t.data[2]*a.data[9]+t.data[3]*a.data[13],r.data[2]=t.data[0]*a.data[2]+t.data[1]*a.data[6]+t.data[2]*a.data[10]+t.data[3]*a.data[14],r.data[3]=t.data[0]*a.data[3]+t.data[1]*a.data[7]+t.data[2]*a.data[11]+t.data[3]*a.data[15],r.data[4]=t.data[4]*a.data[0]+t.data[5]*a.data[4]+t.data[6]*a.data[8]+t.data[7]*a.data[12],r.data[5]=t.data[4]*a.data[1]+t.data[5]*a.data[5]+t.data[6]*a.data[9]+t.data[7]*a.data[13],r.data[6]=t.data[4]*a.data[2]+t.data[5]*a.data[6]+t.data[6]*a.data[10]+t.data[7]*a.data[14],r.data[7]=t.data[4]*a.data[3]+t.data[5]*a.data[7]+t.data[6]*a.data[11]+t.data[7]*a.data[15],r.data[8]=t.data[8]*a.data[0]+t.data[9]*a.data[4]+t.data[10]*a.data[8]+t.data[11]*a.data[12],r.data[9]=t.data[8]*a.data[1]+t.data[9]*a.data[5]+t.data[10]*a.data[9]+t.data[11]*a.data[13],r.data[10]=t.data[8]*a.data[2]+t.data[9]*a.data[6]+t.data[10]*a.data[10]+t.data[11]*a.data[14],r.data[11]=t.data[8]*a.data[3]+t.data[9]*a.data[7]+t.data[10]*a.data[11]+t.data[11]*a.data[15],r.data[12]=t.data[12]*a.data[0]+t.data[13]*a.data[4]+t.data[14]*a.data[8]+t.data[15]*a.data[12],r.data[13]=t.data[12]*a.data[1]+t.data[13]*a.data[5]+t.data[14]*a.data[9]+t.data[15]*a.data[13],r.data[14]=t.data[12]*a.data[2]+t.data[13]*a.data[6]+t.data[14]*a.data[10]+t.data[15]*a.data[14],r.data[15]=t.data[12]*a.data[3]+t.data[13]*a.data[7]+t.data[14]*a.data[11]+t.data[15]*a.data[15];else for(let e=0;e<t.rows;e++)for(let o=0;o<a.cols;o++){let n=0;for(let r=0;r<t.cols;r++)n+=t.get(e,r)*a.get(r,o);r.set(e,o,n)}return r},a.I3DXMatrixAdd=function(t,a){if(t.rows!==a.rows||t.cols!==a.cols)throw new Error("Matrices must be the same size!");const r=new e(t.rows,t.cols),o=t.rows*t.cols;for(let e=0;e<o;e++)r.data[e]=t.data[e]+a.data[e];return r},a.I3DXMatrixSubtract=function(t,a){if(t.rows!==a.rows||t.cols!==a.cols)throw new Error("Matrices must be the same size!");const r=new e(t.rows,t.cols),o=t.rows*t.cols;for(let e=0;e<o;e++)r.data[e]=t.data[e]-a.data[e];return r},a.I3DXMatrixScale=o;class n extends e{constructor(t,a,e){super(t,a,e)}get x(){return this.data[0]}set x(t){this.data[0]=t}get y(){return this.data[1]}set y(t){this.data[1]=t}get z(){return this.data[2]}set z(t){this.data[2]=t}get w(){return this.data[3]}set w(t){this.data[3]=t}}function d(t,a){return new n(t,1,a)}function s(t,a){if(t.rows!==a.rows||t.cols!==a.cols)throw new Error("Vectors must be the same size!");let e=0;const r=t.rows*t.cols;for(let o=0;o<r;o++)e+=t.data[o]*a.data[o];return e}function i(t){return Math.sqrt(s(t,t))}a.I3DXVec=n,a.I3DXVector=d,a.I3DXVector3=function(t,a,e){return d(3,[t,a,e])},a.I3DXVectorCross=function(t,a){const e=d(3);return e.x=t.data[1]*a.data[2]-t.data[2]*a.data[1],e.y=t.data[2]*a.data[0]-t.data[0]*a.data[2],e.z=t.data[0]*a.data[1]-t.data[1]*a.data[0],e},a.I3DXVectorDot=s,a.I3DXVectorLength=i,a.I3DXVectorUnit=function(t){return o(t,1/i(t))}},555:(t,a)=>{Object.defineProperty(a,"__esModule",{value:!0}),a.sqr=a.unpack=a.pack=void 0,a.pack=function(t,a,e,r){return t<<24|a<<16|e<<8|r},a.unpack=function(t){return[(4278190080&t)>>>24,(16711680&t)>>>16,(65280&t)>>>8,255&t]},a.sqr=function(t){return t*t}}},a={};function e(r){var o=a[r];if(void 0!==o)return o.exports;var n=a[r]={exports:{}};return t[r].call(n.exports,n,n.exports,e),n.exports}(()=>{const t=e(148);!function(){const a=document.getElementById("indirect-container"),e=document.getElementById("camera-x"),r=document.getElementById("camera-y"),o=document.getElementById("camera-z"),n=document.getElementById("direction-x"),d=document.getElementById("direction-y"),s=document.getElementById("direction-z"),i=document.getElementById("fovy"),c=document.getElementById("red-depth-input"),I=document.getElementById("blue-depth-input"),u=[new t.I3DXVertex(-2.5,-3,0,t.ARGB(255,255,0,0)),new t.I3DXVertex(0,3,0,t.ARGB(255,0,255,0)),new t.I3DXVertex(2.5,-3,0,t.ARGB(255,0,0,255))],D=[new t.I3DXVertex(0,1,0,t.XRGB(255,255,255)),new t.I3DXVertex(-1,0,0,t.XRGB(255,64,64)),new t.I3DXVertex(0,0,-1,t.XRGB(255,255,64)),new t.I3DXVertex(1,0,0,t.XRGB(64,64,255)),new t.I3DXVertex(0,0,1,t.XRGB(64,255,64)),new t.I3DXVertex(-1,0,0,t.XRGB(255,64,64))],l=(new t.I3DXVertex(2.5,-3,0,t.ARGB(64,0,0,255)),new t.I3DXVertex(0,3,0,t.ARGB(64,0,0,255)),new t.I3DXVertex(-2.5,-3,0,t.ARGB(64,0,0,255)),t.I3DXMatrixIdentity(4)),h=t.I3DXVector3(0,1,0),X=[new t.I3DXVertex(0,0,0,t.ARGB(128,0,0,255)),new t.I3DXVertex(3,3,0,t.ARGB(128,0,0,255)),new t.I3DXVertex(6,0,0,t.ARGB(128,0,0,255))],T=[new t.I3DXVertex(0,0,0,t.XRGB(255,0,0)),new t.I3DXVertex(3,3,0,t.XRGB(255,0,0)),new t.I3DXVertex(6,0,0,t.XRGB(255,0,0))];let M=t.I3DXVector(4,[0,0,-1,0]);const f=t.I3DXMatrixLookToLH(t.I3DXVector3(e.valueAsNumber,r.valueAsNumber,o.valueAsNumber),t.I3DXVector3(M.data[0],M.data[1],M.data[2]),h),x=t.I3DXMatrixPerspectiveFovLH(t.I3DXToRadian(i.valueAsNumber),640/480,1,100),m=new t.I3DXDevice(a,640,480);m.SetTransform(t.I3DTS_VIEW,f),m.SetTransform(t.I3DTS_PROJECTION,x),m.SetTransform(t.I3DTS_WORLD,l);let w,_=0,b=!1;const p={KeyW:!1,KeyQ:!1,KeyE:!1,KeyS:!1,KeyA:!1,KeyD:!1};function S(){const a=Date.now(),f=a-w;if(m.BeginScene(),M=t.I3DXVectorUnit(t.I3DXVector(4,[n.valueAsNumber,d.valueAsNumber,s.valueAsNumber,1])),p.KeyA){const a=t.I3DXRotateYMatrix(.005*f);M=t.I3DXMatrixMultiply(a,M)}else if(p.KeyD){const a=t.I3DXRotateYMatrix(-.005*f);M=t.I3DXMatrixMultiply(a,M)}if(n.valueAsNumber=M.data[0],d.valueAsNumber=M.data[1],s.valueAsNumber=M.data[2],p.KeyW){const a=t.I3DXMatrixScale(M,.2*f);e.valueAsNumber+=a.data[0],r.valueAsNumber+=a.data[1],o.valueAsNumber+=a.data[2]}else if(p.KeyS){const a=t.I3DXMatrixScale(M,-.2*f);e.valueAsNumber+=a.data[0],r.valueAsNumber+=a.data[1],o.valueAsNumber+=a.data[2]}if(p.KeyQ){const a=t.I3DXVectorUnit(t.I3DXVectorCross(h,M)),n=t.I3DXMatrixScale(a,.2*f/10);e.valueAsNumber+=n.data[0],r.valueAsNumber+=n.data[1],o.valueAsNumber+=n.data[2]}else if(p.KeyE){const a=t.I3DXVectorUnit(t.I3DXVectorCross(h,M)),n=t.I3DXMatrixScale(a,-.2*f/10);e.valueAsNumber+=n.data[0],r.valueAsNumber+=n.data[1],o.valueAsNumber+=n.data[2]}const x=t.I3DXMatrixLookToLH(t.I3DXVector3(e.valueAsNumber,r.valueAsNumber,o.valueAsNumber),t.I3DXVector3(M.data[0],M.data[1],M.data[2]),h),L=t.I3DXMatrixPerspectiveFovLH(t.I3DXToRadian(i.valueAsNumber),640/480,1,100);m.SetTransform(t.I3DTS_VIEW,x),m.SetTransform(t.I3DTS_PROJECTION,L),m.SetTransform(t.I3DTS_WORLD,l);const R=I.valueAsNumber,v=t.I3DXTranslateMatrix(-9,2,R);m.SetTransform(t.I3DTS_WORLD,v),m.DrawPrimitive(t.I3DPT_TRIANGLELIST,X);const A=c.valueAsNumber,V=t.I3DXTranslateMatrix(-9,2,A);m.SetTransform(t.I3DTS_WORLD,V),m.DrawPrimitive(t.I3DPT_TRIANGLELIST,T);const E=t.I3DXTranslateMatrix(0,0,Math.sin(_/2));m.SetTransform(t.I3DTS_WORLD,E),m.DrawPrimitive(t.I3DPT_TRIANGLESTRIP,u),m.SetTransform(t.I3DTS_WORLD,l),m.DrawPrimitive(t.I3DPT_TRIANGLEFAN,D),m.EndScene(),m.Present(),_+=.005*f,b&&requestAnimationFrame(S),w=a}window.addEventListener("keydown",(function(t){t.code in p&&(p[t.code]=!0)})),window.addEventListener("keyup",(function(t){return t.code in p?p[t.code]=!1:"Enter"==t.code&&(b=!b,b&&(w=Date.now(),requestAnimationFrame(S))),t.preventDefault(),!1}),!0),m.BeginScene(),m.DrawPrimitive(t.I3DPT_TRIANGLESTRIP,u);const L=I.valueAsNumber,R=t.I3DXTranslateMatrix(-9,2,L);m.SetTransform(t.I3DTS_WORLD,R),m.DrawPrimitive(t.I3DPT_TRIANGLELIST,X);const v=c.valueAsNumber,A=t.I3DXTranslateMatrix(-9,2,v);m.SetTransform(t.I3DTS_WORLD,A),m.DrawPrimitive(t.I3DPT_TRIANGLELIST,T),m.EndScene(),m.Present()}()})()})();