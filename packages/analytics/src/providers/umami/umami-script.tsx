type UmamiScriptProps = {
  scriptUrl: string;
  websiteId: string;
};

export function UmamiScript({ scriptUrl, websiteId }: UmamiScriptProps) {
  if (!scriptUrl || !websiteId) {
    return null;
  }

  return (
    <script
      async
      data-auto-track="false"
      data-website-id={websiteId}
      id={`umami-${websiteId}`}
      src={scriptUrl}
    />
  );
}
