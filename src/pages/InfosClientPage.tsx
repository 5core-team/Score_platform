import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from '../components/layouts/DashboardLayout';
import GaugeChart from 'react-gauge-chart';
import { Plus, Check, User, Phone, Mail, CreditCard, Loader2, Search } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface Debt {
  id: number;
  creditor_npi: string;
  date: string;
  amount: string;
  periodicity: string;
  deadline_amount: string;
  verified: boolean;
  solvability: boolean;
  status: string;
  customer: number;
}

interface Repayment {
  customer: string;
  date: string;
  amount: string;
  periodicity: string;
  deadline_amount: string;
  deadline: string;
  verified: boolean;
  solvability: boolean;
  status: string;
}

interface ServerClientData {
  uuid: string;
  npi: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  email: string;
  credit_score?: number;
  loans: Debt[];
  receivables: Repayment[];
}

interface ClientData {
  uuid: string;
  npi: string;
  phone: string;
  name: string;
  email: string;
  creditScore: number;
  loans: Debt[];
  receivables: Repayment[];
}

interface NewDebtForm {
  code: string;
  amount: string;
  periodicity: string;
  deadline_amount: string;
  deadline: string;
  creditor_npi: string;
}

const InfosClientPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getAccessToken } = useAuth();
  const serverClient = location.state?.customer as ServerClientData | undefined;
  const [showForm, setShowForm] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [newDebt, setNewDebt] = useState<NewDebtForm>({
    code: "",
    amount: "",
    periodicity: "",
    deadline_amount: "",
    deadline: "",
    creditor_npi: ""
  });
  const [creditorName, setCreditorName] = useState("");
  const [loadingCreditor, setLoadingCreditor] = useState(false);
  const [loanCode, setLoanCode] = useState("");
  const [loadingCode, setLoadingCode] = useState(false);
  const [creatingDebt, setCreatingDebt] = useState(false);

  if (!serverClient) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Client introuvable</h2>
            <p className="text-gray-600 mb-4">Aucune donnée client n'a été trouvée.</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const initialClientData: ClientData = {
    uuid: serverClient.uuid,
    npi: serverClient.npi,
    phone: serverClient.phone_number,
    name: `${serverClient.first_name} ${serverClient.last_name}`,
    email: serverClient.email,
    creditScore: serverClient.credit_score || 0,
    loans: serverClient.loans,
    receivables: serverClient.receivables
  };

  const [clientState, setClientState] = useState<ClientData>(initialClientData);
  const scorePercentage = clientState.creditScore / 100;

  const fetchCreditorName = async (npi: string) => {
    if (!npi.trim()) {
      setCreditorName("");
      return;
    }
    setLoadingCreditor(true);
    try {
      const response = await api.get(`/customer/by-npi/?npi=${encodeURIComponent(npi)}`);
      if (response.data.customer) {
        setCreditorName(response.data.customer);
      } else {
        setCreditorName("Nom du créancier non disponible");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du créancier:", error);
      setCreditorName("Erreur de connexion");
    } finally {
      setLoadingCreditor(false);
    }
  };

  const getLoanCode = async () => {
    setLoadingCode(true);
    try {
      const response = await api.post('/country/get-loan-code/', { npi: clientState.npi });
      setLoanCode(response.data.code);
      setShowCodeInput(true);
    } catch (error) {
      console.error("Erreur lors de la génération du code:", error);
      alert("Erreur de connexion lors de la génération du code");
    } finally {
      setLoadingCode(false);
    }
  };

  const handleAddDebt = async () => {
    if (!newDebt.amount.trim() || !newDebt.periodicity.trim() || !newDebt.deadline_amount.trim() ||
        !newDebt.deadline.trim() || !newDebt.creditor_npi.trim()) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    if (!newDebt.code) {
      alert("Veuillez d'abord obtenir le code du prêt");
      return;
    }
    setCreatingDebt(true);
    try {
      const debtData = {
        code: newDebt.code,
        amount: parseFloat(newDebt.amount),
        periodicity: newDebt.periodicity,
        deadline_amount: parseFloat(newDebt.deadline_amount),
        deadline: newDebt.deadline,
        creditor_npi: newDebt.creditor_npi
      };
      const response = await api.post('/country/register-loan/', debtData);
      const createdDebt = response.data;
      const newEntry: Debt = {
        id: createdDebt.id || Date.now(),
        creditor_npi: newDebt.creditor_npi,
        date: new Date().toISOString(),
        amount: newDebt.amount,
        periodicity: newDebt.periodicity,
        deadline_amount: newDebt.deadline_amount,
        verified: false,
        solvability: false,
        status: "En cours",
        customer: parseInt(clientState.uuid)
      };
      const updatedDebts = [...clientState.loans, newEntry];
      setClientState({ ...clientState, loans: updatedDebts });
      setNewDebt({
        code: "",
        amount: "",
        periodicity: "",
        deadline_amount: "",
        deadline: "",
        creditor_npi: ""
      });
      setCreditorName("");
      setLoanCode("");
      setShowForm(false);
      alert("Dette créée avec succès!");
    } catch (error: any) {
      console.error("Erreur lors de la création de la dette:", error);
      alert(`Erreur lors de la création de la dette: ${error.response?.data?.message || 'Erreur inconnue'}`);
    } finally {
      setCreatingDebt(false);
    }
  };

  const markAsPaid = (id: number) => {
    const updatedDebts = clientState.loans.map(debt =>
      debt.id === id ? { ...debt, status: "Remboursé" } : debt
    );
    const repaidDebt = clientState.loans.find(debt => debt.id === id);
    if (!repaidDebt) return;
    const newRepayment = {
      customer: clientState.name,
      amount: repaidDebt.amount,
      date: new Date().toISOString(),
      periodicity: repaidDebt.periodicity,
      deadline_amount: repaidDebt.deadline_amount,
      deadline: new Date().toISOString(),
      verified: true,
      solvability: true,
      status: "Payé"
    };
    const updatedRepayments = [...clientState.receivables, newRepayment];
    setClientState({ ...clientState, loans: updatedDebts, receivables: updatedRepayments });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-primary rounded-lg p-4 text-white">
              <button
                onClick={() => navigate(-1)}
                className="text-white hover:text-blue-200 mb-4 flex items-center gap-2 transition-colors"
              >
                ← Retour
              </button>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <User size={32} />
                {clientState.name}
              </h1>
              <p className="text-blue-100 mt-2">Informations détaillées du client</p>
            </div>
            <div className="p-8">
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard size={24} />
                  Informations générales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">UUID</p>
                    <p className="font-medium text-gray-800 break-all">{clientState.uuid}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">NPI</p>
                    <p className="font-medium text-gray-800">{clientState.npi}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-2">
                    <Phone size={16} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-800">{clientState.phone}</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{clientState.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Score de crédit</h2>
                <div className="w-full max-w-md mx-auto">
                  <GaugeChart
                    id="credit-score-gauge"
                    nrOfLevels={20}
                    percent={scorePercentage}
                    colors={['#EA4228', '#F5CD19', '#5BE12C']}
                    arcWidth={0.3}
                    textColor="#000"
                    formatTextValue={() => `${clientState.creditScore}/100`}
                  />
                </div>
                <div className="text-center mt-4">
                  <p className="text-lg font-semibold text-gray-700">
                    Score: <span className="text-2xl text-blue-600">{clientState.creditScore}</span>/100
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Dettes</h2>
                    <button
                      onClick={() => setShowForm(!showForm)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Ajouter
                    </button>
                  </div>
                  {showForm && (
                    <div className="bg-gray-50 p-4 mb-4 rounded-lg border space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="number"
                          placeholder="Montant (ex: 100000)"
                          value={newDebt.amount}
                          onChange={(e) => setNewDebt({ ...newDebt, amount: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <select
                          value={newDebt.periodicity}
                          onChange={(e) => setNewDebt({ ...newDebt, periodicity: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Sélectionner la périodicité</option>
                          <option value="monthly">Mensuel</option>
                          <option value="quarterly">Trimestriel</option>
                          <option value="yearly">Annuel</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="number"
                          placeholder="Montant final (ex: 120000)"
                          value={newDebt.deadline_amount}
                          onChange={(e) => setNewDebt({ ...newDebt, deadline_amount: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="date"
                          value={newDebt.deadline}
                          onChange={(e) => setNewDebt({ ...newDebt, deadline: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="NPI du créancier"
                          value={newDebt.creditor_npi}
                          onChange={(e) => {
                            setNewDebt({ ...newDebt, creditor_npi: e.target.value });
                            fetchCreditorName(e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {loadingCreditor && (
                          <div className="flex items-center gap-2 text-blue-600">
                            <Loader2 size={16} className="animate-spin" />
                            <span className="text-sm">Recherche du créancier...</span>
                          </div>
                        )}
                        {creditorName && !loadingCreditor && (
                          <div className="flex items-center gap-2 text-green-600">
                            <Check size={16} />
                            <span className="text-sm font-medium">{creditorName}</span>
                          </div>
                        )}
                      </div>
                      {showCodeInput && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Code de validation"
                            value={newDebt.code}
                            onChange={(e) => setNewDebt({ ...newDebt, code: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )}
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-800">Code du prêt</span>
                          <button
                            onClick={getLoanCode}
                            disabled={loadingCode}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            {loadingCode ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                Génération...
                              </>
                            ) : (
                              <>
                                <Search size={14} />
                                Obtenir le code
                              </>
                            )}
                          </button>
                        </div>
                        {loanCode && (
                          <div className="bg-white p-2 rounded border">
                            <code className="text-sm font-mono text-gray-700">{loanCode}</code>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddDebt}
                          disabled={!newDebt.code || newDebt.code.length === 0 || creatingDebt}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {creatingDebt ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Création...
                            </>
                          ) : (
                            "Créer la dette"
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setShowForm(false);
                            setNewDebt({
                              code: "",
                              amount: "",
                              periodicity: "",
                              deadline_amount: "",
                              deadline: "",
                              creditor_npi: ""
                            });
                            setCreditorName("");
                            setLoanCode("");
                          }}
                          className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                  {clientState.loans.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📄</div>
                      <p>Aucune dette enregistrée.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {clientState.loans.map(debt => (
                        <div key={debt.id} className="bg-gray-50 p-4 rounded-lg border">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="text-lg font-semibold text-gray-800">{debt.amount} FCFA</div>
                              <div className="text-sm font-semibold text-gray-700">Créancier: {debt.creditor_npi}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                                  {debt.periodicity}
                                </span>
                                <span className={`inline-block px-2 py-1 rounded text-xs ${
                                  debt.status === 'Remboursé'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {debt.status}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-2">
                                Créé le {new Date(debt.date).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                            {debt.status !== "Remboursé" && (
                              <button
                                onClick={() => markAsPaid(debt.id)}
                                className="bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1 text-sm"
                              >
                                <Check size={16} /> Remboursé
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Recouvrements</h2>
                  {clientState.receivables.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">💰</div>
                      <p>Aucun remboursement enregistré.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {clientState.receivables.map((rep, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="text-lg font-semibold text-gray-800">{rep.amount} FCFA</div>
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              {rep.customer}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            Payé le {new Date(rep.deadline).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InfosClientPage;
