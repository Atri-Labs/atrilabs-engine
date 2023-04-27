import React, { forwardRef, ReactElement, useMemo } from "react";
import ReactPlayer from "react-player";
import { Config } from "react-player";

interface SourceProps {
  media?: string;
  src: string;
  type?: string;
}

export interface OnProgressProps {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
}

const Video = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      id: string;
      class: string;
    }
    className?: string;
    custom: {
      url?: string | string[] | SourceProps[] | MediaStream;
      playing?: boolean;
      loop?: boolean;
      controls?: boolean;
      volume?: number;
      muted?: boolean;
      playbackRate?: number;
      progressInterval?: number;
      playsinline?: boolean;
      playIcon?: ReactElement;
      previewTabIndex?: number | null;
      pip?: boolean;
      stopOnUnmount?: boolean;
      light?: boolean | string | ReactElement;
      fallback?: ReactElement;
      config?: Config;
      onReady?: (player: ReactPlayer) => void;
      onStart?: () => void;
      onPlay?: () => void;
      onPause?: () => void;
      onBuffer?: () => void;
      onBufferEnd?: () => void;
      onEnded?: () => void;
      onClickPreview?: (event: any) => void;
      onEnablePIP?: () => void;
      onDisablePIP?: () => void;
      onError?: (
        error: any,
        data?: any,
        hlsInstance?: any,
        hlsGlobal?: any
      ) => void;
      onDuration?: (duration: number) => void;
      onSeek?: (seconds: number) => void;
      onProgress?: (state: OnProgressProps) => void;
      [otherProps: string]: any;
      getCurrentTime(): number;
      getSecondsLoaded(): number;
      getDuration(): number;
      getInternalPlayer(key?: string): Record<string, any>;
      showPreview(): void;
    };
  }
>((props, ref) => {
  const { custom } = props;
  const key = useMemo(() => {
    if (props.custom.controls) {
      return Math.random();
    }
  }, [props.custom.controls]);

  // moved ref to div, as the Antd ReactPlayer doesn't provide ref for ReactPlayer
  return (
    <div
      ref={ref}
      style={{ display: "inline-block" }}
      id={props.attrs.id}
      className={props.className}
    >
      <ReactPlayer
        className={`${props.className} ${props.attrs.class}`}
        style={props.styles}
        {...custom}
        height={props.styles.height}
        width={props.styles.width}
        playIcon={
          props.custom.playIcon && typeof props.custom.playIcon === "string" ? (
            <img src={props.custom.playIcon} alt={props.custom.playIcon} />
          ) : (
            props.custom.playIcon
          )
        }
        fallback={
          props.custom.fallback && typeof props.custom.fallback === "string" ? (
            <img src={props.custom.fallback} alt={props.custom.fallback} />
          ) : (
            props.custom.fallback
          )
        }
        key={key}
      />
    </div>
  );
});

export default Video;
