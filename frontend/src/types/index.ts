export interface FrameSequenceState {
  currentFrame: number;
  totalFrames: number;
  loadedCount: number;
  isReady: boolean;
  progressPercentage: number;
}

export interface StoryPhase {
  id: string;
  startProgress: number; // e.g. 0.0
  endProgress: number;   // e.g. 0.18
  eyebrow: string;
  headline: string;
  subheadline?: string;
  body?: string;
  bullets?: string[];
  ctaText?: string;
  ctaAction?: string;
  align: 'center' | 'left' | 'right';
}
