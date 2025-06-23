import React from 'react';

const StatsCards = ({ stat }) => {
  if (!stat) return null; // O un fallback visual

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
          <stat.icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <span className={`ml-2 text-sm ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default StatsCards;