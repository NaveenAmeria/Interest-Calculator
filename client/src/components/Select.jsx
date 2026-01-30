export default function Select({ style, children, ...props }) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid var(--border)",
        outline: "none",
        background: "white",
        ...style
      }}
    >
      {children}
    </select>
  );
}
