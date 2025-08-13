import { useState } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Bell, Info, AlertTriangle, Check, X } from 'lucide-react';

// Mock notification data
const mockNotifications = [
  { id: 1, message: 'Nouvelle dette enregistrée pour Kokou Amouzou', type: 'info', time: '2 heures', read: false },
  { id: 2, message: 'Alerte: Échéance de paiement dépassée pour Afi Mensah', type: 'warning', time: '1 jour', read: false },
  { id: 3, message: 'Dette entièrement remboursée par Kodjo Abalo', type: 'success', time: '3 jours', read: true },
  { id: 4, message: 'Nouvelle zone Abomey-Calavi assignée à Sophie Agbodjan', type: 'info', time: '5 jours', read: true },
  { id: 5, message: 'Alerte: Multiple défauts de paiement pour Ayélévi Adoko', type: 'warning', time: '1 semaine', read: true },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return true;
  });
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({...notification, read: true})));
  };
  
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'info': return <Info size={20} className="text-blue-500" />;
      case 'warning': return <AlertTriangle size={20} className="text-amber-500" />;
      case 'success': return <Check size={20} className="text-green-500" />;
      default: return <Bell size={20} className="text-gray-500" />;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bell size={24} />
            Notifications
          </h1>
          <button 
            onClick={markAllAsRead}
            className="btn bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          >
            Tout marquer comme lu
          </button>
        </div>
        
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'unread'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Non lus
              <span className="ml-2 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                {notifications.filter(n => !n.read).length}
              </span>
            </button>
          </nav>
        </div>
        
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg border ${
                  notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5 mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.read ? 'text-gray-800' : 'font-medium text-gray-900'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Aucune notification à afficher</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;