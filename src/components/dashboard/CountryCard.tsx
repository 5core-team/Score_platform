interface CountryCardProps {
  name: string;
  amount: string;
  active: boolean;
}

const CountryCard = ({ name, amount, active }: CountryCardProps) => {
  return (
    <div className="flex items-center mb-4">
      <div className="bg-accent h-16 w-16 rounded-md mr-4"></div>
      <div>
        <h3 className="font-bold">{name}</h3>
        <p className="text-gray-600">{amount}</p>
      </div>
      <div className="ml-auto">
        <div className={`toggle ${active ? 'toggle-active' : 'toggle-inactive'}`}>
          <span className="toggle-slider"></span>
        </div>
        <p className="text-xs text-right mt-1">versement</p>
      </div>
    </div>
  );
};

export default CountryCard;