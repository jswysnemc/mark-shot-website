import type { DocChapter } from '@/types/docs';

export const docsGettingStartedEn: DocChapter[] = [
  {
    id: 'overview',
    categoryId: 'getting-started',
    title: 'Architecture & Zero-Bloat Principles',
    summary:
      'How Mark Shot 0.2.x replaces traditional GUI toolkits with pure Rust and a custom software renderer while eliminating external shell-out helpers.',
    sections: [
      {
        id: 'overview-core',
        heading: 'Native Renderer & Process Boundaries',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Mark Shot 0.2.x is written in Rust around a custom software renderer with zero Qt, GTK, or WebView dependencies. Legacy 0.1.x Qt sources remain archived on the qt-old branch.',
              'Mark Shot never shells out to grim, wl-copy, xclip, or external ffmpeg binaries. The sole external utility invoked on demand is fc-match from fontconfig to locate system CJK and Latin fonts for text annotations.',
            ],
          },
          {
            kind: 'screenshot',
            src: '/images/real-light-capture.png',
            alt: 'Mark Shot native light UI capture',
            caption: 'Live Mark Shot overlay: top-left size/aspect bar, 20-button main toolbar, contextual property sub-bar, and 13-button vertical action rail.',
          },
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: '31.6 ms Tray Wake',
                badge: 'Measured Median',
                detail: 'Background service pre-prepares capture state so pressing your hotkey freezes the desktop immediately.',
              },
              {
                term: '21.6 MiB Idle RSS',
                badge: 'Memory Footprint',
                detail: 'No resident browser engine or heavy widget tree; framebuffers release as soon as clipboard streaming completes.',
              },
              {
                term: 'Single-Binary Core',
                badge: '27.7 MB ELF',
                detail: 'Screenshots, 19 annotation tools, pinned overlays, history, and offline QR/barcode scanning require only mark-shot.',
              },
              {
                term: 'On-Demand Local OCR',
                badge: 'ONNX 1.28.0',
                detail: 'Normal captures never touch OCR libraries; models load only when requested and exit once the result window opens.',
              },
            ],
          },
        ],
      },
      {
        id: 'overview-single-instance',
        heading: 'Single-Instance Handoff & Source Pixel Integrity',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'On Linux, launching mark-shot while an overlay is already active hands the request over to the running instance instead of stacking a second overlay.',
              'Toggling between Light and Dark UI themes (Ctrl+Shift+L) updates only floating toolbars and popovers, never altering captured pixels or exported PNG colors.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'installation',
    categoryId: 'getting-started',
    title: 'Installation, Verification & Building',
    summary:
      'Prebuilt Linux and Windows packages, SHA-256 verification, Cargo feature flags, media library compilation, and NixOS Flake integration.',
    sections: [
      {
        id: 'install-packages',
        heading: 'Prebuilt Packages & Checksum Verification',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Official releases publish 8 DEB variants (Debian 12/13, Ubuntu 24.04/26.04 on amd64 and arm64), Fedora RPMs, Arch packages, AppImage, Flatpak, portable Linux tarballs, and Windows x86_64 Setup and ZIP archives.',
              'Prebuilt archives bundle the in-process recording media libraries and license notices. When using portable archives, keep the extracted directory intact so mark-shot remains beside its media folder.',
            ],
          },
          {
            kind: 'code',
            label: 'Extract portable archive & verify SHA-256 (Linux / PowerShell)',
            code: `# Linux x86_64 checksum & launch
sha256sum mark-shot-native-0.2.1-linux-x86_64.tar.gz
tar -xzf mark-shot-native-0.2.1-linux-x86_64.tar.gz
./mark-shot-native-0.2.1-linux-x86_64/mark-shot --version

# Windows PowerShell verification
Get-FileHash .\\mark-shot-native-0.2.1-windows-x86_64-msvc.zip -Algorithm SHA256`,
          },
        ],
      },
      {
        id: 'install-source-nix',
        heading: 'Building from Source, Feature Flags & NixOS',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Building from source requires Rust 1.95 or newer (pinned automatically via rust-toolchain.toml). Use scripts/packaging/install_dependencies.sh on Debian, Ubuntu, Fedora, or Arch Linux to install native headers.',
            ],
          },
          {
            kind: 'code',
            label: 'Cargo release build & private recording media libraries',
            code: `git clone https://github.com/jswysnemc/mark-shot.git
cd mark-shot
bash scripts/packaging/install_dependencies.sh
cargo build --release --locked

# Optional: build pinned FFmpeg / OpenH264 shared libraries for screen recording
bash scripts/media/build-libraries.sh linux
mkdir -p target/release/media
cp -r target/media-linux/. target/release/media/`,
          },
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: 'Default Dynamic OCR (ocr-dynamic)',
                badge: 'Default',
                detail: 'cargo build --release --locked keeps binary size minimal and downloads ONNX Runtime on first request in the OCR panel.',
              },
              {
                term: 'Embedded Runtime (bundled-ocr / ocr-gpu)',
                badge: 'Mutually Exclusive',
                detail: 'Build with --no-default-features --features bundled-ocr (or ocr-gpu for WebGPU). Do not pass --all-features.',
              },
            ],
          },
          {
            kind: 'code',
            label: 'NixOS Flake configuration',
            code: `inputs.mark-shot.url = "github:jswysnemc/mark-shot";

environment.systemPackages = [
  inputs.mark-shot.packages.\${pkgs.stdenv.hostPlatform.system}.default
];`,
          },
        ],
      },
    ],
  },
  {
    id: 'capture-workflow',
    categoryId: 'getting-started',
    title: 'Capture Workflow & Full CLI Reference',
    summary:
      'Window and UI-element snapping, completion action codes (c/s/p/o), headless JSON scripting, and complete command-line flags.',
    sections: [
      {
        id: 'workflow-selection',
        heading: 'Four-Step Selection & Completion Codes',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Running mark-shot freezes the screen and highlights candidate windows or UI regions beneath the cursor. Click once to snap to the highlighted region, or roll the mouse wheel to step outward to parent containers and inward to nested elements.',
              'On Windows with both [region_detection] and [window_detection] enabled, UI Automation control bounds take priority and Tab toggles between whole windows and inner controls. Press Esc or right-click during region selection to cancel.',
            ],
          },
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: 'c: Copy to Clipboard',
                badge: 'to code',
                detail: 'Streams PNG data to Wayland data-control, X11 CLIPBOARD, or Windows clipboard.',
              },
              {
                term: 's: Save to Directory',
                badge: 'to code',
                detail: 'Saves to ~/Pictures/screenshots/<YYYY-MM>/<date_time>.png by default.',
              },
              {
                term: 'p: Pin to Screen',
                badge: 'to code',
                detail: 'Spawns an always-on-top borderless pinned window immediately on completion.',
              },
              {
                term: 'o: Write PNG to stdout',
                badge: 'to code',
                detail: 'Emits PNG bytes to standard output for shell pipelines. Default combination is cs (copy + save).',
              },
            ],
          },
        ],
      },
      {
        id: 'workflow-cli',
        heading: 'Interactive & Headless CLI Flags',
        blocks: [
          {
            kind: 'code',
            label: 'Common interactive & scripted capture commands',
            code: `mark-shot                         # Freeze screen, select region, open editor
mark-shot -m                      # Freeze only the monitor containing the cursor
mark-shot -f -t cs                # Immediate full capture without opening editor
mark-shot -r -t c                 # Drag region and copy immediately on release
mark-shot -w -t c                 # Capture active window (niri requires 'c')
mark-shot -d 2.5                  # Delay 2.5 seconds before capture (0 to 60)
mark-shot --scroll                # Select region and stitch scrolling capture
mark-shot --capture-to ~/shot.png --region 100,100,800,600 --include-cursor`,
          },
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: '--all-outputs / --display <name>',
                detail: 'Freeze the entire desktop or target specific outputs (inspect names as JSON via --list-displays).',
              },
              {
                term: '--default-tool / --default-color',
                detail: 'Set initial editor tool (selection, pick, pen, arrow, rectangle, ruler, magnifier, redact, ocr) and #RRGGBB color.',
              },
              {
                term: '--pin-image / --pin-clipboard',
                detail: 'Pin an existing image file or current clipboard image/plain text directly onto the screen.',
              },
              {
                term: '--scan / --scan-json <image>',
                detail: 'Decode QR codes and barcodes locally offline; --scan-json prints a JSON array of { format, text }.',
              },
              {
                term: '--history / --settings',
                detail: 'Open the capture history browser or the 11-page native settings dialog.',
              },
              {
                term: '--debug / --speed / --debug-log <file>',
                detail: '--debug prints the active diagnostic log path to stderr and propagates to helpers; --speed prints startup timings.',
              },
            ],
          },
        ],
      },
    ],
  },
];
