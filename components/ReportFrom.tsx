import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ReportFormProps {
    onSubmit: (reason: string) => void;
    onCancel: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, onCancel }) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedReason = reason.trim();

        if (trimmedReason) {
            setError('');
            onSubmit(trimmedReason);
        } else {
            setError("You must provide a reason for reporting");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto">
                <div className="bg-red-500 text-white p-4 rounded-t-lg flex justify-between items-center">
                    <h2 className="text-lg font-semibold flex items-center">
                        <FontAwesomeIcon icon={faFlag} className="mr-2" />
                        Report Content
                    </h2>
                    <button
                        onClick={onCancel}
                        className="hover:bg-red-600 p-2 rounded-full transition duration-300"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label
                            htmlFor="report-reason"
                            className="block text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Reason for reporting:
                        </label>
                        <textarea
                            id="report-reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                            rows={4}
                            placeholder="Please describe why you are reporting this content..."
                            required
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faFlag} className="mr-2" />
                            Submit Report
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportForm;