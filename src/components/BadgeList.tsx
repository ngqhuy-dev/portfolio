export function BadgeList({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={className}>
      {items.map((item) => (
        <span key={item} className="badge">
          {item}
        </span>
      ))}
    </div>
  );
}
