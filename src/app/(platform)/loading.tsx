const LETTERS = [
  // R
  "M0 18.958V0.131836H8.56934C12.4189 0.131836 14.3438 1.81494 14.3438 5.18115C14.3438 7.45752 12.8452 9.34277 9.84814 10.8369L15.8203 18.9844H11.417L5.68213 10.771V9.17578C9.02197 8.60449 10.6919 7.30811 10.6919 5.28662C10.6919 3.89795 9.90967 3.20361 8.34521 3.20361H3.55957V18.958H0Z",
  // E
  "M29.8882 0.131836V3.1377H20.4487V7.88379H29.4399V11.0083H20.4092V15.9521H30.0728V18.9844H16.9814V0.131836H29.8882Z",
  // C
  "M47.832 18.1934C46.2061 18.8086 44.3604 19.1162 42.2949 19.1162C35.5273 19.1162 32.1436 15.8423 32.1436 9.29443C32.1436 3.09814 35.5273 0 42.2949 0C44.3604 0 46.2061 0.307617 47.832 0.922852V4.08691C46.2061 3.38379 44.4482 3.03223 42.5586 3.03223C38.0322 3.03223 35.769 5.11963 35.769 9.29443C35.769 13.8208 38.0322 16.084 42.5586 16.084C44.4482 16.084 46.2061 15.7324 47.832 15.0293V18.1934Z",
  // A
  "M52.5659 18.9844H48.98L56.9824 0.131836H60.7397L68.9136 18.9844H65.1562L63.0073 13.8428H56.7451L57.9448 10.8105H61.7417L58.7754 3.73096L52.5659 18.9844Z",
  // L
  "M74.2144 0.131836V15.9521H81.7026V18.9844H70.7207V0.131836H74.2144Z",
  // L
  "M88.0054 0.131836V15.9521H95.4937V18.9844H84.5117V0.131836H88.0054Z",
];

export default function Loading() {
  return (
    <div className="flex h-full w-full min-h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg
          viewBox="-2 -2 100 24"
          className="w-48 overflow-visible text-[#1565C0] dark:text-[#1565C0]"
          role="img"
          aria-label="Carregando..."
        >
          {LETTERS.map((d, i) => (
            <path
              key={i}
              d={d}
              pathLength={1}
              className="recall-letter"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </svg>
      </div>

      <style>{`
        .recall-letter {
          stroke: currentColor;
          stroke-width: 0.35;
          stroke-linejoin: round;
          stroke-linecap: round;
          fill: currentColor;
          fill-opacity: 0;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: recall-draw 2.8s ease-in-out infinite;
        }
        @keyframes recall-draw {
          0% { stroke-dashoffset: 1; fill-opacity: 0; opacity: 1; }
          40% { stroke-dashoffset: 0; fill-opacity: 0; }
          58%, 84% { stroke-dashoffset: 0; fill-opacity: 1; opacity: 1; }
          96%, 100% { stroke-dashoffset: 0; fill-opacity: 1; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .recall-letter { animation: none; stroke-dashoffset: 0; fill-opacity: 1; }
        }
      `}</style>
    </div>
  );
}