export default function Footer({ profile }) {
  const socials = [
    ["ArtStation", profile?.artstation_url],
    ["Sketchfab", profile?.sketchfab_url],
    ["Instagram", profile?.instagram_url],
    ["LinkedIn", profile?.linkedin_url],
  ].filter(([, url]) => url);

  return (
    <footer className="footer">
      <span className="eyebrow">© {new Date().getFullYear()} {profile?.name || "Polyaymen"}</span>
      {socials.length > 0 && (
        <div className="footer-socials">
          {socials.map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noreferrer">{label}</a>
          ))}
        </div>
      )}
    </footer>
  );
}
