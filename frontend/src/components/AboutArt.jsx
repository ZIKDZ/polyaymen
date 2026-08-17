export default function AboutArt() {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "4/5",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-hairline)",
        background:
          "radial-gradient(ellipse at 50% 40%, var(--color-accent-soft) 0%, var(--color-bg) 70%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg viewBox="0 0 200 220" width="62%" style={{ overflow: "visible" }}>
        <g stroke="var(--color-ink)" strokeWidth="1" strokeLinejoin="round">
          <polygon points="100,10 150,60 100,110 50,60" fill="var(--color-accent-soft)" />
          <polygon points="100,10 150,60 170,90 120,70" fill="var(--color-accent)" fillOpacity="0.55" />
          <polygon points="100,10 50,60 30,90 80,70" fill="var(--color-accent)" fillOpacity="0.3" />
          <polygon points="50,60 100,110 80,70" fill="var(--color-accent-soft)" />
          <polygon points="150,60 100,110 120,70" fill="var(--color-accent-soft)" />
          <polygon points="30,90 80,70 100,110 60,160" fill="none" />
          <polygon points="170,90 120,70 100,110 140,160" fill="none" />
          <polygon points="60,160 100,110 140,160 100,210" fill="var(--color-accent-soft)" />
          <polygon points="30,90 60,160 100,110" fill="var(--color-accent)" fillOpacity="0.18" />
          <polygon points="170,90 140,160 100,110" fill="var(--color-accent)" fillOpacity="0.18" />
        </g>
      </svg>
    </div>
  );
}