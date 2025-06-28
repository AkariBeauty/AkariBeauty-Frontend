import { Icon } from '@phosphor-icons/react';

interface KPICardProps {
  title: string;
  value: string;
  icon: Icon;
  trend?: string;
  trendColor?: 'green' | 'red' | 'gray';
}

export default function KPICard({title, value, icon: Icon, trend, trendColor = 'gray'}: KPICardProps) {
  const trendColors = {
    green: 'text-green-600',
    red: 'text-red-600',
    gray: 'text-gray-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trendColors[trendColor]}`}>{trend}</p>
          )}
        </div>
        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-pink-600" />
        </div>
      </div>
    </div>
  );
};
