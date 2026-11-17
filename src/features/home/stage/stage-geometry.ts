import type { CanvasAnnotation } from '@/features/home/stage/stage-types';

/**
 * 【切线几何】【放大镜连线】计算源取景圆与放大镜圆的两条外公切线端点（复刻 08-magnifier.png）
 * @param x1 源圆心 X
 * @param y1 源圆心 Y
 * @param r1 源半径
 * @param x2 镜框圆心 X
 * @param y2 镜框圆心 Y
 * @param r2 镜框半径
 * @returns 两条外公切线段坐标数组
 */
export function computeOuterTangents(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number
): Array<[number, number, number, number]> {
  // 1. 计算两圆心欧氏距离并排除内含退化情形
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  if (dist <= Math.abs(r2 - r1) + 1) {
    return [];
  }
  // 2. 求解外公切线法向偏角并映射至两圆周切点
  const baseAngle = Math.atan2(dy, dx);
  const offset = Math.acos(Math.max(-1, Math.min(1, (r1 - r2) / dist)));
  return [baseAngle + offset, baseAngle - offset].map((theta) => [
    x1 + r1 * Math.cos(theta),
    y1 + r1 * Math.sin(theta),
    x2 + r2 * Math.cos(theta),
    y2 + r2 * Math.sin(theta),
  ]);
}

/**
 * 【图元包围盒】【外扩控制框】计算任意标注图元在选中态下的外扩边界框（用于绘制 16-selected-annotation.png 橙色虚线框）
 * @param item 标注图元
 * @returns 包含留白的外扩矩形
 */
export function getPaddedBounds(item: CanvasAnnotation): {
  x: number;
  y: number;
  w: number;
  h: number;
} {
  const pad = 7;
  switch (item.kind) {
    case 'rect':
    case 'ellipse':
    case 'redact':
      return {
        x: item.x - pad,
        y: item.y - pad,
        w: item.w + pad * 2,
        h: item.h + pad * 2,
      };
    case 'arrow':
    case 'line':
    case 'ruler': {
      const minX = Math.min(item.x1, item.x2);
      const minY = Math.min(item.y1, item.y2);
      return {
        x: minX - pad,
        y: minY - pad,
        w: Math.max(24, Math.abs(item.x2 - item.x1)) + pad * 2,
        h: Math.max(24, Math.abs(item.y2 - item.y1)) + pad * 2,
      };
    }
    case 'number': {
      const minX =
        item.tailX !== undefined ? Math.min(item.x - 14, item.tailX) : item.x - 14;
      const minY =
        item.tailY !== undefined ? Math.min(item.y - 14, item.tailY) : item.y - 14;
      const maxX =
        item.tailX !== undefined ? Math.max(item.x + 14, item.tailX) : item.x + 14;
      const maxY =
        item.tailY !== undefined ? Math.max(item.y + 14, item.tailY) : item.y + 14;
      return {
        x: minX - 5,
        y: minY - 5,
        w: maxX - minX + 10,
        h: maxY - minY + 10,
      };
    }
    case 'magnifier': {
      const minX = Math.min(item.srcX - 20, item.lensX - item.lensRadius);
      const minY = Math.min(item.srcY - 20, item.lensY - item.lensRadius);
      const maxX = Math.max(item.srcX + 20, item.lensX + item.lensRadius);
      const maxY = Math.max(item.srcY + 20, item.lensY + item.lensRadius);
      return {
        x: minX - 5,
        y: minY - 5,
        w: maxX - minX + 10,
        h: maxY - minY + 10,
      };
    }
    case 'text':
      return { x: item.x - 6, y: item.y - 6, w: 180, h: item.fontSize + 16 };
    case 'pen':
    case 'highlighter': {
      const xs = item.points.map((pt) => pt.x);
      const ys = item.points.map((pt) => pt.y);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      return {
        x: minX - pad,
        y: minY - pad,
        w: Math.max(20, Math.max(...xs) - minX) + pad * 2,
        h: Math.max(20, Math.max(...ys) - minY) + pad * 2,
      };
    }
  }
}
