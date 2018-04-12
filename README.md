# AISA
AISA is a Software 3D Engine written in TypeScript. The
only prerequisite for AISA to run properly is a HTML5 compatible web browser and a fast CPU (as you can guess JavaScript is not as fast as native code still it is running with a decent frame rate on my mobile phone). No WebGL is required.
AISA does all the computations needed to rasterize a 3D scene
in pure JavaScript by rendering to an offscreen framebuffer.
This framebuffer is then copied to the backing framebuffer of
a HTML Canvas that is setup as a render target.
### Why a Software 3D Engine in TypeScript / JavaScript?
In fact it does not make sense to write your own 3D Engine
in TypeScript since there are much better alternatvis like
WebGL and OpenGL. This project has a pure educational purpose.
My initial intention was to teach me some TypeScript and since
I love computer graphics and always wanted to write my own 3D
Engine from scratch I used this opportunity. Hence this
project contains a lot of elementary algorithms from then
field of computer graphics including clipping, triangle rasterization, geometric transformations and so forth.
### Demo
https://jdiemke.github.io/AISA/
### How to get
Type the following command into your shell:
```bash
> git clone https://github.com/jdiemke/AISA.git
```
This will create a copy of the repository in your current working directory. Move into the project's folder and install the dependecies:
```bash
> cd AISA
> npm install
```
### How to build
Type the following command into your shell:
```bash
> npm run build
```
Move into the project's `dist/` folder and open `index.html`.
### How to serve
Type the following command into your shell:
```bash
> npm run serve
```
And open `http://localhost:8080/webpack-dev-server/` in your favourite web browser.
### Features
- Post Processing
    - Noise
    - Glitch
    - Motion Blur
    - Radial Blur
    - Pixelization
    - Glow
- Sprites
    - Transparency
    - Linear Filtering
    - Bilinear Filtering
- Speed-Up Techniques
    - Backface Culling
    - View Frustum Culling
    - Bounding Volumes
        - Sphere
- Flat Shading
- Shadows
    - Projection Shadows
- Perspective Correct Texture Mapping
- Spherical Environment Mapping
- Near Plane & Viewport Clipping
- Lens Flare
- Billboarding
- Soft Particles
- Wavefront OBJ
- Camera
    - Controllable First Person Camera
    - Key Frame Animated Camera
- Web Audio API
### Backlog
- VFC with AABB Hierachies & PVS
- Configurable Clipping Regions (Sprites / Geometry)
- Procedural Textures
- Render To Texture
    - Compositing
    - Transitions (Alpha Fade)
    - Flashing
- Refactoring
    - Split Framebuffer.ts into multiple classes
    - Scenes / Effects / Core 3D Engine
- Bounding Volume Hierachies
- Bounding Volumes
    - Axis-Aligned Bounding Boxes (AABB)
    - Oriented Bounding Boxes (OBB)
- Quaternions
    - Spherical Linear Interpolation (SLERP)
- Perspective Projection Matrix
- Light Sources
    - Directional
    - Point Light
    - Spot Light
    - Ambient / Diffuse / Specular Color Components
- Transparency
- Water Relfection / Refraction
- Fog
- Particles Collision
- Planar Reflections
- Skybox
- Gouraud Shading
- Multitexturing
- MDL / MD2 Modells
- Material
- Shadow Mapping
- Pixel Shaders (Bump Mapping, Parallax Mapping)
### References
- http://www.jagregory.com/abrash-black-book/
- http://www.robotrenegade.com/articles/id-tech-3-optimization/index.html
- https://www.asc.ohio-state.edu/lewis.239/Gauge/abrash.pdf
- https://www.bluesnews.com/abrash/chap64.shtml
- http://www.cs.utah.edu/~jsnider/SeniorProj/BSP/default.htm
- https://pdfs.semanticscholar.org/262c/8e3d09822a477b62d7eba8766755dffa35be.pdf
- http://www.alsprogrammingresource.com/pvs_tutorial.html
- https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
- http://www.ecere.com/3dbhole/
- https://www.davrous.com/2013/06/21/tutorial-part-4-learning-how-to-write-a-3d-software-engine-in-c-ts-or-js-rasterization-z-buffering/
- http://joshbeam.com/articles/triangle_rasterization/
- http://forum.devmaster.net/t/advanced-rasterization/6145
