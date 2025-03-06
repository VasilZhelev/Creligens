import React from 'react';
import Dashboard from '@/components/ui/DashboardItem'; // Import the Dashboard component

// Sample data - you can change the number of items here
const dashboardItems = [
  {
    id: '1',
    title: 'Basic Plan',
    price: 9.99,
    link: '/plans/basic'
  },
  {
    id: '2',
    title: 'Premium Plan',
    price: 19.99,
    link: '/plans/premium'
  },
  {
    id: '3',
    title: 'Enterprise Plan',
    price: 49.99,
    link: '/plans/enterprise'
  },
  {
    id: '4',
    title: 'Custom Solution',
    price: 99.99,
    link: '/solutions/custom'
  }
];

const App: React.FC = () => {
  return (
    <div className="container mx-auto my-8">
      <Dashboard items={dashboardItems} /> 
    </div>
  );
};

export default App;