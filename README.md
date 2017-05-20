# AISA
AISA is a Software 3D Engine written in TypeScript 2.2
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
### Backlog
- Vertex shading (flat, gouraud, phong)
- Texture mapping
- Light sources
- Material
- Shadows (Projection Shadows, Shadow Mapping)
- Environment mapping
- 4x4 homogenous matrices
- Camera
- Pixel shaders (bump mapping, parallax mapping)
- Clipping
- Frustum culling
- Lens flare
