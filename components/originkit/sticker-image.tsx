"use client";

import StickerPeeling from "@/components/originkit/ui/sticker-peel";

/**
 * StickerImage —— 网站图文卡片用的「贴纸撕开」动效包装
 * 图片以贴纸形式呈现：悬停时微微卷起（hoverPeel），按住时进一步撕开（pressPeel），
 * 露出宣纸白底；参数按网站色调调整（底色 #ffffff、柔和墨色阴影）。
 */
export function StickerImage({
  src,
  alt,
  width = 360,
  height = 273,
  hoverPeel = 26,
  pressPeel = 48,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  hoverPeel?: number;
  pressPeel?: number;
}) {
  return (
    <div className="flex w-full items-center justify-center" role="img" aria-label={alt} title={alt}>
      <StickerPeeling
        image={{ src }}
        imageWidth={width}
        imageHeight={height}
        hoverPeel={hoverPeel}
        pressPeel={pressPeel}
        curlRotation={220}
        backColor="#ffffff"
        shadowEnabled
        shadow={{ opacity: 24, color: "#2c2416", x: -160, y: 90 }}
      />
    </div>
  );
}
