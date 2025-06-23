import RecentActivity from './RecentActivity';

const OverviewTab = ({ pets, users, adoptionRequests }) => {
  return (
    <div className="space-y-8">
      {/* Aquí ya puedes usar RecentActivity */}
      <RecentActivity
        allPetsForStats={pets}
        adoptionRequests={adoptionRequests}
        getStatusColor={(available) =>
          available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }
        getDisplayStatus={(available) => (available ? 'Disponible' : 'Adoptado')}
        getRequestStatusColor={(status) => {
          switch (status) {
            case 'pending':
              return 'bg-yellow-100 text-yellow-800';
            case 'approved':
              return 'bg-green-100 text-green-800';
            case 'rejected':
              return 'bg-red-100 text-red-800';
            default:
              return 'bg-gray-100 text-gray-800';
          }
        }}
        getPriorityColor={() => 'text-gray-500'}
      />
    </div>
  );
};


export default OverviewTab;
