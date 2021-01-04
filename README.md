# AISA
[![Build Status](https://travis-ci.org/jdiemke/aisa.svg?branch=master)](https://travis-ci.org/jdiemke/aisa)
[![GitHub stars](https://img.shields.io/github/stars/jdiemke/aisa.svg)](https://github.com/jdiemke/aisa/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/jdiemke/aisa.svg)](https://github.com/jdiemke/aisa/network)
[![GitHub issues](https://img.shields.io/github/issues/jdiemke/aisa.svg)](https://github.com/jdiemke/aisa/issues)
[![GitHub license](https://img.shields.io/github/license/jdiemke/aisa.svg)](https://github.com/jdiemke/aisa/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/jdiemke/aisa.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fjdiemke%2Faisa)

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
### Demos
* [2D Bump Mapping](https://jdiemke.github.io/aisa/bump.html)
* [Third Person Camera](https://jdiemke.github.io/aisa/third-person-camera.html)
* [Abstract Cube](https://jdiemke.github.io/aisa/abstract-cube.html)
* [Baked Lighting](https://jdiemke.github.io/aisa/baked-lighting.html)
* [Block Fade](https://jdiemke.github.io/aisa/block-fade.html)
* [Bobs](https://jdiemke.github.io/aisa/bobs.html)
* [Cinematic Scroller](https://jdiemke.github.io/aisa/cinematic-scroller.html)
* [Cube Tunnel](https://jdiemke.github.io/aisa/cube-tunnel.html)
* [Cube](https://jdiemke.github.io/aisa/cube.html)
* [Cubes](https://jdiemke.github.io/aisa/voxel-balls.html)
* [Distorted Sphere](https://jdiemke.github.io/aisa/distorted-sphere.html)
* [DOF Balls](https://jdiemke.github.io/aisa/dof-balls.html)
* [Fire](https://jdiemke.github.io/aisa/fire.html)
* [Flood Fill](https://jdiemke.github.io/aisa/flood-fill.html)
* [Frustum Culling](https://jdiemke.github.io/aisa/frustum-culling.html)
* [Gears](https://jdiemke.github.io/aisa/gears.html)
* [Hoodlum](https://jdiemke.github.io/aisa/hoodlum.html)
* [LED Plasma](https://jdiemke.github.io/aisa/led-plasma.html)
* [Lens](https://jdiemke.github.io/aisa/lens.html)
* [Metaballs](https://jdiemke.github.io/aisa/metaballs.html)
* [Metalheadz](https://jdiemke.github.io/aisa/metalheadz.html)
* [Misc](https://jdiemke.github.io/aisa/misc.html)
* [Moving Torus](https://jdiemke.github.io/aisa/moving-torus.html)
* [Particle Streams](https://jdiemke.github.io/aisa/particle-streams.html)
* [Particle System](https://jdiemke.github.io/aisa/particle-system.html)
* [Particle Torus](https://jdiemke.github.io/aisa/particle-torus.html)
* [Pixel Effect](https://jdiemke.github.io/aisa/pixel-effect.html)
* [Plane Deformation](https://jdiemke.github.io/aisa/plane-deformation.html)
* [Plane Deformation Floor](https://jdiemke.github.io/aisa/plane-deformation-floor.html)
* [Plane Deformation Tunnel](https://jdiemke.github.io/aisa/plane-deformation-tunnel.html)
* [Plasma](https://jdiemke.github.io/aisa/plasma.html)
* [Platonian](https://jdiemke.github.io/aisa/platonian.html)
* [Polar Voxel Landscape](https://jdiemke.github.io/aisa/polar-voxels.html)
* [Portal Engine](https://jdiemke.github.io/aisa/portals.html)
* [Quake 1 Model](https://jdiemke.github.io/aisa/mdl.html)
* [Quake 2 Model (Dr. Freak)](https://jdiemke.github.io/aisa/md2.html)
* [Quake 2 Model (Ratamahatta)](https://jdiemke.github.io/aisa/other-md2.html)
* [Razor Scene](https://jdiemke.github.io/aisa/razor.html)
* [Rotating Gears (w. XM Music)](https://jdiemke.github.io/aisa/rotating-gears.html)
* [Roto Zoomer](https://jdiemke.github.io/aisa/roto-zoomer.html)
* [Scrolling Background](https://jdiemke.github.io/aisa/scrolling-background.html)
* [Sine Scroller (w. XM Music)](https://jdiemke.github.io/aisa/sine-scroller.html)
* [SNES Mode7](https://jdiemke.github.io/aisa/mode-7.html)
* [Stanford Bunny](https://jdiemke.github.io/aisa/bunny.html)
* [Stanford Dragon](https://jdiemke.github.io/aisa/wavefront.html)
* [Starfield](https://jdiemke.github.io/aisa/starfield.html)
* [Textured Torus](https://jdiemke.github.io/aisa/textured-torus.html)
* [Titan Effect](https://jdiemke.github.io/aisa/titan-effect.html)
* [Torus Knot Tunnel](https://jdiemke.github.io/aisa/torus-knot-tunnel.html)
* [Torus Knot](https://jdiemke.github.io/aisa/torus-knot.html)
* [Torus](https://jdiemke.github.io/aisa/torus.html)
* [Toxic Dots](https://jdiemke.github.io/aisa/toxic-dots.html)
* [Twister](https://jdiemke.github.io/aisa/twister.html)
* [Voxel Landscape Fade](https://jdiemke.github.io/aisa/voxel-landscape-fade.html)
* [Voxel Landscape](https://jdiemke.github.io/aisa/voxel-landscape.html)
* [Wavefront OBJ with Texture](https://jdiemke.github.io/aisa/wavefront-texture.html)
* [Wobble Tunnel](https://jdiemke.github.io/aisa/tunnel.html)
* [Wobble](https://jdiemke.github.io/aisa/titan-effect.html)

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
- Light & Material
    - Directional Light
    - Point Light
    - Spot Light
    - Ambient / Diffuse / Specular Color Components
- Model Loading
    - Wavefront OBJ (JSON)
    - MD2 (Quake 2)
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
- Camera
    - Controllable First Person Camera
    - Key Frame Animated Camera
- Web Audio API
### Backlog
- Generalized Perspective Correct Vertex Attribute Interpolation
    - https://computergraphics.stackexchange.com/questions/4079/perspective-correct-texture-mapping
    - http://www.flipcode.com/archives/The_Art_of_Demomaking-Issue_14_Perspective_Correct_Texture_Mapping.shtml
    - http://www.lysator.liu.se/~mikaelk/doc/perspectivetexture/
    - http://web.cs.ucdavis.edu/~amenta/s12/perspectiveCorrect.pdf
- Milkshape 3D Skeletal Animation
- Wavefront OBJ (TXT)
- Subpixel Accuracy (Lines and Polygons)
- VFC with AABB Hierachies & PVS
- Configurable Clipping Regions (Sprites / Geometry)
- Procedural Textures
- Render To Texture
    - Compositing
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

### Tools used
- https://github.com/dmnsgn/canvas-record
- https://github.com/mrdoob/stats.js
- https://github.com/a1k0n/jsxm
- https://github.com/rocket/rocket

### References
- Portals & PVS
    - Doom 3 Portal Rendering Code: https://github.com/id-Software/DOOM-3-BFG/blob/1caba1979589971b5ed44e315d9ead30b278d8b4/neo/renderer/RenderWorld_portals.cpp
    - http://fabiensanglard.net/doom3/renderer.php
    - https://gist.github.com/aeroson/b4b8b4a4b11ef5549a40
    - https://www.iddevnet.com/doom3/visportals.php
    - https://gamebanana.com/articles/72
    - http://www.gamasutra.com/features/20060417/Anderson_Thesis.pdf
    - https://www.bc.edu/content/dam/files/schools/cas_sites/cs/pdf/academics/honors/04DerekCarr.pdf
    - http://www.alsprogrammingresource.com/pvs_tutorial.html
    - http://www.cs.utah.edu/~jsnider/SeniorProj/BSP/default.htm
    - http://www.jagregory.com/abrash-black-book/
    - http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.96.7085&rep=rep1&type=pdf
    - http://www.luki.webzdarma.cz/eng_06_en.htm
    - https://www.bluesnews.com/abrash/chap64.shtml
    - https://bwravencl.de/Bachelorarbeit.pdf
- https://www.gamedev.net/articles/programming/general-and-gameplay-programming/frustum-culling-r4613/
- http://archive.gamedev.net/archive/reference/programming/features/bsptree/bsp.pdf
- http://www.cs.virginia.edu/%7Eluebke/publications/portals.html
- https://nothings.org/gamedev/thief_rendering.html
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
- http://www.gamers.org/dEngine/quake/papers/ddjclip.html
- http://www.jagregory.com/abrash-black-book/#chapter-65-3-d-clipping-and-other-thoughts
- http://downloads.gamedev.net/pdf/gpbb/gpbb65.pdf
- http://www.cubic.org/docs/3dclip.htm
- http://fabiensanglard.net/polygon_codec/
- http://fabiensanglard.net/quake2/quake2_software_renderer.php
- http://www.xbdev.net/maths_of_3d/rasterization/clipping/index.php
- http://www.gamasutra.com/view/news/168577/Indepth_Software_rasterizer_and_triangle_clipping.php
- https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/projection-matrix-GPU-rendering-pipeline-clipping
- http://www.songho.ca/opengl/gl_pipeline.html
- http://www.songho.ca/opengl/gl_transform.html
- http://www.songho.ca/opengl/gl_camera.html
- http://www.songho.ca/opengl/gl_matrix.html
- http://www.songho.ca/math/homogeneous/homogeneous.html
- http://www.hugi.scene.org/online/coding/hugi%20se%204%20-%20index%20sorted%20by%20topic.htm
- http://www.flipcode.com/archives/The_Art_of_Demomaking-Issue_01_Prologue.shtml
- http://insolitdust.sourceforge.net/code.html
- http://www.wab.com/screen.php?screen=20
- http://www.helixsoft.nl/articles/circle/sincos.htm
- https://gamedev.stackexchange.com/questions/24957/doing-an-snes-mode-7-affine-transform-effect-in-pygame
- https://www.coranac.com/tonc/text/mode7ex.htm
- http://codeincomplete.com/posts/javascript-racer-v1-straight/
- http://www.extentofthejam.com/pseudo/
- http://hugi.scene.org/online/hugi24/coding%20graphics%20bonz%20sines%20and%20cosines%20for%20fun%20and%20profit.htm
- https://www.phatcode.net/res/224/files/html/ch65/65-03.html#Heading6
- https://mikro.naprvyraz.sk/docs/
- http://simonstechblog.blogspot.de/2012/04/software-rasterizer-part-1.html
- http://www.lysator.liu.se/~mikaelk/doc/perspectivetexture/
- http://chrishecker.com/Miscellaneous_Technical_Articles
- http://www.gamasutra.com/blogs/MichaelKissner/20160112/263097/Writing_a_Game_Engine_from_Scratch__Part_4_Graphics_Library.php
- https://www.codeproject.com/Articles/170296/D-Software-Rendering-Engine-Part-I
- https://www.davrous.com/2013/06/13/tutorial-series-learning-how-to-write-a-3d-soft-engine-from-scratch-in-c-typescript-or-javascript/
- https://www.youtube.com/playlist?list=PLEETnX-uPtBXP_B2yupUKlflXBznWIlL5
- https://www.youtube.com/watch?v=cQY3WTKRI7I
- https://www.youtube.com/playlist?list=PLEETnX-uPtBUbVOok816vTl1K9vV1GgH5
- https://www.youtube.com/playlist?list=PLEETnX-uPtBUG4iRqc6bEBv5uxMXswlEL
- https://www.youtube.com/playlist?list=PLbCDZQXIq7uYaf263gr-zb0wZGoCL-T5G
- https://www.youtube.com/watch?v=9A5TVh6kPLA
- http://joshbeam.com/articles/triangle_rasterization/
- http://developers-club.com/posts/257107/
- https://www.codeproject.com/Articles/170296/3D-Software-Rendering-Engine-Part-I
- https://gamedev.stackexchange.com/questions/44263/fast-software-color-interpolating-triangle-rasterization-technique
- https://fgiesen.wordpress.com/2011/07/05/a-trip-through-the-graphics-pipeline-2011-part-5/
- http://insolitdust.sourceforge.net/code.html
- https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/opengl-perspective-projection-matrix
- http://www.flipcode.com/archives/articles.shtml
- http://lodev.org/cgtutor/
- http://lodev.org/cgtutor/lineclipping.html
- http://www.hugi.scene.org/online/coding/
- https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/perspective-correct-interpolation-vertex-attributes
- http://simonstechblog.blogspot.de/2012/04/software-rasterizer-part-2.html
- https://www.scratchapixel.com/lessons/3d-basic-rendering/rendering-3d-scene-overview
- http://www.sunshine2k.de/coding/java/TriangleRasterization/TriangleRasterization.html
- https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/visibility-problem-depth-buffer-depth-interpolation
- https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/perspective-correct-interpolation-vertex-attributes
- https://gamedev.stackexchange.com/questions/38213/depth-interpolation-for-z-buffer-with-scanline
- https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-shading/shading-normals
- https://www.scratchapixel.com/lessons/3d-basic-rendering/transforming-objects-using-matrices
- https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-polygon-mesh
- https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix
- https://www.scratchapixel.com/lessons/3d-basic-rendering/3d-viewing-pinhole-camera
- https://www.scratchapixel.com/lessons/3d-basic-rendering/computing-pixel-coordinates-of-3d-point/mathematics-computing-2d-coordinates-of-3d-points
- https://www.ntu.edu.sg/home/ehchua/programming/opengl/CG_BasicsTheory.html
- http://www.songho.ca/index.html
- https://en.wikipedia.org/wiki/Graphics_pipeline
- https://en.wikipedia.org/wiki/Clipping_(computer_graphics)
- https://www.ntu.edu.sg/home/ehchua/programming/opengl/CG_BasicsTheory.html
- http://www.gamasutra.com/blogs/MichaelKissner/20160112/263097/Writing_a_Game_Engine_from_Scratch__Part_4_Graphics_Library.php
- https://developer.tizen.org/development/guides/native-application/graphics/opengl-es/primitive-assembly-and-rasterization
- http://www.sunshine2k.de/coding/java/SutherlandHodgman/SutherlandHodgman.html
- http://www.cubic.org/docs/3dclip.htm
