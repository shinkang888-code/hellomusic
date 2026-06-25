/** HELLO 로고 물결 모티브 섹션 구분선 */
export function HelloWaveDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`hello-wave-divider ${className}`} aria-hidden>
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="block h-8 w-full sm:h-12">
        <path
          fill="currentColor"
          d="M0,24 C240,48 480,0 720,24 C960,48 1200,0 1440,24 L1440,48 L0,48 Z"
        />
      </svg>
    </div>
  );
}
