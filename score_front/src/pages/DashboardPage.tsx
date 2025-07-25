import DashboardLayout from '../components/layouts/DashboardLayout';
import SectionHeader from '../components/dashboard/SectionHeader';
import CountryUsageCard from '../components/dashboard/CountryUsageCard';
import LicenseStatusCard from '../components/dashboard/LicenseStatusCard';
import CountryCard from '../components/dashboard/CountryCard';
import MapComponent from '../components/dashboard/MapComponent';

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Section */}
        <div className="card">
          <SectionHeader title="Utilisation" />
          
          <div className="space-y-6">
            <CountryUsageCard
              country="CONGO"
              metric="enregistrement par semaine"
              value="100"
              progress={40}
              trend="down"
            />
            
            <CountryUsageCard
              country="BENIN"
              metric="enregistrements par jour"
              value="60"
              progress={70}
              trend="up"
            />
            
            <CountryUsageCard
              country="COTE D'IVOIRE"
              metric="enregistrements par jour"
              value="135"
              progress={90}
              trend="up"
            />
          </div>
        </div>
        
        {/* Country by Country Section */}
        <div className="card">
          <SectionHeader title="BENIN" />
          
          <div className="space-y-4">
            <CountryCard
              name="front office"
              amount="500 000 Fcfa"
              active={true}
            />
            
            <CountryCard
              name="Assermentées"
              amount="2 000 000 Fcfa"
              active={true}
            />
          </div>
        </div>
        
        {/* Active Licenses Section */}
        <div className="card">
          <SectionHeader title="Licences actives" />
          
          <div className="space-y-4">
            <LicenseStatusCard
              country="BENIN"
              amount="5 000 000 Fcfa"
              status="active"
            />
            
            <LicenseStatusCard
              country="GABON"
              amount="10 000 000 Fcfa"
              status="inactive"
            />
          </div>
        </div>
        
        {/* Map Section */}
        <div className="card">
          <SectionHeader title="Par pays" />
          <div className="h-64">
            <MapComponent />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;