export function LogoMark({ width = 56 }: { width?: number }) {
  return (
    <img
      src="/brand/dualcode-logo-sm.png"
      width={width}
      height={Math.round(width * 0.506)}
      alt=""
      decoding="async"
    />
  );
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo-word">DualCode</span>
    </span>
  );
}
