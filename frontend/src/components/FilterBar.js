import React from 'react';

const FilterBar = ({ filters, onFilterChange }) => {
    const handleFilterChange = (field, value) => {
        onFilterChange({
            ...filters,
            [field]: value
        });
    };

    const clearFilters = () => {
        onFilterChange({
            status: '',
            donorType: '',
            city: ''
        });
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
                {/* Status Filter */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="available">Available</option>
                        <option value="claimed">Claimed</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="delivered">Delivered</option>
                        <option value="expired">Expired</option>
                    </select>
                </div>

                {/* Donor Type Filter */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Donor Type
                    </label>
                    <select
                        value={filters.donorType}
                        onChange={(e) => handleFilterChange('donorType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">All Types</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="individual">Individual</option>
                        <option value="catering">Catering Service</option>
                        <option value="grocery">Grocery Store</option>
                    </select>
                </div>

                {/* City Filter */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                    </label>
                    <input
                        type="text"
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                        placeholder="Enter city name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Clear Filters Button */}
                <div className="flex-shrink-0">
                    <button
                        onClick={clearFilters}
                        disabled={!hasActiveFilters}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Active Filters:</p>
                    <div className="flex flex-wrap gap-2">
                        {filters.status && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Status: {filters.status}
                            </span>
                        )}
                        {filters.donorType && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Type: {filters.donorType}
                            </span>
                        )}
                        {filters.city && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                City: {filters.city}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterBar; 