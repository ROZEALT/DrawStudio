⚡ Overview

DrawStudio is a cross-platform, high-performance drawing application inspired by apps like ibis Paint, Procreate, and Medibang.
It focuses on GPU-accelerated rendering, smooth stylus input, multi-layer editing, and powerful brush engines.

This project aims to provide a fast, responsive digital art experience with professional features accessible to everyone.

✨ Features
🎨 Brush Engine

Textured & procedural brushes

Pressure & tilt sensitivity

Stroke smoothing & stabilization

Custom brush settings (size, opacity, spacing, jitter)

🖼️ Layers System

Unlimited layers (device-dependent)

Rename, reorder, merge layers

Opacity control

Blend modes

Individual layer raster textures

🖊️ Input Handling

Full stylus support:

Apple Pencil

Android stylus (S-Pen, USI, etc.)

Touch + stylus palm rejection

High-frequency sampling

Velocity & pressure smoothing

⚙️ Rendering Engine

GPU-accelerated Metal / OpenGL / WebGL code

Multi-layer compositing

Tile-based rendering for large canvases

Optimized for low latency and high frame rate

💾 Project System

Auto-saving

Export to PNG / JPEG

Layered export (PSD or custom format)

Custom .yourapp project files

🔧 Optional Add-Ons (Future)

Cloud sync

Community brush packs

Paid premium features (subscriptions or one-time)

🏗️ Architecture
src/
 ├─ core/
 │   ├─ renderer/         # GPU brush + tile renderer
 │   ├─ layers/           # Layer manager + blend mode compositing
 │   ├─ input/            # Stylus/touch event handling
 │   ├─ brushes/          # Brush engines, textures, parameters
 │   ├─ undo/             # Tile-based undo/redo system
 │   └─ fileformat/       # Project save/load (JSON + PNG tiles)
 ├─ ui/
 │   ├─ canvas/           # Zoom, pan, rotate, HUD
 │   ├─ tools/            # Brush picker, color picker, menus
 │   └─ panels/           # Layers panel, settings, exports
 └─ platform/
     ├─ ios/              # Metal renderer + Apple Pencil integration
     └─ android/          # OpenGL/Vulkan renderer + stylus events

🛠️ Tech Stack
Choose based on platform:
iOS (Swift)

Metal

PencilKit or low-level UITouch

Core Graphics for utilities

Android (Kotlin/Java)

OpenGL ES or Vulkan

MotionEvent stylus API

Jetpack libraries

Web Version (Optional)

TypeScript

WebGL / WebGPU

OffscreenCanvas for performance

Cross-Platform Option

Flutter + native rendering modules

React Native + GL bindings

C++ core engine + platform UI layer

🔄 Undo/Redo System

Uses tile snapshots:

- Canvas split into tiles (e.g., 256×256)
- Before modifying a tile → store original tile
- Push tile delta into history stack


This makes undo extremely fast, even on huge canvases.

📁 File Format
Project structure (.yourapp)

A zipped directory:

project/
 ├─ meta.json        # canvas size, layers, history metadata
 ├─ layers/
 │    ├─ 0.png
 │    ├─ 1.png
 │    └─ ...
 └─ thumbnails/      # quick preview images

Exports

PNG (lossless)

JPEG (compressed)

PSD (layered export; optional)

🚀 Roadmap
MVP

Basic brush

Canvas drawing

Simple layers

Undo/redo

PNG export

v1.0

Full brush engine

GPU-accelerated renderer

Stylus pressure

Layer blending modes

File saving/loading

v2.0

Advanced brushes

PSD support

Cloud sync

Custom brush packs

Animation timeline (optional)

🤝 Contributing

Contributions are welcome!
Submit issues, feature requests, or PRs.

📜 License

Choose a license such as:

MIT

Apache 2.0

GPLv3

(MIT is recommended for open apps.)

⭐ Support

If you like this project, consider starring the repository!
