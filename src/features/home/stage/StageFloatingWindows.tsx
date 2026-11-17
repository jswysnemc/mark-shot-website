interface StageFloatingWindowsProps {
  showOcr: boolean;
  showTranslate: boolean;
  showPin: boolean;
  uiDark: boolean;
  isZh: boolean;
  onCopyOcr: () => void;
  onCloseOverlay: (which: 'ocr' | 'translate' | 'pin') => void;
}

/**
 * 【舞台窗口层】【代码底窗与识别贴图浮窗】渲染被截图的原生代码窗口以及可开关的 PP-OCRv5 与置顶贴图浮窗
 * @param props 各浮窗开关状态与关闭回调
 * @returns 窗口层节点
 */
export function StageFloatingWindows({
  showOcr,
  showTranslate,
  showPin,
  uiDark,
  isZh,
  onCopyOcr,
  onCloseOverlay,
}: StageFloatingWindowsProps) {
  return (
    <>
      {/* 冻结桌面内的真实代码编辑器窗口（供放大镜、OCR、原位翻译直接作用） */}
      <div className="pointer-events-none absolute top-[78px] left-[86px] w-[548px] rounded-[10px] border border-white/14 bg-[#14181d]/94 p-4 font-[family-name:var(--mono)] text-[12px] leading-[1.62] text-[#e5e9f0] shadow-2xl">
        <div className="mb-2.5 flex items-center justify-between border-b border-white/10 pb-2 text-[11px] text-slate-400">
          <span>mark-shot · src/backend/wayland/capture.rs</span>
          <span>wayland-1 · 2560x1600</span>
        </div>

        <p className="text-[#6b7685]">
          {showTranslate
            ? isZh
              ? '// 原生 Wayland 零外部命令帧捕获与共享内存合成'
              : '// Zero-helper native Wayland frame capture & SHM compositing'
            : '// Native Wayland zero-helper capture & SHM renderer'}
        </p>
        <p>
          <span className="text-[#d7915c]">pub fn</span>{' '}
          <span className="text-[#6fb7f0]">capture_output</span>(conn: &amp;
          <span className="text-[#6ddad6]">WaylandState</span>) -&gt;{' '}
          <span className="text-[#6ddad6]">Result</span>&lt;
          <span className="text-[#6ddad6]">ShmFrame</span>&gt; {'{'}
        </p>
        <p className="pl-4">
          <span className="text-[#d7915c]">let</span> frame = conn.
          <span className="text-[#6fb7f0]">ext_image_copy_capture</span>()?;
        </p>
        <p className="pl-4">
          <span className="text-[#6ddad6]">Ok</span>(frame.
          <span className="text-[#6fb7f0]">into_composited_canvas</span>())
        </p>
        <p>{'}'}</p>
        <p className="mt-2 border-t border-white/10 pt-2 text-[11px] text-[#8fcb7a]">
          $ mark-shot --version{' '}
          <span className="text-slate-400">
            # mark-shot 0.2.1 · 31.6 ms wake · 21.6 MiB RSS
          </span>
        </p>

        {showTranslate ? (
          <div className="mt-2 rounded-md border border-[#2dd4bf]/45 bg-[#0d9488]/22 px-2.5 py-1 font-[family-name:var(--sans)] text-[11.5px] text-[#ccfbf1]">
            {isZh
              ? '原位译文覆盖：捕获活动显示器像素并直接移交共享内存画布（无 grim/wl-copy 子进程）'
              : 'Translated overlay: Captures output pixels directly into SHM canvas without grim/wl-copy'}
          </div>
        ) : null}
      </div>

      {/* PP-OCRv5 本地识别独立结果窗口（点击右侧 [T] 图标开启） */}
      {showOcr ? (
        <div
          data-ui-chrome
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className={`absolute top-14 right-[112px] z-40 w-[300px] rounded-[12px] border p-3 font-[family-name:var(--sans)] text-[12px] shadow-2xl backdrop-blur-md ${
            uiDark
              ? 'border-white/14 bg-[#0f1117]/95 text-slate-100'
              : 'border-slate-900/14 bg-white/96 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between border-b border-current/12 pb-2">
            <span className="font-semibold">
              {isZh ? '文字识别 · PP-OCRv5' : 'OCR Result · PP-OCRv5'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onCopyOcr}
                className="cursor-pointer rounded-[6px] bg-[#0d9488] px-2 py-0.5 text-[11px] font-medium text-white hover:opacity-90"
              >
                {isZh ? '复制 Markdown' : 'Copy MD'}
              </button>
              <button
                type="button"
                onClick={() => onCloseOverlay('ocr')}
                className="cursor-pointer px-1 text-[14px] opacity-65 hover:opacity-100"
              >
                ×
              </button>
            </div>
          </div>
          <pre className="mt-2 overflow-x-auto rounded-[7px] bg-black/6 p-2 font-[family-name:var(--mono)] text-[11px] leading-[1.55] dark:bg-white/6">
            {`pub fn capture_output(conn: &WaylandState)\nlet frame = conn.ext_image_copy_capture()?;\nmark-shot 0.2.1 · 31.6 ms wake · 21.6 MiB`}
          </pre>
        </div>
      ) : null}

      {/* 置顶无边框贴图悬浮窗（点击右侧图钉图标开启） */}
      {showPin ? (
        <div
          data-ui-chrome
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-[112px] bottom-52 z-40 w-[240px] overflow-hidden rounded-[10px] border-2 border-[#5eead4] bg-[#14181d] p-2.5 text-slate-100 shadow-[0_20px_48px_rgba(0,0,0,0.55)]"
        >
          <div className="mb-1.5 flex items-center justify-between font-[family-name:var(--sans)] text-[11px] text-[#5eead4]">
            <span>
              {isZh ? '置顶贴图 · 划词可选' : 'Pinned Window · Text Selectable'}
            </span>
            <button
              type="button"
              onClick={() => onCloseOverlay('pin')}
              className="cursor-pointer text-[13px] text-slate-300 hover:text-white"
            >
              ×
            </button>
          </div>
          <p className="select-text rounded bg-white/8 px-2 py-1.5 font-[family-name:var(--mono)] text-[11px] leading-[1.5] text-teal-200">
            ext_image_copy_capture() -&gt; 31.6 ms
          </p>
        </div>
      ) : null}
    </>
  );
}
