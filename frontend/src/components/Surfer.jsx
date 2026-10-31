// narančasti surfer iz dizajna, crtan SVG-om; položaj i nagib dobiva od vala
export default function Surfer({ lijevo, gore, nagib }) {
  return (
    <div
      aria-hidden="true"
      className="surfer"
      style={{ left: lijevo, top: gore, transform: `translate(-50%, -84%) rotate(${nagib}deg)` }}
    >
      <svg width="116" height="116" viewBox="0 0 100 100" fill="none">
        <g fill="#F58426">
          <circle cx="5" cy="73" r="1.7" />
          <circle cx="10" cy="68.5" r="1.3" />
          <circle cx="3" cy="64" r="1" />
          <circle cx="13" cy="74.5" r="1.1" />
          <circle cx="8" cy="60" r="0.8" />
        </g>
        <path d="M1 79 C 6 77.5, 10 78, 14 80" stroke="#F58426" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M21 85 L 17 93 L 28 86.5 Z" fill="#F58426" />
        <path d="M6 82 C 30 76, 70 74, 91 77 C 96 77.5, 97.5 79, 94 80.6 C 70 86, 30 88, 6 82 Z" fill="#F58426" />
        <path d="M14 82 C 40 79, 68 78, 89 78.6" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="0.9" strokeLinecap="round" />
        <g stroke="#F58426" strokeLinecap="round" strokeLinejoin="round">
          <path d="M30 79 L 34 66 L 45 58" strokeWidth="6" />
          <path d="M63 77 L 61 64 L 49 58" strokeWidth="6" />
          <path d="M47 58 L 55 40" strokeWidth="9" />
          <path d="M52 43 L 40 40 L 30 46" strokeWidth="4.6" />
          <path d="M57 42 L 68 40 L 79 33" strokeWidth="4.6" />
        </g>
        <path d="M26 79.5 L 34 79" stroke="#F58426" strokeWidth="4" strokeLinecap="round" />
        <path d="M60 77.3 L 68 77" stroke="#F58426" strokeWidth="4" strokeLinecap="round" />
        <circle cx="59" cy="30" r="6.6" fill="#F58426" />
        <path d="M53.2 29.5 C 52.5 21.5, 63.5 20, 65.2 27" stroke="#121314" strokeWidth="2" strokeLinecap="round" />
        <rect x="55.2" y="27.6" width="4.6" height="6.4" rx="1.2" fill="#121314" transform="rotate(-12 57.5 30.8)" />
      </svg>
    </div>
  );
}
