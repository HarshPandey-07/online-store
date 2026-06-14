import React from 'react'

/**
 * Formats a raw number into Indian Currency (INR) layout.
 * @param {number|string} amount The raw price value.
 * @returns {string} Formatted string (e.g., ₹1,50,000.00)
 */
export const formatINR = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount))
        return '₹0.00';

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

/**
 * Formats a raw number into Indian Numbering layout.
 * @param {number|string} amount The raw number value.
 * @returns {string} Formatted string (e.g., 1,50,000)
 */
export const formatNumber = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount))
        return '0';

    return new Intl.NumberFormat('en-IN', {
        style: 'decimal',
    }).format(amount);
};