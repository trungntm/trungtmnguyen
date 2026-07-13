type GoogleAnalyticsScriptProps = {
  measurementIds: string[];
};

function getConfigScriptContent(measurementIds: string[]) {
  return `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
window.gtag('js', new Date());
${measurementIds
  .map(
    (measurementId) =>
      `window.gtag('config', ${JSON.stringify(measurementId)}, { send_page_view: false });`,
  )
  .join('\n')}
`;
}

export function GoogleAnalyticsScript({ measurementIds }: GoogleAnalyticsScriptProps) {
  const firstMeasurementId = measurementIds[0];

  if (!firstMeasurementId) {
    return null;
  }

  return (
    <>
      <script
        id="google-analytics-loader"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(firstMeasurementId)}`}
      />
      <script
        id="google-analytics-config"
        dangerouslySetInnerHTML={{
          __html: getConfigScriptContent(measurementIds),
        }}
      />
    </>
  );
}
