import type { DocChapter } from '@/types/docs';

export const docsToolsMediaEn: DocChapter[] = [
  {
    id: 'pin-scroll',
    categoryId: 'pin-scroll',
    title: 'Pinned Windows, Scroll Capture & History',
    summary:
      'Lossless always-on-top pins, direct text selection inside pins, sticky-header-aware scroll stitching, and bounded capture history.',
    sections: [
      {
        id: 'pin-interactions',
        heading: 'Pinned Window Interactions',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Create a pin from the editor via Ctrl+P, from a file via mark-shot --pin-image <path>, or from clipboard images and plain text via mark-shot --pin-clipboard. Re-entering the editor from a pin temporarily hides the source pin and restores it when finished.',
              'Regardless of current zoom level on screen, copying or saving a pin always exports raw unscaled pixels. After running OCR on a pin, drag across text directly on the pinned canvas and press Ctrl+C to copy.',
            ],
          },
          {
            kind: 'keyGrid',
            items: [
              { keys: 'Left-drag', action: 'Move the pinned window anywhere on screen' },
              { keys: 'Wheel / Drag edge', action: 'Proportional zoom centered around the pointer' },
              { keys: 'Double-click', action: 'Close the pinned window immediately' },
              { keys: 'Ctrl + V', action: 'Spawn another independent pinned window from clipboard' },
              { keys: 'Right-click menu', action: 'Rotate, reset scale, toggle top-most, re-edit, OCR, translate, scan QR, save as' },
            ],
          },
        ],
      },
      {
        id: 'scroll-and-history',
        heading: 'Scrolling Capture & History Retention',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Launch mark-shot --scroll or press Ctrl+Shift+S after selecting a region. Scroll steadily inside the highlighted selection; a borderless dual-preview panel shows both the detail view and the full stitched overview alongside live +px stitch increments, retaining fixed headers and footers only once. If rapid scrolling leaves insufficient overlap, an inline prompt guides a slight rollback.',
              'Completed captures are indexed automatically (canceled captures are never stored). Press Ctrl+H or run mark-shot --history to copy, pin, save as (via XDG FileChooser portal on Linux or IFileSaveDialog on Windows), re-edit, or purge items. Retention defaults to 50 captures capped at 256 MiB.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'annotation',
    categoryId: 'annotation',
    title: '19 Annotation Tools, Modifiers & Export Frame',
    summary:
      'Detailed mechanics for bendable concave arrows, 7-style step badges, raw-pixel filters, linked tangent magnifiers, pixel/angle rulers, and rounded shadow frames.',
    sections: [
      {
        id: 'annotation-details',
        heading: 'Drawing & Measurement Mechanics',
        blocks: [
          {
            kind: 'screenshot',
            src: '/images/real-selected-annotation.png',
            alt: 'Selected annotation with padded orange handles and rotation stem',
            caption: 'Pressing Pick (V) reveals a padded dashed bounding box, top rotation stem, and red delete button without obscuring stroke thickness.',
          },
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: 'Line (D) & Arrow (A)',
                badge: 'Bendable Curves',
                detail: 'Concave straight, solid triangle, and open heads across solid/dashed/dotted strokes; double-click with Pick (V) to insert curve control points.',
              },
              {
                term: 'Rectangle (R), Ellipse (C) & Shapes (K)',
                badge: '24 Preset Shapes',
                detail: 'Outline or translucent fill, pixel corner radius R stepper, and 1:1 or Shift square/circle locking.',
              },
              {
                term: 'Step (N) & Numbered Arrow (Shift+N)',
                badge: '7 Numeral Systems',
                detail: 'Supports 123, upper/lower letters, upper/lower Roman numerals, Heavenly Stems, and CJK numerals with optional dragged arrow tails.',
              },
              {
                term: 'Redact & Spotlight Filters (M / X)',
                badge: 'Intensity 4-48',
                detail: 'Pixelate, frosted blur, grayscale, invert, brighten, plus rectangular and elliptical Spotlight dimming (multiple focus regions combine into a single mask without stacking darkness).',
              },
              {
                term: 'Linked Dual-Frame Magnifier (Z)',
                badge: '1.25x - 6.00x',
                detail: 'Drag to create source and zoomed lens frames (circle or square) linked by outer tangents; resizing either frame scales the partner proportionally.',
              },
              {
                term: 'Pixel Ruler (U) & Laser (G)',
                badge: 'Length / Angle',
                detail: 'Displays width, height, diagonal, and area in image pixels (press U again for angle mode). Laser strokes fade after two seconds without entering undo.',
              },
            ],
          },
        ],
      },
      {
        id: 'annotation-modifiers-frame',
        heading: 'Modifiers, Canvas Pan/Zoom & Rounded Export Frame',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Hold Shift while drawing or rotating to snap angles to 45-degree increments. Press [ and ] (or roll the wheel while a drawing tool is active) to adjust stroke width or font size. In Pick mode, wheel-zooms the canvas, middle-drag pans, double-tapping Ctrl resets view, and Space hides toolbars.',
              'Enable export frames to wrap saved or copied captures with transparent padding, 18px rounded corners, and a soft drop shadow while keeping on-screen pins unframed:',
            ],
          },
          {
            kind: 'code',
            label: 'Export rounded corner & shadow frame in config.toml',
            code: `[export.image_frame]
enabled = true
padding = 112
corner_radius = 18.0
shadow_radius = 72
shadow_offset_y = 28
shadow_opacity = 0.32`,
          },
        ],
      },
    ],
  },
  {
    id: 'ocr-translate',
    categoryId: 'ocr-record',
    title: 'Offline PP-OCRv5 & Multi-Provider Translation',
    summary:
      'Local 7-script text and table recognition via ONNX Runtime 1.28.0, engine lifecycle modes, and LLM or machine translation setup.',
    sections: [
      {
        id: 'ocr-engine',
        heading: 'Local Recognition, Table Export & Lifecycle Modes',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Mark Shot runs PP-OCRv5 locally on ONNX Runtime 1.28.0 across Latin, Cyrillic, Arabic, Greek, Chinese/Japanese, Korean, and Thai scripts. Downloads verify SHA-256 digests and support pause/resume.',
              'The standalone OCR window offers Text, Original Image, Table (editable cells copyable as TSV, CSV, Markdown, or HTML), and side-by-side Translation views. Set result_panel = false to select recognized text directly on the screenshot canvas.',
            ],
          },
          {
            kind: 'code',
            label: 'OCR lifecycle configuration (on-demand / at-launch / daemon)',
            code: `[ocr]
engine = "paddle"         # Local paddle recommended; Windows also supports "system"
download_mirror = ""      # Optional HTTP/HTTPS GitHub mirror prefix with direct fallback
result_panel = true       # Set false to drag-select text directly on capture canvas
threads = 4
mode = "on-demand"        # on-demand | at-launch | daemon
device = "auto"           # auto | cpu | gpu (used by daemon worker)
daemon_idle_secs = 900    # Unload daemon after 15 minutes of inactivity`,
          },
        ],
      },
      {
        id: 'translation-providers',
        heading: 'Nine Translation Backends & Environment Credentials',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Text is transmitted only when you explicitly trigger translation. Bilibili Index-Translate works out of the box without keys, alongside OpenAI Chat Completions, OpenAI Responses, Anthropic Messages, Gemini, Tencent, Baidu, Youdao, and custom CLI commands. <think> blocks are stripped automatically.',
            ],
          },
          {
            kind: 'code',
            label: 'Supplying translation API keys via environment variables',
            code: `export MARK_SHOT_LLM_API_BASE="https://api.openai.com/v1"
export MARK_SHOT_LLM_API_KEY="sk-..."
export MARK_SHOT_LLM_MODEL="gpt-4.1-mini"

# Additional provider env prefixes:
# MARK_SHOT_GEMINI_API_KEY / MARK_SHOT_ANTHROPIC_API_KEY
# MARK_SHOT_TENCENT_SECRET_ID / MARK_SHOT_BAIDU_APP_ID / MARK_SHOT_YOUDAO_APP_KEY`,
          },
        ],
      },
    ],
  },
  {
    id: 'recording',
    categoryId: 'ocr-record',
    title: 'Screen Recording & Hardware Encoding',
    summary:
      'In-process MP4, MKV, and GIF recording pipelines, CLI pause/stop controls, GPU encoders, and platform constraints.',
    sections: [
      {
        id: 'recording-pipeline',
        heading: 'Output Formats, Encoders & CLI Control',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Record a single display or region into MP4 (direct H.264 + AAC write), MKV (remuxed on stop without re-encoding), or palette-optimized GIF. Interrupted sessions preserve working streams inside hidden .Recording_*.recording folders for recovery.',
            ],
          },
          {
            kind: 'code',
            label: 'Recording settings in config.toml',
            code: `[recording]
format = "mp4"            # mp4 | mkv | gif
quality = "balanced"      # balanced | high | efficient
encoder = "auto"          # auto | hardware | software
fps = 30
gif_fps = 12
countdown = 3
audio = "off"             # off | system | microphone
keep_controls_visible = false`,
          },
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: 'Wayland Direct & Portal',
                badge: 'DMA-BUF / PipeWire',
                detail: 'Uses in-process ext-image-copy-capture or wlr-screencopy (DMA-BUF when GPU-compatible), or Portal + PipeWire with VAAPI / NVENC / OpenH264.',
              },
              {
                term: 'X11 & Windows Native',
                badge: 'MIT-SHM / WGC',
                detail: 'X11 captures via MIT-SHM with VAAPI/NVENC/OpenH264; Windows captures via Windows Graphics Capture (D3D11) and Media Foundation H.264/AAC.',
              },
            ],
          },
          {
            kind: 'callout',
            title: 'Recording Boundaries',
            body: 'A recording targets one display (SDR 8-bit 4:2:0; HDR not supported). Setting encoder = "hardware" reports an explicit error if GPU encoding fails instead of silently falling back to software.',
          },
        ],
      },
    ],
  },
];
