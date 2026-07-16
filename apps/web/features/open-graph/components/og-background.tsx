export function OgBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#0f172a', // slate-900
        display: 'flex',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(56, 189, 248, 0.25) 0%, rgba(15, 23, 42, 0) 50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.25) 0%, rgba(15, 23, 42, 0) 50%)',
        }}
      />
    </div>
  );
}
