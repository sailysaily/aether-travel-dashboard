import { useChartData } from '../hooks/useChartData';
import { KPIStrip } from '../components/overview/KPIStrip';
import { DeclineReasonChart } from '../components/overview/DeclineReasonChart';
import { SoftHardDonut } from '../components/overview/SoftHardDonut';
import { TrendLineChart } from '../components/overview/TrendLineChart';
import { ByPaymentMethod } from '../components/overview/ByPaymentMethod';
import { ByCountryChart } from '../components/overview/ByCountryChart';

export default function Overview() {
  const { kpis, declineReasons, softHard, trend, byMethod, byCountry } = useChartData();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Payment Intelligence</h1>
        <p className="text-sm text-gray-500 mt-0.5">Jan 11 – Feb 24, 2026 · 450 transactions across Southeast Asia</p>
      </div>

      <KPIStrip kpis={kpis} />

      {/* Soft/Hard explanation banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">How to read this dashboard: </span>
          <span className="text-amber-700 font-semibold">Amber = Soft Declines</span> (temporary, retriable — revenue recovery is possible) ·{' '}
          <span className="text-rose-700 font-semibold">Rose = Hard Declines</span> (permanent — customer must act). Focus your team's energy on soft declines first.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DeclineReasonChart data={declineReasons} />
        </div>
        <SoftHardDonut data={softHard} />
      </div>

      <TrendLineChart data={trend} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ByPaymentMethod data={byMethod} />
        <ByCountryChart data={byCountry} />
      </div>
    </div>
  );
}
