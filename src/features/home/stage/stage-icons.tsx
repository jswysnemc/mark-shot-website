import type { ReactNode } from 'react';

export type NativeIconName =
  | 'selection'
  | 'pick'
  | 'pen'
  | 'line'
  | 'highlighter'
  | 'rectangle'
  | 'circle'
  | 'marker'
  | 'arrow'
  | 'text'
  | 'number'
  | 'redact'
  | 'magnifier'
  | 'ruler'
  | 'laser'
  | 'eyedropper'
  | 'recording'
  | 'clear'
  | 'undo'
  | 'redo'
  | 'scope'
  | 'open_with'
  | 'extensions'
  | 'scroll'
  | 'pin'
  | 'ocr'
  | 'scan_code'
  | 'translate'
  | 'copy'
  | 'save_as'
  | 'upload'
  | 'settings'
  | 'cancel'
  | 'lock'
  | 'unlock'
  | 'chevron_down'
  | 'reset_number';

const ICON_PATHS: Record<NativeIconName, ReactNode> = {
  selection: (
    <path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3" />
  ),
  pick: <path d="M5 3.5v16l4.5-4.5 3.3 6 3-1.7-3.3-5.8H19z" />,
  pen: (
    <path d="m15.5 4.5 4 4M4 20l1-5L15.5 4.5a2.8 2.8 0 0 1 4 4L9 19zM5 15l4 4" />
  ),
  line: (
    <>
      <path d="M5 19 19 5" />
      <circle cx="5" cy="19" r="1.4" />
      <circle cx="19" cy="5" r="1.4" />
    </>
  ),
  highlighter: <path d="m14 3 6 6-8.5 8.5-6-6zM7 13l-3 5 2 2 5-3M3 22h16" />,
  rectangle: <rect x="3.5" y="5" width="17" height="14" rx="2" />,
  circle: <ellipse cx="12" cy="12" rx="8.5" ry="7" />,
  marker: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <circle cx="17.5" cy="6.5" r="3.5" />
      <path d="m6.5 14 4 7h-8zM14 17.5h7m-3.5-3.5v7" />
    </>
  ),
  arrow: <path d="M5 19 19 5M8 5h11v11" />,
  text: <path d="M4 6V4h16v2M12 4v16M8 20h8" />,
  number: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m10 9 2-2v10M10 17h4" />
    </>
  ),
  redact: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M9 4v16M15 4v16M4 9h16M4 15h16" />
      <path
        d="M4 4h5v5H4zM9 9h6v6H9zM15 15h5v5h-5z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
  magnifier: (
    <>
      <circle cx="10.5" cy="10.5" r="7" />
      <path d="m16 16 5 5M7 10.5h7M10.5 7v7" />
    </>
  ),
  ruler: (
    <path d="m3 16 13-13 5 5L8 21zM12 7l2 2M9 10l2 2M6 13l2 2M15 4l2 2" />
  ),
  laser: (
    <path d="m4 20 2-5 7-7 3 3-7 7zM6 15l3 3M16 5l1-3M19 8l3-1M19 5l2-2" />
  ),
  eyedropper: (
    <path d="m14 4 6 6M12 6l6 6M13 7l-9 9v4h4l9-9M15 5l2-2a2 2 0 0 1 3 3l-2 2" />
  ),
  recording: (
    <>
      <rect x="3" y="5" width="13" height="14" rx="3" />
      <path d="m16 9 5-3v12l-5-3Z" />
      <circle cx="9.5" cy="12" r="2.5" />
    </>
  ),
  clear: <path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7" />,
  undo: <path d="m8 4-5 5 5 5M3 9h10a6 6 0 0 1 0 12h-3" />,
  redo: <path d="m16 4 5 5-5 5M21 9H11a6 6 0 0 0 0 12h3" />,
  scope: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4M6 7h12v7H6z" />
    </>
  ),
  open_with: <path d="M13 4h7v7M20 4l-9 9M9 5H4v15h15v-5" />,
  extensions: (
    <>
      <rect x="3.5" y="3.5" width="6" height="6" rx="1.2" />
      <rect x="14.5" y="3.5" width="6" height="6" rx="1.2" />
      <rect x="3.5" y="14.5" width="6" height="6" rx="1.2" />
      <path d="M17.5 13v8M13.5 17h8" />
    </>
  ),
  scroll: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M12 6v12M9 9l3-3 3 3M9 15l3 3 3-3" />
    </>
  ),
  pin: <path d="M8 3h8l-1 7 4 4v2H5v-2l4-4zM12 16v5" />,
  ocr: <path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5M8 9V8h8v1M12 8v9M10 17h4" />,
  scan_code: (
    <>
      <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
      <path d="M7 7h3v3H7zm7 0h3v3h-3zM7 14h3v3H7zm7 0h3m-3 3h3m-3-3v3" />
    </>
  ),
  translate: (
    <path d="M3 6h11M8 3v3M12 6c-1 6-4 9-9 11M5 9c1 3 3 5 6 7M13 21l4-11 4 11M14.5 17h5" />
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="13" rx="2" />
      <path d="M15 8V3H3v13h5" />
    </>
  ),
  save_as: (
    <path d="M11 21H4V3h13l3 3v5M8 3v6h8V3M8 21v-8h3M13 21l1-4 5-5 3 3-5 5z" />
  ),
  upload: <path d="M12 16V3M7 8l5-5 5 5M4 16v5h16v-5" />,
  settings: (
    <>
      <path
        d="m10 3-1 3-3 1-2-1-2 3 2 2v3l-2 2 2 3 3-1 2 1 1 3h4l1-3 2-1 3 1 2-3-2-2v-3l2-2-2-3-2 1-3-1-1-3z"
        transform="translate(1 0) scale(.92)"
      />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  cancel: <path d="m5 5 14 14M5 19 19 5" />,
  lock: (
    <>
      <rect x="5.5" y="10.5" width="13" height="9.5" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  unlock: (
    <>
      <rect x="5.5" y="10.5" width="13" height="9.5" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 6.8-1.2" />
    </>
  ),
  chevron_down: <path d="M6 9.5l6 6 6-6" />,
  reset_number: (
    <>
      <path d="M5 12a7 7 0 1 0 2.05-4.95" />
      <path d="M5 4.5V8h3.5" />
      <path d="M11 10l1.5-1v6" />
    </>
  ),
};

/**
 * 【原生图标】【矢量渲染】按 Mark Shot 0.2.1 仓库内置 SVG 路径与 1.75 线宽绘制工具栏图标
 * @param props 图标标识与逻辑像素边长
 * @returns SVG 节点
 */
export function NativeMarkShotIcon({
  name,
  size = 18,
}: {
  name: NativeIconName;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
