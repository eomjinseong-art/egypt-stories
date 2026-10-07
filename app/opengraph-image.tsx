import { ImageResponse } from "next/og";

export const alt = "이집트이야기 · 쉬운 이집트 역사";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@700&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const title = "이집트이야기";
  const sub = "어려운 이집트 역사를, 짧은 한국어로";
  const font = await loadFont(`${title}${sub}EGYPT STORIES 나일 파라오 신전 피라미드`);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#f6f0e4",
          color: "#3c2e16",
          padding: "72px",
          borderTop: "18px solid #0f5e5c",
          borderBottom: "18px solid #8a6420",
          fontFamily: font ? "NotoSerifKR" : "serif",
        }}
      >
        <div style={{ color: "#8a6420", fontSize: 28, letterSpacing: 8 }}>EGYPT STORIES</div>
        <div style={{ marginTop: 20, fontSize: 92 }}>{title}</div>
        <div style={{ marginTop: 18, fontSize: 34, color: "#6a5c48" }}>{sub}</div>
        <div style={{ marginTop: 36, fontSize: 26, color: "#0f5e5c" }}>나일 · 파라오 · 신전 · 피라미드 · 클레오파트라</div>
      </div>
    ),
    {
      ...size,
      ...(font ? { fonts: [{ name: "NotoSerifKR", data: font, weight: 700 as const, style: "normal" as const }] } : {}),
    },
  );
}
