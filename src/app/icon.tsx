import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon generado del wordmark de marca — mismo color/estilo que Logo.tsx, sin depender de un archivo de diseño externo. */
export default function Icon() {
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
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
          borderRadius: 6,
        }}
      >
        NP
      </div>
    ),
    { ...size },
  );
}
