"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import "./OrbitImages.css";

function generateEllipsePath(cx, cy, rx, ry) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}

function generateCirclePath(cx, cy, radius) {
  return generateEllipsePath(cx, cy, radius, radius);
}

function generateSquarePath(cx, cy, size) {
  const half = size / 2;
  return `M ${cx - half} ${cy - half} L ${cx + half} ${cy - half} L ${cx + half} ${cy + half} L ${cx - half} ${cy + half} Z`;
}

function generateRectanglePath(cx, cy, width, height) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  return `M ${cx - halfWidth} ${cy - halfHeight} L ${cx + halfWidth} ${cy - halfHeight} L ${cx + halfWidth} ${cy + halfHeight} L ${cx - halfWidth} ${cy + halfHeight} Z`;
}

function generateTrianglePath(cx, cy, size) {
  const height = (size * Math.sqrt(3)) / 2;
  const half = size / 2;
  return `M ${cx} ${cy - height / 1.5} L ${cx + half} ${cy + height / 3} L ${cx - half} ${cy + height / 3} Z`;
}

function generateStarPath(cx, cy, outerRadius, innerRadius, points) {
  const step = Math.PI / points;
  let path = "";

  for (let index = 0; index < 2 * points; index += 1) {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = index * step - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    path += index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }

  return `${path} Z`;
}

function generateHeartPath(cx, cy, size) {
  const scale = size / 30;
  return `M ${cx} ${cy + 12 * scale} C ${cx - 20 * scale} ${cy - 5 * scale}, ${cx - 12 * scale} ${cy - 18 * scale}, ${cx} ${cy - 8 * scale} C ${cx + 12 * scale} ${cy - 18 * scale}, ${cx + 20 * scale} ${cy - 5 * scale}, ${cx} ${cy + 12 * scale}`;
}

function generateInfinityPath(cx, cy, width, height) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  return `M ${cx} ${cy} C ${cx + halfWidth * 0.5} ${cy - halfHeight}, ${cx + halfWidth} ${cy - halfHeight}, ${cx + halfWidth} ${cy} C ${cx + halfWidth} ${cy + halfHeight}, ${cx + halfWidth * 0.5} ${cy + halfHeight}, ${cx} ${cy} C ${cx - halfWidth * 0.5} ${cy + halfHeight}, ${cx - halfWidth} ${cy + halfHeight}, ${cx - halfWidth} ${cy} C ${cx - halfWidth} ${cy - halfHeight}, ${cx - halfWidth * 0.5} ${cy - halfHeight}, ${cx} ${cy}`;
}

