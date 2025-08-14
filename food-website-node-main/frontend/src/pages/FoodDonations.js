import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import CreateDonationModal from '../components/CreateDonationModal';
import DonationCard from '../components/DonationCard';
import FilterBar from '../components/FilterBar';

const FoodDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        donorType: '',
        city: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { user } = useAuth();

    const fetchDonations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams({
                page: currentPage,
                limit: 10,
                ...filters
            });

            const response = await axiosInstance.get(`/api/food-donations?${params}`);
            setDonations(response.data.donations);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching donations:', error);
            setError('Failed to fetch donations. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [currentPage, filters]);

    useEffect(() => {
        fetchDonations();
    }, [fetchDonations]);

    const handleCreateDonation = async (donationData) => {
        try {
            await axiosInstance.post('/api/food-donations', donationData);
            setShowCreateModal(false);
            fetchDonations();
        } catch (error) {
            console.error('Error creating donation:', error);
            alert('Failed to create donation. Please try again.');
        }
    };

    const handleClaimDonation = async (donationId) => {
        try {
            await axiosInstance.post(`/api/food-donations/${donationId}/claim`);
            fetchDonations();
        } catch (error) {
            console.error('Error claiming donation:', error);
            alert('Failed to claim donation. Please try again.');
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <p className="text-red-500 text-lg mb-4">{error}</p>
                    <button 
                        onClick={fetchDonations}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Food Donations</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                    Create Donation
                </button>
            </div>

            <FilterBar filters={filters} onFilterChange={handleFilterChange} />

            {donations.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No food donations available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {donations.map((donation) => (
                        <DonationCard
                            key={donation._id}
                            donation={donation}
                            onClaim={handleClaimDonation}
                            isNGO={user?.userType === 'ngo'}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {showCreateModal && (
                <CreateDonationModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateDonation}
                />
            )}
        </div>
    );
};

export default FoodDonations; 