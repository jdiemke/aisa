# Demo Specs

## Resolution

The demo renders at a deliberately low-resolution **384 × 216** pixels

This is exactly one-fifth of an HD 1920 × 1080 frame, giving a chunky pixel-art aesthetic while filling the screen edge to edge when upscaled.

---

## 3D Models

The engine supports the following 3D asset formats:

| Format | Extension | Notes |
|---|---|---|
| Quake II MD2 | `.md2` | Keyframe-animated vertex models; single skin texture |
| Quake MDL | `.mdl` | Original Quake model format |
| Wavefront OBJ | `.obj` | Static meshes; triangles only; single texture |
| Wavefront OBJ + MTL | `.obj` + `.mtl` | Static meshes with per-face Phong materials (Ka/Kd/Ks/Ns) |
| GLB (Binary glTF 2.0) | `.glb` | Static meshes with PBR metallic-roughness materials; node transforms (TRS / matrix); doubleSided support |
| Blender JSON | `.json` | Custom export of Blender scenes (vertices, faces, UVs, baked lighting) |

### Constraints
- Geometry must be **triangulated** — no quads or n-gons.
- Each mesh supports **one texture** per object.
- Baked lighting data can be embedded in the Blender JSON export.
- Camera animations can be exported from Blender as a JSON camera-path file and played back via `BlenderCameraAnimator`.

---

## Graphics

All 2D image assets (textures, sprites, backgrounds, overlays) should be provided as **PNG** files.

---

## Music

The demo uses `SoundManager`, a browser-based audio system backed by [Cowbell](https://github.com/demoscene-compat-pack/cowbell) and synchronised with [JS Rocket](https://github.com/rocket/rocket).

### Supported Audio Formats

Format detection is automatic based on file extension (`SoundManager.loadMusic`):

| Format | Extension | Player backend |
|---|---|---|
| Impulse Tracker | `.it` | `Cowbell.Player.OpenMPT` (libopenmpt WebAssembly) |
| FastTracker 2 Extended Module | `.xm` | `Cowbell.Player.OpenMPT` (libopenmpt WebAssembly) |
| ScreamTracker 3 | `.s3m` | `Cowbell.Player.OpenMPT` (libopenmpt WebAssembly) |
| ProTracker Module | `.mod` | `Cowbell.Player.OpenMPT` (libopenmpt WebAssembly) |
| Ogg Vorbis | `.ogg` | `Cowbell.Player.Audio` (HTML5 Audio API) |
| MP3 | `.mp3` | `Cowbell.Player.Audio` (HTML5 Audio API) |

### Sync — JS Rocket

Music synchronisation is driven by JS Rocket. The sync mode is selected at startup:

| Mode | How it works |
|---|---|
| **Demo / release mode** | Loads a pre-exported `.rocket` XML file; no editor needed |
| **Edit mode** | Connects live to the Rocket editor app over a local socket |

The following named tracks are read from the Rocket timeline each frame via `SoundManager.updateMusic`:

| Track name | Purpose |
|---|---|
| `effect` | Active scene / effect index |
| `transitionType` | Type of transition between scenes |
| `transitionValue` | Progress value of the current transition |
| `snare` | Snare-hit trigger value for beat-reactive effects |
| `bass` | Bass-level value for low-frequency reactive effects |

