import { SlidersHorizontal } from 'lucide-react';

interface LicenseStatusCardProps {
  country: string;
  amount: string;
  status: 'active' | 'inactive';
}

const LicenseStatusCard = ({ country, amount, status }: LicenseStatusCardProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="bg-gray-100 h-12 w-12 rounded flex items-center justify-center mr-4">
          <SlidersHorizontal size={24} className="text-gray-500" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{country}</h3>
          <p className="text-gray-500">{amount}</p>
        </div>
      </div>
      <div>
        <div className={`toggle ${status === 'active' ? 'toggle-active' : 'toggle-inactive'}`}>
          <span className="toggle-slider"></span>
        </div>
        <p className={`text-sm mt-1 ${status === 'active' ? 'text-primary' : 'text-danger'}`}>
          {status === 'active' ? 'Active' : 'Desactivée'}
        </p>
      </div>
    </div>
  );
};

export default LicenseStatusCard;