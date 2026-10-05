import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** apple-touch-icon para cuando alguien agrega NoticiasPro a la pantalla de inicio en iOS. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "hsl(350, 78%, 36%)",
          color: "white",
          fontSize: 92,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
      >
        NP
      </div>
    ),
    { ...size },
  );
}
