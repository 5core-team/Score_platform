// pages/creditscore.tsx
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import DashboardLayout from '../components/layouts/DashboardLayout';
import GaugeChart from 'react-gauge-chart';
import { Plus, Check } from "lucide-react";

const clientsData = [
  {
    name: 'Kokou Amouzou',
    creditScore: 60,
    debts: [
      { id: 1, amount: '500,000 FCFA', type: 'Prêt personnel', status: 'En cours', created_at: '2024-01-10' },
      { id: 2, amount: '150,000 FCFA', type: 'Prêt à la consommation', status: 'Remboursé', created_at: '2023-09-15' },
    ],
    repayments: [
      { id: 1, amount: '50,000 FCFA', date: '2024-02-10', status: 'Payé' },
      { id: 2, amount: '70,000 FCFA', date: '2024-03-10', status: 'Payé' },
    ],
  },
  {
    name: 'Kodjo Abalo',
    creditScore: 70,
    debts: [
      { id: 1, amount: '300,000 FCFA', type: 'Prêt à la consommation', status: 'Remboursé', created_at: '2024-02-05' },
    ],
    repayments: [
      { id: 1, amount: '30,000 FCFA', date: '2024-03-05', status: 'Payé' },
    ],
  },
  {
    name: 'Afi Mensah',
    creditScore: 40,
    debts: [
      { id: 1, amount: '300,000 FCFA', type: 'Prêt à la consommation', status: 'Remboursé', created_at: '2024-02-05' },
    ],
    repayments: [
      { id: 1, amount: '30,000 FCFA', date: '2024-03-05', status: 'Payé' },
    ],
  },
  {
    name: 'Essonam Koudoh',
    creditScore: 90,
    debts: [
      { id: 1, amount: '300,000 FCFA', type: 'Prêt à la consommation', status: 'Remboursé', created_at: '2024-02-05' },
    ],
    repayments: [
      { id: 1, amount: '30,000 FCFA', date: '2024-03-05', status: 'Payé' },
    ],
  },
  {
    name: 'Ayélévi Adoko',
    creditScore: 80,
    debts: [
      { id: 1, amount: '300,000 FCFA', type: 'Prêt à la consommation', status: 'Remboursé', created_at: '2024-02-05' },
    ],
    repayments: [
      { id: 1, amount: '30,000 FCFA', date: '2024-03-05', status: 'Payé' },
    ],
  },
  {
    name: 'Ayéléevi Adoko',
    creditScore: 90,
    debts: [
      { id: 1, amount: '300,000 FCFA', type: 'Prêt à la consommation', status: 'Remboursé', created_at: '2024-02-05' },
    ],
    repayments: [
      { id: 1, amount: '30,000 FCFA', date: '2024-03-05', status: 'Payé' },
    ],
  },
  // autres clients...
];

const CreditScorePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const debtor = queryParams.get('debtor');

  const initialClient = clientsData.find(c => c.name === debtor);
  const [client, setClient] = useState(initialClient);
  const [showForm, setShowForm] = useState(false);
  const [newDebt, setNewDebt] = useState({ amount: "", type: "" });

  if (!client) {
    return (
      <DashboardLayout>
        <div className="p-6 text-red-600 text-lg">Client introuvable.</div>
      </DashboardLayout>
    );
  }

  const scorePercentage = client.creditScore / 100;

  const handleAddDebt = () => {
    const newEntry = {
      id: Date.now(),
      amount: newDebt.amount,
      type: newDebt.type,
      status: "En cours",
      created_at: new Date().toISOString(),
    };
    const updatedDebts = [...client.debts, newEntry];
    setClient({ ...client, debts: updatedDebts });
    setNewDebt({ amount: "", type: "" });
    setShowForm(false);
  };

  const markAsPaid = (id) => {
    const updatedDebts = client.debts.map(debt =>
      debt.id === id ? { ...debt, status: "Remboursé" } : debt
    );

    // Trouver la dette correspondante
    const repaidDebt = client.debts.find(debt => debt.id === id);
    if (!repaidDebt) return;

    const newRepayment = {
      id: client.repayments.length + 1,
      amount: repaidDebt.amount,
      date: new Date().toISOString(),
      status: "Payé"
    };

    const updatedRepayments = [...client.repayments, newRepayment];

    setClient({ ...client, debts: updatedDebts, repayments: updatedRepayments });
  };

  return (
    <DashboardLayout>
      <div className="card">
        <button onClick={() => navigate(-1)} className="text-primary mb-4">&larr; Retour</button>
        <h1 className="text-2xl font-bold mb-6">{client.name}</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Score de crédit</h2>
          <div className="w-full md:w-1/2 mx-auto">
            <GaugeChart
              id="credit-score-gauge"
              nrOfLevels={20}
              percent={scorePercentage}
              colors={['#EA4228', '#F5CD19', '#5BE12C']}
              arcWidth={0.3}
              textColor="#11f1f1"
              formatTextValue={() => `${client.creditScore}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dettes */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Dettes</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn btn-primary flex items-center gap-1"
              >
                <Plus size={18} />
                Ajouter
              </button>
            </div>

            {/* Formulaire */}
            {showForm && (
              <div className="bg-white p-4 mb-4 border rounded-lg shadow space-y-2">
                <input
                  type="text"
                  placeholder="Montant (ex: 100,000 FCFA)"
                  value={newDebt.amount}
                  onChange={(e) => setNewDebt({ ...newDebt, amount: e.target.value })}
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  placeholder="Type de dette (ex: Prêt étudiant)"
                  value={newDebt.type}
                  onChange={(e) => setNewDebt({ ...newDebt, type: e.target.value })}
                  className="input input-bordered w-full"
                />
                <button onClick={handleAddDebt} className="btn btn-success w-full">
                  Ajouter la dette
                </button>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg shadow space-y-4">
              {client.debts.map(debt => (
                <div key={debt.id} className="border-b last:border-b-0 pb-2 flex justify-between items-center">
                  <div>
                    <div className="text-gray-800 font-medium">{debt.amount}</div>
                    <div className="text-gray-500 text-sm">
                      {debt.type} • {debt.status} • {new Date(debt.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  {debt.status !== "Remboursé" && (
                    <button
                      onClick={() => markAsPaid(debt.id)}
                      className="btn btn-outline btn-success btn-sm flex items-center gap-1"
                    >
                      <Check size={16} /> Remboursé
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Remboursements */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Remboursements</h2>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              {client.repayments.map(rep => (
                <div key={rep.id} className="border-b last:border-b-0 py-2">
                  <div className="text-gray-800 font-medium">{rep.amount}</div>
                  <div className="text-gray-500 text-sm">{new Date(rep.date).toLocaleDateString('fr-FR')} • {rep.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreditScorePage;
