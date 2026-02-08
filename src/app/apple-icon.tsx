import { ImageResponse } from "next/og";

// ヘッダーと同じロゴ (public/icon.svg) — ホーム画面用 180x180
const LOGO_SVG = `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><g><path d="M32,6L32,26C32,29.311 29.311,32 26,32L6,32C2.689,32 0,29.311 0,26L0,6C0,2.689 2.689,0 6,0L26,0C29.311,0 32,2.689 32,6Z" fill="rgb(14,165,233)"/><g transform="matrix(0.03769,0,0,0.03769,16,14.856)"><path d="M0,-261.072C-114.903,-261.072 -208.057,-167.954 -208.057,-53.046C-208.057,-7.896 -193.672,33.895 -169.236,68.003C-119.603,137.267 -74.787,209.863 -36.257,285.872L-26.218,305.681C-20.776,316.415 -10.388,321.782 0,321.782C10.388,321.782 20.776,316.415 26.218,305.681L36.258,285.872C74.787,209.863 119.603,137.267 169.238,68.003C193.672,33.895 208.057,-7.896 208.057,-53.046C208.057,-167.954 114.903,-261.072 0,-261.072" fill="white" fill-rule="nonzero"/></g><g transform="matrix(0.924713,0,0,0.924713,1.205,2.514)"><path d="M13.2,12.8L13.2,9.295C13.2,8.629 14.133,8.295 16,8.295C17.867,8.295 18.8,8.629 18.8,9.295L18.8,12.8C18.8,13.467 17.867,13.8 16,13.8C14.133,13.8 13.2,13.467 13.2,12.8Z" fill="rgb(14,165,233)"/></g></g></svg>`;

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG).toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
        }}
      >
        <img src={dataUrl} width={180} height={180} style={{ objectFit: "contain" }} alt="" />
      </div>
    ),
    { ...size }
  );
}
