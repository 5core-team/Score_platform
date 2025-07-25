import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CountryUsageCardProps {
  country: string;
  metric: string;
  value: string;
  progress: number;
  trend: 'up' | 'down';
}

const CountryUsageCard = ({ country, metric, value, progress, trend }: CountryUsageCardProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="bg-blue-500 h-16 w-16 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">{country.slice(0, 2)}</span>
        </div>
        <div className="ml-4">
          <h3 className="font-bold text-lg">{country}</h3>
          <p className={`text-${trend === 'up' ? 'green' : 'red'}-500`}>{value} {metric}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className="mr-2 font-bold">{progress}%</span>
        {trend === 'up' ? (
          <ArrowUpRight className="text-green-500" />
        ) : (
          <ArrowDownRight className="text-red-500" />
        )}
      </div>
    </div>
  );
};

export default CountryUsageCard;