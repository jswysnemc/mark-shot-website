import type { DocChapter } from '@/types/docs';

export const docsConfigPlatformEn: DocChapter[] = [
  {
    id: 'shortcuts',
    categoryId: 'config-platform',
    title: 'Default Shortcuts & Custom Keybindings',
    summary:
      'Complete reference for completion keys, 18 single-key tools, 1px/10px selection nudges, recording hotkeys, and [keys] configuration.',
    sections: [
      {
        id: 'shortcuts-general',
        heading: 'Completion Actions & UI Controls',
        blocks: [
          {
            kind: 'keyGrid',
            items: [
              { keys: 'Enter', action: 'Confirm and run default [general].to actions', configKey: 'accept' },
              { keys: 'Ctrl + C / Double-click', action: 'Copy rendered capture to clipboard', configKey: 'copy' },
              { keys: 'Ctrl + S / Ctrl + Alt + S', action: 'Save to default folder / Open Save As dialog', configKey: 'save / save_as' },
              { keys: 'Ctrl + P', action: 'Pin selection always-on-top', configKey: 'pin' },
              { keys: 'Ctrl + Shift + S', action: 'Start scrolling capture stitch', configKey: 'scroll_capture' },
              { keys: 'Ctrl + Z / Ctrl + Y', action: 'Undo / Redo annotation', configKey: 'undo / redo' },
              { keys: 'Delete / Backspace', action: 'Delete selected annotation or curve node', configKey: 'delete' },
              { keys: 'Ctrl + H / Ctrl + ,', action: 'Open capture history / Open settings', configKey: 'history / settings' },
              { keys: 'Ctrl + Shift + L', action: 'Toggle Light and Dark toolbar theme', configKey: 'toggle_theme' },
              { keys: 'Space / Shift + M', action: 'Hide or show toolbars / Toggle cursor magnifier', configKey: 'toggle_ui / toggle_magnifier' },
              { keys: '[ / ]', action: 'Decrease or increase stroke width and font size', configKey: 'size_down / size_up' },
              { keys: 'Ctrl+Shift+R / G / P / E', action: 'Record video / Record GIF / Pause-Resume / Stop', configKey: 'record_*' },
            ],
          },
        ],
      },
      {
        id: 'shortcuts-tools-nudge',
        heading: 'Single-Key Tools, Pixel Nudges & [keys] Table',
        blocks: [
          {
            kind: 'keyGrid',
            items: [
              { keys: 'S / V', action: 'Adjust selection box / Pick & transform annotations', configKey: 'tool_selection / tool_pick' },
              { keys: 'P / H / D / A', action: 'Pen / Highlighter / Line / Arrow', configKey: 'tool_pen ... tool_arrow' },
              { keys: 'R / C / K', action: 'Rectangle / Ellipse / 24 preset Markers', configKey: 'tool_rectangle ... tool_marker' },
              { keys: 'T / N / Shift + N', action: 'Text / Step badge / Numbered arrow', configKey: 'tool_text / tool_number' },
              { keys: 'M (or X) / Z / U', action: 'Redact filter / Magnifier / Pixel & angle ruler', configKey: 'tool_redact / magnifier / ruler' },
              { keys: 'G / I / O', action: 'Laser pointer / Eyedropper / Local OCR', configKey: 'tool_laser / eyedropper / ocr' },
              { keys: 'Arrows / Shift + Arrows', action: 'Move selection by 1px / 10px steps', configKey: 'move_* / move_*_fast' },
              { keys: 'Alt + Arrows (+ Shift)', action: 'Resize selection by 1px / 10px steps', configKey: 'resize_* / resize_*_fast' },
            ],
          },
          {
            kind: 'code',
            label: 'Customizing or unbinding shortcuts in config.toml',
            code: `[keys]
copy = "Ctrl+C"
redo = ["Ctrl+Shift+Z", "Ctrl+Y"]
upload = "F8"
translate = "F9"
toggle_ui = []            # Empty array unbinds the action`,
          },
        ],
      },
    ],
  },
  {
    id: 'configuration',
    categoryId: 'config-platform',
    title: 'config.toml Schema, Uploaders & XDG Paths',
    summary:
      'File locations, minimal-override semantics, multipart or custom CLI image uploaders, environment variables, and XDG directories.',
    sections: [
      {
        id: 'config-core-toml',
        heading: 'Configuration Path & Common Sections',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Linux reads ~/.config/mark-shot/config.toml (honoring XDG_CONFIG_HOME) and Windows reads %APPDATA%\\mark-shot\\config.toml. Only modified keys are written; deleting any key restores its built-in default. Run mark-shot --print-default-config to inspect the full commented template.',
            ],
          },
          {
            kind: 'code',
            label: 'Core behavior, file naming & custom image-host uploader',
            code: `[ui]
theme = "system"                  # light | dark | system
language = "english"              # system | english | chinese

[general]
to = "cs"                         # Copy and save by default
overlay = "auto"                  # auto (layer on niri/COSMIC) | window | layer

[capture]
freeze_scope = "cursor-screen"    # all-screens | cursor-screen
show_start_bar = true
show_hints = true
double_click_action = "copy"      # none | copy | save | save-as | pin | cancel
toolbar_position = "selection"    # selection | top | bottom | left | right

[save]
directory = "screenshots"
month_format = "%Y-%m"
filename_format = "%Y-%m-%d_%H-%M"

[upload]
command = ""                      # Empty uses built-in multipart POST, or pass {image} CLI command
timeout_ms = 60000

[upload.env]
MARK_SHOT_UPLOAD_URL = "https://img.example.com/api/upload"
MARK_SHOT_UPLOAD_FIELD = "image"
MARK_SHOT_UPLOAD_API_KEY = "your-token"
MARK_SHOT_UPLOAD_URL_PATH = "data.url"`,
          },
        ],
      },
      {
        id: 'config-env-dirs',
        heading: 'Environment Overrides & Storage Directories',
        blocks: [
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: 'MARK_SHOT_BACKEND',
                badge: 'Display Server',
                detail: 'auto, wayland, or x11. Explicit overrides fail fast if unavailable rather than silently switching protocols.',
              },
              {
                term: 'MARK_SHOT_CAPTURE',
                badge: 'Capture Backend',
                detail: 'kde, image-copy, screencopy, or portal to pin a specific Wayland frame provider.',
              },
              {
                term: 'MARK_SHOT_OCR_MIRROR',
                badge: 'Download Mirror',
                detail: 'HTTP/HTTPS GitHub mirror prefix for ONNX Runtime and PP-OCRv5 language models.',
              },
              {
                term: 'XDG State & Share Split',
                badge: 'Linux Paths',
                detail: 'Last-used tool state & logs live in ~/.local/state/mark-shot/; OCR models & history live in ~/.local/share/mark-shot/.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'desktop-integration',
    categoryId: 'config-platform',
    title: 'Compositor Binds & Five-Backend Matrix',
    summary:
      'Keybinding snippets for niri, Sway, and Hyprland, background tray/portal service details, and capability matrix across Linux and Windows.',
    sections: [
      {
        id: 'desktop-compositor-binds',
        heading: 'Tiling Compositor Binds & Background Service',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'On tiling Wayland compositors, binding mark-shot directly in your compositor config is simplest. On KDE, GNOME, X11, or Windows, mark-shot --background (or Launch at Login) hosts the system tray and global shortcut registration.',
            ],
          },
          {
            kind: 'code',
            label: 'niri / Sway / Hyprland keybinding snippets',
            code: `// 1. niri (~/.config/niri/config.kdl)
spawn-at-startup "mark-shot" "--background"
binds {
    Print { spawn "mark-shot"; }
    Shift+Print { spawn "mark-shot" "--scroll"; }
}

# 2. Sway (~/.config/sway/config)
bindsym Print exec mark-shot
bindsym Shift+Print exec mark-shot --scroll

# 3. Hyprland (~/.config/hypr/hyprland.conf)
bind = , Print, exec, mark-shot
bind = SHIFT, Print, exec, mark-shot --scroll`,
          },
        ],
      },
      {
        id: 'desktop-platform-matrix',
        heading: 'Runtime Protocol Matrix Across Five Environments',
        blocks: [
          {
            kind: 'screenshot',
            src: '/images/real-dark-capture.png',
            alt: 'Mark Shot dark overlay on Wayland',
            caption: 'Wayland sessions always use native Wayland protocols even when DISPLAY is set for Xwayland.',
          },
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: 'niri / Sway / wlroots',
                badge: 'Full Native',
                detail: 'ext-image-copy-capture or wlr-screencopy, layer-shell overlays & pins, ext/wlr-data-control clipboard, and niri/Sway IPC window snapping.',
              },
              {
                term: 'KDE Plasma (Wayland)',
                badge: 'KWin Native',
                detail: 'Uses KWin ScreenShot2 and one-shot KWin window geometry queries with full window snapping, layer-shell pinning, and scroll stitching.',
              },
              {
                term: 'GNOME (Wayland)',
                badge: 'Portal + PipeWire',
                detail: 'Uses ScreenCast portal, xdg-shell fullscreen editor, and Xwayland clipboard bridge. Window snapping and always-on-top pins are unavailable due to GNOME protocol limits.',
              },
              {
                term: 'X11 & Windows (Experimental)',
                badge: 'Native APIs',
                detail: 'X11 uses XGetImage / RandR / _NET_WM_STATE_ABOVE; Windows uses GDI / WGC / DWM bounds and UI Automation control trees.',
              },
            ],
          },
        ],
      },
    ],
  },
];
