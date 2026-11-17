interface StartupOverlayProps {
  uiDark: boolean;
  isZh: boolean;
  onStartMode: (mode: 'region' | 'screen' | 'video' | 'gif') => void;
}

/**
 * 【启动阶段】【真实覆盖层】1:1 复刻 niri-use 捕获到的顶部 [Region / Screen / Video / GIF] 胶囊栏与左下角快捷键面板
 * @param props 工具栏明暗模式、语言标识与模式选择回调
 * @returns 启动态覆盖层节点
 */
export function StartupOverlay({
  uiDark,
  isZh,
  onStartMode,
}: StartupOverlayProps) {
  const modes: Array<{
    id: 'region' | 'screen' | 'video' | 'gif';
    zh: string;
    en: string;
  }> = [
    { id: 'region', zh: '区域', en: 'Region' },
    { id: 'screen', zh: '全屏', en: 'Screen' },
    { id: 'video', zh: '视频', en: 'Video' },
    { id: 'gif', zh: 'GIF', en: 'GIF' },
  ];

  const leftHints = isZh
    ? [
        ['拖动 / 单击', '选择区域'],
        ['Ctrl+A', '选择全屏'],
        [', / .', '最近选区'],
        ['Enter', '完成截图'],
        ['Esc', '退出截图'],
      ]
    : [
        ['Drag / click', 'Select region'],
        ['Ctrl+A', 'Select screen'],
        [', / .', 'Recent region'],
        ['Enter', 'Finish capture'],
        ['Esc', 'Exit capture'],
      ];

  const rightHints = isZh
    ? [
        ['Ctrl+Shift+R', '录制视频'],
        ['Ctrl+Shift+G', '录制 GIF'],
        ['Shift+M', '取色放大镜'],
        ['Ctrl+Shift+L', '切换明暗主题'],
        ['Ctrl+H', '截图历史'],
        ['Space', '隐藏工具栏'],
      ]
    : [
        ['Ctrl+Shift+R', 'Record video'],
        ['Ctrl+Shift+G', 'Record GIF'],
        ['Shift+M', 'Magnifier'],
        ['Ctrl+Shift+L', 'Toggle theme'],
        ['Ctrl+H', 'History'],
        ['Space', 'Toggle toolbar'],
      ];

  const panelClass = uiDark
    ? 'bg-[#0f1117]/92 text-slate-100 border-white/12'
    : 'bg-[#f8fafc]/95 text-slate-800 border-slate-900/12';

  return (
    <div
      data-ui-chrome
      onPointerDown={(e) => e.stopPropagation()}
      onClick={() => onStartMode('region')}
      className="absolute inset-0 z-20 cursor-crosshair bg-black/38"
    >
      {/* 顶部居中启动模式胶囊栏 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-[11px] border p-1 shadow-xl backdrop-blur-md ${panelClass}`}
      >
        {modes.map((item, idx) => {
          const active = idx === 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onStartMode(item.id)}
              className={`cursor-pointer rounded-[8px] px-4 py-1.5 font-[family-name:var(--sans)] text-[12px] font-medium transition-colors ${
                active
                  ? uiDark
                    ? 'border border-[#99f6e4]/60 bg-[#99f6e4]/25 text-[#ccfbf1]'
                    : 'border border-[#0d9488]/55 bg-[#0d9488]/14 text-[#0f766e]'
                  : uiDark
                    ? 'text-slate-300 hover:bg-[#2dd4bf] hover:text-[#042f2e]'
                    : 'text-slate-700 hover:bg-[#0d9488] hover:text-white'
              }`}
            >
              {isZh ? item.zh : item.en}
            </button>
          );
        })}
      </div>

      {/* 窗口自动吸附高亮示意框 */}
      <div className="pointer-events-none absolute top-[78px] left-[86px] h-[256px] w-[548px] rounded-[10px] border-2 border-[#2dd4bf]/80 bg-[#2dd4bf]/8 shadow-[0_0_0_1px_rgba(13,148,136,0.3)]">
        <span className="absolute -top-6 left-0 rounded-md bg-[#0f1117]/85 px-2 py-0.5 font-[family-name:var(--mono)] text-[11px] text-[#5eead4]">
          {isZh ? '自动吸附窗口 · 单击任意处进入标注' : 'Window Snap · Click anywhere to annotate'}
        </span>
      </div>

      {/* 左下角双列快捷键速查面板（对应 niri-use 01-startup-hover.png） */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute bottom-3.5 left-3.5 grid grid-cols-2 gap-x-5 gap-y-1 rounded-[11px] border px-3.5 py-2.5 font-[family-name:var(--sans)] text-[11px] leading-[1.45] shadow-xl backdrop-blur-md ${panelClass}`}
      >
        <div className="space-y-1">
          {leftHints.map(([keyText, desc]) => (
            <div key={keyText} className="grid grid-cols-[74px_1fr] gap-2">
              <span className="font-medium opacity-95">{keyText}</span>
              <span className="opacity-70">{desc}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          {rightHints.map(([keyText, desc]) => (
            <div key={keyText} className="grid grid-cols-[78px_1fr] gap-2">
              <span className="font-medium opacity-95">{keyText}</span>
              <span className="opacity-70">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
