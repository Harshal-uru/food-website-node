import React, { useState } from 'react';

const CreateDonationModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        donorType: 'restaurant',
        foodItems: [{ name: '', quantity: '', unit: 'kg', expiryDate: '', description: '' }],
        pickupAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
        },
        pickupTime: {
            start: '',
            end: ''
        },
        specialInstructions: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFoodItemChange = (index, field, value) => {
        const newFoodItems = [...formData.foodItems];
        newFoodItems[index] = { ...newFoodItems[index], [field]: value };
        setFormData(prev => ({
            ...prev,
            foodItems: newFoodItems
        }));
    };

    const addFoodItem = () => {
        setFormData(prev => ({
            ...prev,
            foodItems: [...prev.foodItems, { name: '', quantity: '', unit: 'kg', expiryDate: '', description: '' }]
        }));
    };

    const removeFoodItem = (index) => {
        if (formData.foodItems.length > 1) {
            const newFoodItems = formData.foodItems.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                foodItems: newFoodItems
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Create Food Donation</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Donor Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Donor Type *
                            </label>
                            <select
                                name="donorType"
                                value={formData.donorType}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="restaurant">Restaurant</option>
                                <option value="individual">Individual</option>
                                <option value="catering">Catering Service</option>
                                <option value="grocery">Grocery Store</option>
                            </select>
                        </div>

                        {/* Food Items */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Food Items *
                            </label>
                            {formData.foodItems.map((item, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Food Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => handleFoodItemChange(index, 'name', e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Quantity *
                                            </label>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleFoodItemChange(index, 'quantity', e.target.value)}
                                                required
                                                min="0.1"
                                                step="0.1"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Unit *
                                            </label>
                                            <select
                                                value={item.unit}
                                                onChange={(e) => handleFoodItemChange(index, 'unit', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
                                                <option value="kg">Kilograms (kg)</option>
                                                <option value="g">Grams (g)</option>
                                                <option value="lbs">Pounds (lbs)</option>
                                                <option value="pieces">Pieces</option>
                                                <option value="packages">Packages</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expiry Date *
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={item.expiryDate}
                                                onChange={(e) => handleFoodItemChange(index, 'expiryDate', e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={item.description}
                                            onChange={(e) => handleFoodItemChange(index, 'description', e.target.value)}
                                            rows="2"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                    {formData.foodItems.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFoodItem(index)}
                                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                                        >
                                            Remove Item
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addFoodItem}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Add Food Item
                            </button>
                        </div>

                        {/* Pickup Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Pickup Address *
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="pickupAddress.street"
                                        value={formData.pickupAddress.street}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="pickupAddress.city"
                                        value={formData.pickupAddress.city}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        name="pickupAddress.state"
                                        value={formData.pickupAddress.state}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ZIP Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="pickupAddress.zipCode"
                                        value={formData.pickupAddress.zipCode}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pickup Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Pickup Time Window *
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="pickupTime.start"
                                        value={formData.pickupTime.start}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="pickupTime.end"
                                        value={formData.pickupTime.end}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Special Instructions
                            </label>
                            <textarea
                                name="specialInstructions"
                                value={formData.specialInstructions}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Any special handling requirements, allergies, or other important information..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                                Create Donation
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateDonationModal; 