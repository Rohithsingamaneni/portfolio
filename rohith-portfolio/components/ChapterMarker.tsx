type ChapterMarkerProps = {
  label: string;
};

export default function ChapterMarker({ label }: ChapterMarkerProps) {
  return (
    <div className="chapter-marker" aria-hidden="true">
      <div className="chapter-marker__rule" />
      <div className="chapter-marker__label">{label}</div>
      <div className="chapter-marker__rule" />
    </div>
  );
}
