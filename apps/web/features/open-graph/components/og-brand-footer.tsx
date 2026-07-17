export function OgBrandFooter({
  faviconSrc,
  faviconSize = 56,
}: {
  faviconSrc: string;
  faviconSize?: number;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: '28px',
            color: '#f8fafc', // slate-50
            fontWeight: 700,
          }}
        >
          Trung Nguyen
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={faviconSrc}
          alt="Trung Nguyen"
          width={faviconSize}
          height={faviconSize}
          style={{
            borderRadius: '25%', // Preserve original rounded corners approx
          }}
        />
        <span
          style={{
            fontSize: '28px',
            color: '#94a3b8', // slate-400
            fontWeight: 500,
          }}
        >
          trungtmnguyen.com
        </span>
      </div>
    </div>
  );
}
