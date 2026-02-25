import { useChartData } from '../hooks/useChartData';
import { ComparisonView } from '../components/comparison/ComparisonView';

export default function Comparison() {
  const { trendByMethod, trendByCountry } = useChartData();
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Trend Comparison</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Decline rate over 45 days — broken down by payment method and country
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          Use these charts to identify <strong>which channels and markets</strong> are driving your decline rate up.
          Bank Transfer consistently shows the highest decline rate across all markets.
        </p>
      </div>
      <ComparisonView methodData={trendByMethod} countryData={trendByCountry} />
    </div>
  );
}
