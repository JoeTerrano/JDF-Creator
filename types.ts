
export interface JdfData {
  jobName: string;
  pageCount: number;
  width: number;
  height: number;
  units: 'points' | 'inches' | 'mm';
  colorIntent: 'CMYK' | 'RGB' | 'Grayscale' | 'Other';
  quantity: number;
  paperType: string;
  finishingInstructions: string;
}
