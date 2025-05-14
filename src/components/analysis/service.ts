//import { request } from '@umijs/max';
import type { AnalysisData } from './data';
import { getMudhosvo } from './mdata';

export async function fakeChartData(): Promise<{ data: AnalysisData }> {
  return getMudhosvo();  // request('/api/fake_analysis_chart_data');
}