function generateWavePath(cx, cy, width, amplitude, waves) {
  const points = [];
  const segments = waves * 20;
  const halfWidth = width / 2;

  for (let index = 0; index <= segments; index += 1) {
    const x = cx - halfWidth + (width * index) / segments;
    const y =
      cy + Math.sin((index / segments) * waves * 2 * Math.PI) * amplitude;
    points.push(index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }

  for (let index = segments; index >= 0; index -= 1) {
    const x = cx - halfWidth + (width * index) / segments;
    const y =
      cy - Math.sin((index / segments) * waves * 2 * Math.PI) * amplitude;
    points.push(`L ${x} ${y}`);
  }

  return `${points.join(" ")} Z`;
}

function OrbitItem({
  item,
  index,
  totalItems,
  path,
  itemSize,
  rotation,
  progress,
  fill,
}) {
  const itemOffset = fill ? (index / totalItems) * 100 : 0;
  const offsetDistance = useTransform(progress, (value) => {
    const offset = (((value + itemOffset) % 100) + 100) % 100;
    return `${offset}%`;
  });

  return (
    <motion.div
      className="orbit-item"
      style={{
        width: itemSize,
        height: itemSize,
        offsetPath: `path("${path}")`,
        offsetRotate: "0deg",
        offsetAnchor: "center center",
        offsetDistance,
      }}
    >
      <div style={{ transform: `rotate(${-rotation}deg)` }}>{item}</div>
    </motion.div>
  );
}

/**
 * React Bits `OrbitImages`, with two local changes:
 *
 * 1. `"use client"` + `useReducedMotion` — the site's motion contract says
 *    every loop stops under `prefers-reduced-motion`, and an orbit that never
 *    stops is exactly the kind of thing that rule exists for.
 * 2. An optional `items` prop. Upstream only orbits `<img>` URLs; the hero
 *    orbits the site's own `InstrumentIcon` coin discs, which are components,
 *    not files. `items` takes precedence when both are passed, and `images`
 *    behaves exactly as it does upstream when it is not.
 */
export default function OrbitImages({
  images = [],
  items: itemNodes,
  altPrefix = "Orbiting image",
  shape = "ellipse",
  customPath,
  baseWidth = 1400,
  radiusX = 700,
  radiusY = 170,
  radius = 300,
  starPoints = 5,
  starInnerRatio = 0.5,
  rotation = -8,
  duration = 40,
  itemSize = 64,
  direction = "normal",
  fill = true,
  width = 100,
  height = 100,
  className = "",
  showPath = false,
  pathColor = "rgba(0, 0, 0, 0.1)",
  pathWidth = 2,
  easing = "linear",
  paused = false,
  centerContent,
  responsive = false,
}) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(null);
  const reducedMotion = useReducedMotion();
  const progress = useMotionValue(0);

  const designCenterX = baseWidth / 2;
  const designCenterY = baseWidth / 2;

  const path = useMemo(() => {
    switch (shape) {
      case "circle":
        return generateCirclePath(designCenterX, designCenterY, radius);
      case "ellipse":
        return generateEllipsePath(
          designCenterX,
          designCenterY,
          radiusX,
          radiusY
        );
      case "square":
        return generateSquarePath(designCenterX, designCenterY, radius * 2);
      case "rectangle":
        return generateRectanglePath(
          designCenterX,
          designCenterY,
          radiusX * 2,
          radiusY * 2
        );
      case "triangle":
        return generateTrianglePath(designCenterX, designCenterY, radius * 2);
      case "star":
        return generateStarPath(
          designCenterX,
          designCenterY,
          radius,
          radius * starInnerRatio,
          starPoints
        );
      case "heart":
        return generateHeartPath(designCenterX, designCenterY, radius * 2);
      case "infinity":
        return generateInfinityPath(
          designCenterX,
          designCenterY,
          radiusX * 2,
          radiusY * 2
        );
      case "wave":
        return generateWavePath(
          designCenterX,
          designCenterY,
          radiusX * 2,
          radiusY,
          3
        );
      case "custom":
        return (
          customPath || generateCirclePath(designCenterX, designCenterY, radius)
        );
      default:
        return generateEllipsePath(
          designCenterX,
          designCenterY,
          radiusX,
          radiusY
        );
    }
  }, [
    baseWidth,
    customPath,
    designCenterX,
    designCenterY,
    radius,
    radiusX,
    radiusY,
    shape,
    starInnerRatio,
    starPoints,
  ]);

  useLayoutEffect(() => {
    if (!responsive || !containerRef.current) return undefined;

    const container = containerRef.current;
    const updateScale = () => setScale(container.clientWidth / baseWidth);
    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [baseWidth, responsive]);

  useEffect(() => {
    if (paused || reducedMotion) return undefined;

    const controls = animate(progress, direction === "reverse" ? -100 : 100, {
      duration,
      ease: easing,
      repeat: Infinity,
      repeatType: "loop",
    });

    return () => controls.stop();
  }, [direction, duration, easing, paused, progress, reducedMotion]);

  const containerWidth = responsive
    ? "100%"
    : typeof width === "number"
      ? width
      : "100%";
  const containerHeight = responsive
    ? "auto"
    : typeof height === "number"
      ? height
      : typeof width === "number"
        ? width
        : "auto";
  const items =
    itemNodes && itemNodes.length > 0
      ? itemNodes
      : images.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`${altPrefix} ${index + 1}`}
            draggable={false}
            className="orbit-image"
          />
        ));

  return (
    <div
      ref={containerRef}
      className={`orbit-container ${className}`}
      style={{
        width: containerWidth,
        height: containerHeight,
        aspectRatio: responsive ? "1 / 1" : undefined,
      }}
      aria-hidden="true"
    >
      <div
        className={
          responsive
            ? "orbit-scaling-container orbit-scaling-container--responsive"
            : "orbit-scaling-container"
        }
        style={{
          width: responsive ? baseWidth : "100%",
          height: responsive ? baseWidth : "100%",
          transform:
            responsive && scale !== null
              ? `translate(-50%, -50%) scale(${scale})`
              : undefined,
          visibility: responsive && scale === null ? "hidden" : undefined,
        }}
      >
        <div
          className="orbit-rotation-wrapper"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {showPath && (
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${baseWidth} ${baseWidth}`}
              className="orbit-path-svg"
            >
              <path
                d={path}
                fill="none"
                stroke={pathColor}
                strokeWidth={pathWidth / (scale ?? 1)}
              />
            </svg>
          )}

          {items.map((item, index) => (
            <OrbitItem
              key={index}
              item={item}
              index={index}
              totalItems={items.length}
              path={path}
              itemSize={itemSize}
              rotation={rotation}
              progress={progress}
              fill={fill}
            />
          ))}
        </div>
      </div>

      {centerContent && (
        <div className="orbit-center-content">{centerContent}</div>
      )}
    </div>
  );
}
