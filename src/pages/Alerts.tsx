import { useAlerts } from '../hooks/useAlerts';
import { AlertsPanel } from '../components/alerts/AlertsPanel';

export default function Alerts() {
  const alerts = useAlerts();
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900">High-Value Alerts</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Failed transactions over $500 — sorted by amount descending
        </p>
      </div>
      <AlertsPanel {...alerts} />
    </div>
  );
}
