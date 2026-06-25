// 프로필 사진 업로드 → 정사각 크롭 → WebP 리사이즈 (부서 실무 담당용)
const MAX_BYTES = 120_000; // ~120KB
const DEFAULT_SIZE = 128;

export async function resizeAvatarFile(
  file: File,
  size = DEFAULT_SIZE,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드할 수 있습니다.");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("8MB 이하 이미지만 업로드할 수 있습니다.");
  }

  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - side) / 2;
  const sy = (bitmap.height - side) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("캔버스를 사용할 수 없습니다.");

  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, size, size);
  bitmap.close();

  let quality = 0.88;
  let blob = await canvasToWebp(canvas, quality);
  while (blob.size > MAX_BYTES && quality > 0.45) {
    quality -= 0.08;
    blob = await canvasToWebp(canvas, quality);
  }
  if (blob.size > MAX_BYTES) {
    throw new Error("이미지가 너무 큽니다. 다른 사진을 선택해 주세요.");
  }

  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

function canvasToWebp(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("WebP 변환 실패"))),
      "image/webp",
      quality,
    );
  });
}

export function deptRealAvatarUrl(slug: string, version?: number | string): string {
  const v = version ? `?v=${version}` : "";
  return `/api/departments/${encodeURIComponent(slug)}/avatar${v}`;
}
