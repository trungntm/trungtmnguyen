export function OgStatusBadge({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'flex-start',
        padding: '12px 24px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '999px',
        marginBottom: '48px',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: '#22c55e', // green-500
          marginRight: '12px',
          boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
        }}
      />
      <span
        style={{
          fontSize: '24px',
          color: '#e2e8f0', // slate-200
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  );
}
