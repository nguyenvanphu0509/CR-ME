/**
 * Preloader and Canvas Renderer for the ice cream frame sequence
 */

import { brand, BRAND_CONFIG } from '@/config/brand';

export function getFramePath(frameIndex: number): string {
  // frameIndex is 1-indexed (1 to 300)
  const paddedNumber = String(frameIndex).padStart(3, '0');
  return `${BRAND_CONFIG.sequencePathPrefix}${paddedNumber}.png`;
}

export class FrameSequenceManager {
  private images: Map<number, HTMLImageElement> = new Map();
  private totalFrames: number;
  private loadedCount: number = 0;
  private onProgressCallback?: (progress: number, loadedCount: number) => void;

  constructor(totalFrames: number = BRAND_CONFIG.sequenceTotalFrames) {
    this.totalFrames = totalFrames;
  }

  /**
  * Preload critical initial frames first, then load remaining in batches
   */
  public async loadFrames(
    onProgress?: (progress: number, loadedCount: number) => void
  ): Promise<void> {
    this.onProgressCallback = onProgress;
    this.loadedCount = 0;

    // Load initial batch fast (first 40 frames and final frame)
    const priorityIndices: number[] = [];
    for (let i = 1; i <= 40; i++) priorityIndices.push(i);
    priorityIndices.push(this.totalFrames);

    const remainingIndices: number[] = [];
    for (let i = 41; i < this.totalFrames; i++) {
      remainingIndices.push(i);
    }

    // Load priority frames first
    await Promise.all(priorityIndices.map(idx => this.loadSingleImage(idx)));

    // Load remaining frames asynchronously in parallel chunks
    const chunkSize = 15;
    for (let i = 0; i < remainingIndices.length; i += chunkSize) {
      const chunk = remainingIndices.slice(i, i + chunkSize);
      await Promise.all(chunk.map(idx => this.loadSingleImage(idx)));
    }
  }

  private loadSingleImage(index: number): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      if (this.images.has(index)) {
        resolve(this.images.get(index)!);
        return;
      }

      const img = new Image();
      img.src = getFramePath(index);
      img.onload = () => {
        this.images.set(index, img);
        this.loadedCount++;
        const pct = Math.round((this.loadedCount / this.totalFrames) * 100);
        this.onProgressCallback?.(pct, this.loadedCount);
        resolve(img);
      };
      img.onerror = () => {
        // Fallback gracefully if single image fails
        this.loadedCount++;
        const pct = Math.round((this.loadedCount / this.totalFrames) * 100);
        this.onProgressCallback?.(pct, this.loadedCount);
        resolve(img);
      };
    });
  }

  public getImage(index: number): HTMLImageElement | undefined {
    // Return exact image, or nearest cached image if still loading
    if (this.images.has(index)) {
      return this.images.get(index);
    }
    // Search nearby loaded frame to prevent gaps
    for (let delta = 1; delta < 15; delta++) {
      if (this.images.has(index - delta)) return this.images.get(index - delta);
      if (this.images.has(index + delta)) return this.images.get(index + delta);
    }
    return this.images.get(1);
  }

  /**
   * Draw specific frame onto canvas with contain-scaling & high DPI support
   */
  public renderFrameToCanvas(
    canvas: HTMLCanvasElement,
    frameIndex: number,
    bgColor: string = brand.background
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = this.getImage(frameIndex);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Resize canvas buffer if needed for high DPI
    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Fill dark background seamlessly
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    if (img && img.complete && img.naturalWidth > 0) {
      // Calculate contain bounds for 16:9 image frame inside canvas
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const imgAspect = imgWidth / imgHeight;
      const canvasAspect = displayWidth / displayHeight;

      let drawWidth: number;
      let drawHeight: number;

      if (canvasAspect > imgAspect) {
        // Viewport is wider than 16:9
        drawHeight = displayHeight;
        drawWidth = displayHeight * imgAspect;
      } else {
        // Viewport is taller than 16:9
        drawWidth = displayWidth;
        drawHeight = displayWidth / imgAspect;
      }

      const drawX = (displayWidth - drawWidth) / 2;
      const drawY = (displayHeight - drawHeight) / 2;

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }

    ctx.restore();
  }
}
