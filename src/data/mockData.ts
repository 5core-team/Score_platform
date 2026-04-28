import type { Country, Zone, User, Client, Transaction } from '../types';

export const countries: Country[] = [
  { id: 'c1', name: 'Sénégal', email: 'senegal@afrikarisque.com', phone: '+221 33 800 0001', status: 'active', representativeId: 'u2', createdAt: '2023-01-10' },
  { id: 'c2', name: 'Côte d\'Ivoire', email: 'cotedivoire@afrikarisque.com', phone: '+225 27 200 0002', status: 'active', representativeId: 'u3', createdAt: '2023-02-14' },
  { id: 'c3', name: 'Cameroun', email: 'cameroun@afrikarisque.com', phone: '+237 222 000 003', status: 'active', representativeId: 'u4', createdAt: '2023-03-05' },
  { id: 'c4', name: 'Mali', email: 'mali@afrikarisque.com', phone: '+223 20 000 004', status: 'inactive', createdAt: '2023-04-18' },
  { id: 'c5', name: 'Bénin', email: 'benin@afrikarisque.com', phone: '+229 21 000 005', status: 'active', createdAt: '2023-05-22' },
];

export const zones: Zone[] = [
  { id: 'z1', name: 'Dakar Nord', countryId: 'c1', createdAt: '2023-02-01' },
  { id: 'z2', name: 'Dakar Sud', countryId: 'c1', createdAt: '2023-02-01' },
  { id: 'z3', name: 'Thiès', countryId: 'c1', createdAt: '2023-02-15' },
  { id: 'z4', name: 'Abidjan Plateau', countryId: 'c2', createdAt: '2023-03-01' },
  { id: 'z5', name: 'Abidjan Cocody', countryId: 'c2', createdAt: '2023-03-01' },
  { id: 'z6', name: 'Douala', countryId: 'c3', createdAt: '2023-04-01' },
  { id: 'z7', name: 'Yaoundé', countryId: 'c3', createdAt: '2023-04-01' },
];

export const users: User[] = [
  {
    id: 'u1', email: 'admin@afrikarisque.com', firstName: 'Alexandre', lastName: 'Diallo',
    role: 'ADMIN', status: 'active', createdAt: '2023-01-01',
  },
  {
    id: 'u2', email: 'pays@afrikarisque.com', firstName: 'Moussa', lastName: 'Konaté',
    role: 'COUNTRY_REPRESENTATIVE', status: 'active', countryId: 'c1', createdAt: '2023-01-15',
  },
  {
    id: 'u3', email: 'pays2@afrikarisque.com', firstName: 'Aminata', lastName: 'Touré',
    role: 'COUNTRY_REPRESENTATIVE', status: 'active', countryId: 'c2', createdAt: '2023-02-20',
  },
  {
    id: 'u4', email: 'pays3@afrikarisque.com', firstName: 'Jean', lastName: 'Mbarga',
    role: 'COUNTRY_REPRESENTATIVE', status: 'active', countryId: 'c3', createdAt: '2023-03-10',
  },
  {
    id: 'u5', email: 'office@afrikarisque.com', firstName: 'Fatou', lastName: 'Ndiaye',
    role: 'FRONT_OFFICE', status: 'active', countryId: 'c1', zoneId: 'z1', birthDate: '1990-05-12', createdAt: '2023-02-01',
  },
  {
    id: 'u6', email: 'office2@afrikarisque.com', firstName: 'Ibrahim', lastName: 'Sow',
    role: 'FRONT_OFFICE', status: 'active', countryId: 'c1', zoneId: 'z2', birthDate: '1988-11-20', createdAt: '2023-02-15',
  },
  {
    id: 'u7', email: 'office3@afrikarisque.com', firstName: 'Nadia', lastName: 'Koffi',
    role: 'FRONT_OFFICE', status: 'blocked', countryId: 'c2', zoneId: 'z4', birthDate: '1992-03-08', createdAt: '2023-03-05',
  },
  {
    id: 'u8', email: 'huissier@afrikarisque.com', firstName: 'Seydou', lastName: 'Bah',
    role: 'BAILIFF', status: 'active', countryId: 'c1', zoneId: 'z1', createdAt: '2023-02-10',
  },
  {
    id: 'u9', email: 'huissier2@afrikarisque.com', firstName: 'Oumar', lastName: 'Fall',
    role: 'BAILIFF', status: 'active', countryId: 'c1', zoneId: 'z2', createdAt: '2023-02-20',
  },
  {
    id: 'u10', email: 'huissier3@afrikarisque.com', firstName: 'Christelle', lastName: 'Ngom',
    role: 'BAILIFF', status: 'blocked', countryId: 'c2', zoneId: 'z4', createdAt: '2023-03-15',
  },
  {
    id: 'u11', email: 'conseiller@afrikarisque.com', firstName: 'Mariam', lastName: 'Traoré',
    role: 'ADVISOR', status: 'active', countryId: 'c1', zoneId: 'z1', createdAt: '2023-02-12',
  },
  {
    id: 'u12', email: 'conseiller2@afrikarisque.com', firstName: 'Daouda', lastName: 'Ly',
    role: 'ADVISOR', status: 'active', countryId: 'c1', zoneId: 'z3', createdAt: '2023-03-01',
  },
  {
    id: 'u13', email: 'conseiller3@afrikarisque.com', firstName: 'Sophie', lastName: 'Atta',
    role: 'ADVISOR', status: 'active', countryId: 'c2', zoneId: 'z5', createdAt: '2023-03-20',
  },
];

