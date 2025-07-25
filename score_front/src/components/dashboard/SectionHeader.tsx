import { ChevronRight, SlidersHorizontal } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  hasControls?: boolean;
}

const SectionHeader = ({ title, hasControls = true }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <h2 className="text-xl font-bold">{title}</h2>
        <ChevronRight className="ml-2" size={20} />
      </div>
      {hasControls && (
        <button className="text-gray-500 hover:text-gray-700">
          <SlidersHorizontal size={20} />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;