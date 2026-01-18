
import type { JdfData } from '../types';

// Helper to convert units to points (JDF standard)
const convertToPoints = (value: number, units: JdfData['units']): number => {
  switch (units) {
    case 'inches':
      return value * 72;
    case 'mm':
      return value * 2.83465;
    case 'points':
    default:
      return value;
  }
};

export const generateJdfXml = (data: JdfData): string => {
  const now = new Date().toISOString();
  const widthInPoints = convertToPoints(data.width, data.units);
  const heightInPoints = convertToPoints(data.height, data.units);
  
  const escapeXml = (unsafe: string): string => {
      return unsafe.replace(/[<>&'"]/g, (c) => {
          switch (c) {
              case '<': return '&lt;';
              case '>': return '&gt;';
              case '&': return '&amp;';
              case '\'': return '&apos;';
              case '"': return '&quot;';
              default: return c;
          }
      });
  };

  const jobName = escapeXml(data.jobName);
  const paperType = escapeXml(data.paperType);
  const finishing = escapeXml(data.finishingInstructions);

  return `<?xml version="1.0" encoding="UTF-8"?>
<JDF ID="root" JobID="${jobName.replace(/\s+/g, '_')}" Status="Waiting" Type="Combined" Version="1.5"
     xmlns="http://www.CIP4.org/JDFSchema_1_1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <AuditPool>
    <Created AgentName="GeminiJDFCreator" TimeStamp="${now}"/>
  </AuditPool>
  <ResourcePool>
    <Component ID="Component_Final" Class="Quantity" ComponentType="FinalProduct" Status="Unavailable" Amount="${data.quantity}"/>
    <CustomerInfo ID="CustomerInfo_1" CustomerID="Customer_1"/>
    <DigitalPrintingParams ID="DPP_1" Class="Parameter" Status="Available" PartIDKeys="SheetName">
      <MediaRef rRef="Media_1"/>
    </DigitalPrintingParams>
    <Component ID="Component_Sheet" Class="Quantity" ComponentType="Sheet" Status="Available" Amount="${data.quantity * data.pageCount}">
      <LayoutElement>
          <FileSpec URL="file:///path/to/document.pdf"/>
      </LayoutElement>
    </Component>
    <Media ID="Media_1" Class="Consumable" Status="Available" Dimension="${widthInPoints} ${heightInPoints}" MediaType="Paper" Weight="${paperType ? '0' : ''}" MediaColorName="White">
        ${paperType ? `<MediaTypeDetails>${paperType}</MediaTypeDetails>` : ''}
    </Media>
    <RunList ID="RunList_1" Class="Parameter" Status="Available" NPage="${data.pageCount}">
        <LayoutElement>
            <FileSpec MimeType="application/pdf" URL="file:///path/to/document.pdf"/>
        </LayoutElement>
    </RunList>
    ${finishing !== 'None' && finishing !== '' ? `<BindingIntent ID="BindingIntent_1" />
    <FinishingIntent ID="FinishingIntent_1">
        <string>${finishing}</string>
    </FinishingIntent>` : ''}
  </ResourcePool>
  <ResourceLinkPool>
    <CustomerInfoLink rRef="CustomerInfo_1" Usage="Input"/>
    <ComponentLink rRef="Component_Sheet" Usage="Input" Amount="${data.quantity * data.pageCount}"/>
    <DigitalPrintingParamsLink rRef="DPP_1" Usage="Input"/>
    <MediaLink rRef="Media_1" Usage="Input"/>
    <RunListLink rRef="RunList_1" Usage="Input"/>
    <ComponentLink rRef="Component_Final" Usage="Output" Amount="${data.quantity}"/>
    ${finishing !== 'None' && finishing !== '' ? `<BindingIntentLink rRef="BindingIntent_1" Usage="Input"/>
    <FinishingIntentLink rRef="FinishingIntent_1" Usage="Input"/>` : ''}
  </ResourceLinkPool>
</JDF>`;
};
