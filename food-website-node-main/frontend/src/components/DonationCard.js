import React, { useState } from 'react';

const DonationCard = ({ donation, onClaim, isNGO }) => {
    const [showDetails, setShowDetails] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'claimed':
                return 'bg-yellow-100 text-yellow-800';
            case 'picked_up':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-purple-100 text-purple-800';
            case 'expired':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'available':
                return 'Available';
            case 'claimed':
                return 'Claimed';
            case 'picked_up':
                return 'Picked Up';
            case 'delivered':
                return 'Delivered';
            case 'expired':
                return 'Expired';
            default:
                return status;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const canClaim = isNGO && donation.status === 'available';

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-white font-semibold text-lg">
                        {donation.donorType.charAt(0).toUpperCase() + donation.donorType.slice(1)} Donation
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                        {getStatusText(donation.status)}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Donor Info */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Donated by:</p>
                    <p className="font-medium text-gray-800">{donation.donor.name}</p>
                </div>

                {/* Food Items Summary */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Food Items:</p>
                    <div className="space-y-1">
                        {donation.foodItems.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-700">{item.name}</span>
                                <span className="text-gray-500">{item.quantity} {item.unit}</span>
                            </div>
                        ))}
                        {donation.foodItems.length > 2 && (
                            <p className="text-xs text-gray-500">
                                +{donation.foodItems.length - 2} more items
                            </p>
                        )}
                    </div>
                </div>

                {/* Pickup Info */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Pickup Location:</p>
                    <p className="text-sm text-gray-700">
                        {donation.pickupAddress.city}, {donation.pickupAddress.state}
                    </p>
                    <p className="text-xs text-gray-500">
                        {formatDate(donation.pickupTime.start)} - {formatDate(donation.pickupTime.end)}
                    </p>
                </div>

                {/* Expiry Warning */}
                {donation.foodItems.some(item => new Date(item.expiryDate) < new Date()) && (
                    <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-xs text-red-700 font-medium">⚠️ Some items may have expired</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                    >
                        {showDetails ? 'Hide Details' : 'View Details'}
                    </button>
                    
                    {canClaim && (
                        <button
                            onClick={() => onClaim(donation._id)}
                            className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                        >
                            Claim
                        </button>
                    )}
                </div>

                {/* Detailed Information */}
                {showDetails && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                        {/* All Food Items */}
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">All Food Items:</p>
                            <div className="space-y-2">
                                {donation.foodItems.map((item, index) => (
                                    <div key={index} className="bg-gray-50 p-3 rounded">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium text-gray-800">{item.name}</span>
                                            <span className="text-sm text-gray-600">{item.quantity} {item.unit}</span>
                                        </div>
                                        {item.description && (
                                            <p className="text-xs text-gray-600 mb-1">{item.description}</p>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            Expires: {formatDate(item.expiryDate)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Full Address */}
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Full Address:</p>
                            <p className="text-sm text-gray-600">
                                {donation.pickupAddress.street}<br />
                                {donation.pickupAddress.city}, {donation.pickupAddress.state} {donation.pickupAddress.zipCode}
                            </p>
                        </div>

                        {/* Special Instructions */}
                        {donation.specialInstructions && (
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Special Instructions:</p>
                                <p className="text-sm text-gray-600">{donation.specialInstructions}</p>
                            </div>
                        )}

                        {/* Claimed By */}
                        {donation.claimedBy && (
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Claimed by:</p>
                                <p className="text-sm text-gray-600">{donation.claimedBy.organizationName}</p>
                                <p className="text-xs text-gray-500">
                                    Claimed on: {formatDate(donation.claimedAt)}
                                </p>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                            <p>Created: {formatDate(donation.createdAt)}</p>
                            <p>Last updated: {formatDate(donation.updatedAt)}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonationCard; 