export const clients: Client[] = [
  { id: 'cl1', email: 'aliou.ba@email.com', firstName: 'Aliou', lastName: 'Ba', zoneId: 'z1', countryId: 'c1', createdBy: 'u8', createdAt: '2023-03-01' },
  { id: 'cl2', email: 'binta.diop@email.com', firstName: 'Binta', lastName: 'Diop', zoneId: 'z1', countryId: 'c1', createdBy: 'u8', createdAt: '2023-03-05' },
  { id: 'cl3', email: 'cheikh.sarr@email.com', firstName: 'Cheikh', lastName: 'Sarr', zoneId: 'z2', countryId: 'c1', createdBy: 'u9', createdAt: '2023-03-10' },
  { id: 'cl4', email: 'daouda.gaye@email.com', firstName: 'Daouda', lastName: 'Gaye', zoneId: 'z2', countryId: 'c1', createdBy: 'u9', createdAt: '2023-03-15' },
  { id: 'cl5', email: 'evelyne.konan@email.com', firstName: 'Evelyne', lastName: 'Konan', zoneId: 'z4', countryId: 'c2', createdBy: 'u10', createdAt: '2023-04-01' },
  { id: 'cl6', email: 'felix.yao@email.com', firstName: 'Felix', lastName: 'Yao', zoneId: 'z5', countryId: 'c2', createdBy: 'u10', createdAt: '2023-04-10' },
  { id: 'cl7', email: 'grace.akou@email.com', firstName: 'Grace', lastName: 'Akou', zoneId: 'z3', countryId: 'c1', createdBy: 'u8', createdAt: '2023-04-15' },
];

export const transactions: Transaction[] = [
  { id: 't1', clientId: 'cl1', type: 'loan', amount: 500000, currency: 'XOF', description: 'Prêt commercial', date: '2023-03-10', createdBy: 'u8' },
  { id: 't2', clientId: 'cl1', type: 'repayment', amount: 100000, currency: 'XOF', description: 'Remboursement partiel', date: '2023-04-10', createdBy: 'u8' },
  { id: 't3', clientId: 'cl1', type: 'repayment', amount: 100000, currency: 'XOF', description: 'Remboursement mensuel', date: '2023-05-10', createdBy: 'u8' },
  { id: 't4', clientId: 'cl2', type: 'loan', amount: 750000, currency: 'XOF', description: 'Prêt personnel', date: '2023-03-15', createdBy: 'u8' },
  { id: 't5', clientId: 'cl2', type: 'repayment', amount: 150000, currency: 'XOF', description: 'Remboursement', date: '2023-04-15', createdBy: 'u8' },
  { id: 't6', clientId: 'cl3', type: 'loan', amount: 300000, currency: 'XOF', description: 'Micro-crédit', date: '2023-03-20', createdBy: 'u9' },
  { id: 't7', clientId: 'cl4', type: 'loan', amount: 1000000, currency: 'XOF', description: 'Prêt immobilier', date: '2023-04-01', createdBy: 'u9' },
  { id: 't8', clientId: 'cl4', type: 'repayment', amount: 200000, currency: 'XOF', description: 'Première échéance', date: '2023-05-01', createdBy: 'u9' },
  { id: 't9', clientId: 'cl5', type: 'loan', amount: 600000, currency: 'XOF', description: 'Prêt PME', date: '2023-04-15', createdBy: 'u10' },
  { id: 't10', clientId: 'cl6', type: 'loan', amount: 250000, currency: 'XOF', description: 'Crédit consommation', date: '2023-04-20', createdBy: 'u10' },
];

export const staticCredentials: Record<string, { role: string; userId: string }> = {
  'admin@': { role: 'ADMIN', userId: 'u1' },
  'pays@': { role: 'COUNTRY_REPRESENTATIVE', userId: 'u2' },
  'office@': { role: 'FRONT_OFFICE', userId: 'u5' },
  'huissier@': { role: 'BAILIFF', userId: 'u8' },
  'conseiller@': { role: 'ADVISOR', userId: 'u11' },
};
