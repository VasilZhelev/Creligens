import React from 'react';

// Define the type for each box item
interface DashboardItem {
  id: string;
  title: string;
  price: number;
  link: string;
}

// Define props for the Dashboard component
interface DashboardProps {
  items: DashboardItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ items }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-black">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="border border-gray-300 p-4 rounded-lg transition-all hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-black mb-2">{item.title}</h2>
            <p className="text-black mb-4">${item.price.toFixed(2)}</p>
            <a 
              href={item.link} 
              className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;