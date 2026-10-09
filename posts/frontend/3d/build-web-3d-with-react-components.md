# Build Web 3D with React Components

![React Three Lite](/assets/frontend/3d/00-logo.png)

You know the request.

“Add a rotating product model to the landing page.”
“Put a particle rain effect on the hero — make it feel futuristic.”
“We want a smart-city 3D dashboard.”

Sounds easy enough. Then you open the Three.js docs and meet the entire construction crew: renderer, camera, lights, controls, materials, the animation loop, resize handling, resource disposal… **Half a day later, the screen is still blank.**

That learning curve has scared away too many front-end developers from bringing 3D into their products.

**React Three Lite (R3L)** exists to tear that wall down — wrapping Three.js’s tricky setup and everyday capabilities into the React components you already know. Declarative JSX, a few lines, and a complete 3D world is running.

## One `<Scene>` is a whole world

```jsx
import { Scene, GLTFLoader } from 'react-three-lite'

function App() {
  return (
    <Scene style={{ width: '100%', height: '300px' }}>
      <GLTFLoader modelUrl="/models/model.glb" />
    </Scene>
  )
}
```

Mounting it automatically wires up the renderer, camera, lights, and OrbitControls. The Perseverance rover below is the real effect of auto-rotating a GLTF model with `ModelRotator`:

![Perseverance rover model auto-rotating](/assets/frontend/3d/01-model.gif)

The model loaders also ship with IndexedDB caching — repeat visits read straight from local storage, and GLTF / FBX / OBJ plus Draco compression are all supported.

## Write once, run on both WebGPU and WebGL

R3L’s boldest bet: **WebGPU is the default renderer**, while the WebGL backend is fully preserved, with automatic fallback when it isn’t available.

```jsx
<Scene />                        // WebGPU (default)
<Scene rendererType="webgl" />   // WebGL
```

One prop to switch. Every demo in the docs ships with WebGPU / WebGL tabs — **what you see is what’s tested.**

## The effects toolbox: blockbuster quality without writing shaders

For digital twins, product showcases, and campaign pages, effects are often the “texture dividing line.” R3L ships a set verified on both renderers:

![Bloom post-processing glow](/assets/frontend/3d/02-bloom.gif)

![Model sweep-light effect](/assets/frontend/3d/04-sweep.gif)

Environment and weather are just as ready out of the box — a six-face skybox adds instant depth, and shader-powered particle rain and snow bring wind distortion and drifting motion:

![Six-face skybox environment](/assets/frontend/3d/10-skybox.gif)

![Particle rain effect](/assets/frontend/3d/03-rain.gif)

![Particle snow effect](/assets/frontend/3d/11-snow.gif)

And the data-visualization meshes come along too — ripple circles and flow lines, giving you that “breathing” feel without hand-writing shaders:

![Ripple-circle data-visualization mesh](/assets/frontend/3d/08-wavecircle.gif)

![Flow-line data-visualization mesh](/assets/frontend/3d/09-flowline.gif)

## The 0.6.0 headline: bringing 3D GIS maps into React

The most exciting part of this release is a complete, out-of-the-box set of **3D geographic capabilities**:

- **GeoReference**: built-in WGS84 / GCJ02 / BD09 datum conversion and local projection
- **TileLayer**: standard XYZ raster tiles from OpenStreetMap, AMap, Tianditu, and more — just write a URL template
- **GeoObject**: pass in a longitude/latitude and drop a 3D marker straight onto the map
- **GeoJsonLayer**: render GeoJSON data into 3D features in one step

The tile layer **follows the camera** by default — the region where the frustum meets the ground is sliced automatically, loading and recycling in real time as you pan, zoom, and orbit. Images decode on a worker thread, redundant mipmaps are disabled, and new tiles cross-fade over their coarse parents in 300ms… performance and visual polish refined to the standard of a mature map engine.

![3D city tile map with location markers](/assets/frontend/3d/05-tilelayer.gif)

## A 3D scene shouldn’t just be looked at — it should be clicked

- **Callout**: annotations with leader lines; the anchor tracks the camera
- **Popup**: CSS2D-based 3D popups that can host any React component
- **Movable**: let scene elements be dragged
- **Picking**: picking made easy, so click-to-select is effortless

![3D annotation with leader line](/assets/frontend/3d/06-callout.gif)

![3D popup hosting a React component](/assets/frontend/3d/07-popup.gif)

## Get started in three steps

```bash
pnpm i three react-three-lite
```

```jsx
import { Scene } from 'react-three-lite'

export default function App() {
  return <Scene style={{ width: '100%', height: '300px' }} />
}
```

## Who it’s for

- Front-end engineers who need to ship **3D product pages / campaign pages** fast
- Teams building **digital twins, smart-city, and 3D GIS dashboards**
- Anyone who wants 3D in a React project without configuring Three.js from scratch
- Teachers, prototypers, and indie developers who value their time

---

3D on the web shouldn’t be the private playground of graphics specialists. When the renderer, lights, controls, effects, and maps are all polished and delivered to you the React way, **the only thing left to focus on is the world you want to create.**

**React Three Lite 0.6.0 is out** — stars, trials, and issues are all welcome.

- Docs (with every runnable demo): https://r3l.sunquakes.com
- GitHub: https://github.com/sunquakes/react-three-lite
- NPM: `pnpm i react-three-lite`
- License: Apache-2.0, free for commercial use
