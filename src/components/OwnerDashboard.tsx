import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, FileText, Pill, Syringe, Calendar } from 'lucide-react';

interface Props {
  petId: string;
  onLoadReminders: () => void;
}

const OwnerDashboard: React.FC<Props> = ({ petId, onLoadReminders }) => {
  const [dashboardData, setDashboardData] = useState({
    nextMedicine: null as any,
    nextVaccination: null as any,
    recentPrescriptions: [] as any[],
    upcomingReminders: [] as any[]
  });

  useEffect(() => {
    loadDashboardData();
  }, [petId]);

  const loadDashboardData = () => {
    const medicines = JSON.parse(localStorage.getItem('medicines') || '[]')
      .filter((med: any) => med.petId === petId);
    const vaccinations = JSON.parse(localStorage.getItem('vaccinations') || '[]')
      .filter((vac: any) => vac.petId === petId);
    const prescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]')
      .filter((pres: any) => pres.petId === petId);

    // Find next medicine due
    const nextMedicine = medicines
      .filter((med: any) => new Date(med.nextDose) > new Date())
      .sort((a: any, b: any) => new Date(a.nextDose).getTime() - new Date(b.nextDose).getTime())[0];

    // Find next vaccination due
    const nextVaccination = vaccinations
      .filter((vac: any) => new Date(vac.nextDue) > new Date())
      .sort((a: any, b: any) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())[0];

    // Recent prescriptions (last 3)
    const recentPrescriptions = prescriptions
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    // Upcoming reminders
    const upcomingReminders = [
      ...medicines.filter((med: any) => {
        const nextDose = new Date(med.nextDose);
        const now = new Date();
        return nextDose <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      }).map((med: any) => ({ ...med, type: 'medicine' })),
      ...vaccinations.filter((vac: any) => {
        const dueDate = new Date(vac.nextDue);
        const now = new Date();
        return dueDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      }).map((vac: any) => ({ ...vac, type: 'vaccination' }))
    ].sort((a, b) => {
      const dateA = new Date(a.nextDose || a.nextDue);
      const dateB = new Date(b.nextDose || b.nextDue);
      return dateA.getTime() - dateB.getTime();
    });

    setDashboardData({
      nextMedicine,
      nextVaccination,
      recentPrescriptions,
      upcomingReminders
    });
  };

  const getTimeUntil = (date: string) => {
    const target = new Date(date);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    
    if (diff < 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return 'Soon';
  };

  return (
    <div className="space-y-6">
      
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Next Medicine */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <Pill className="h-8 w-8 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Next Medicine</span>
          </div>
          {dashboardData.nextMedicine ? (
            <div>
              <h3 className="font-bold text-gray-900 mb-1">{dashboardData.nextMedicine.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{dashboardData.nextMedicine.dosage}</p>
              <div className="flex items-center text-purple-600">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  {getTimeUntil(dashboardData.nextMedicine.nextDose)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No medicines scheduled</p>
          )}
        </div>

        {/* Next Vaccination */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <Syringe className="h-8 w-8 text-red-600" />
            <span className="text-sm font-medium text-red-600">Next Vaccination</span>
          </div>
          {dashboardData.nextVaccination ? (
            <div>
              <h3 className="font-bold text-gray-900 mb-1">{dashboardData.nextVaccination.name}</h3>
              <div className="flex items-center text-red-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  {getTimeUntil(dashboardData.nextVaccination.nextDue)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No vaccinations scheduled</p>
          )}
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <FileText className="h-8 w-8 text-green-600" />
            <span className="text-sm font-medium text-green-600">Recent Prescriptions</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {dashboardData.recentPrescriptions.length}
          </div>
          <p className="text-sm text-gray-600">This month</p>
        </div>
      </div>

      {/* Upcoming Reminders */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <AlertCircle className="h-6 w-6 text-orange-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Upcoming Reminders</h2>
        </div>
        
        {dashboardData.upcomingReminders.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.upcomingReminders.map((reminder, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                reminder.type === 'medicine' 
                  ? 'bg-purple-50 border-purple-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {reminder.type === 'medicine' ? (
                      <Pill className="h-5 w-5 text-purple-600 mr-3" />
                    ) : (
                      <Syringe className="h-5 w-5 text-red-600 mr-3" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{reminder.name}</h3>
                      <p className="text-sm text-gray-600">
                        {reminder.type === 'medicine' ? reminder.dosage : 'Vaccination due'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      getTimeUntil(reminder.nextDose || reminder.nextDue) === 'Overdue' 
                        ? 'text-red-600' 
                        : 'text-orange-600'
                    }`}>
                      {getTimeUntil(reminder.nextDose || reminder.nextDue)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(reminder.nextDose || reminder.nextDue).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">No upcoming reminders for your pet.</p>
          </div>
        )}
      </div>

      {/* Recent Prescriptions List */}
      {dashboardData.recentPrescriptions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Prescriptions</h2>
          <div className="space-y-3">
            {dashboardData.recentPrescriptions.map((prescription, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Dr. {prescription.doctorName}</h3>
                    <p className="text-sm text-gray-600">{prescription.notes || 'General prescription'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{new Date(prescription.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;