"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Feedback {
    id: number;
    name: string;
    email: string;
    message: string;
    status: string;
}

const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    title: string; 
    children: React.ReactNode; 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto mt-10 sm:mt-20">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            aria-label="Close modal"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const [data, setData] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
    const [aiSummary, setAiSummary] = useState<string>("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        status: "pending"
    });

    const API_BASE_URL = "https://feedback-api-3-xt6r.onrender.com";
    const API_KEY = "123456feedback";

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/feedbacks`, {
                headers: {
                    'x-api-key': API_KEY
                }
            });
            
            const result = await response.json();
            if (result) {
                setData(result);
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const createFeedback = async (feedbackData: Omit<Feedback, 'id'>) => {
        try {
            const response = await fetch(`${API_BASE_URL}/feedbacks/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify({
                    name: feedbackData.name,
                    email: feedbackData.email,
                    message: feedbackData.message,
                    status: feedbackData.status 
                })
            });
            
            const result = await response.json();
            if (result) {
                toast.success('Feedback Submitted..');
                await fetchFeedbacks();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error creating feedback:', error);
            return false;
        }
    };

    const updateFeedbackStatus = async (id: number, status: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/feedbacks/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify({ status })
            });
            
            const result = await response.json();
            if (result) {
                toast.success('Feedback Updated Successfully..');
                await fetchFeedbacks();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating feedback status:', error);
            return false;
        }
    };

    const getFeedbackSummary = async (message: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/feedbacks/summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify({ feedback: message })
            });
            
            const result = await response.json();
            if (result) {
                return result;
            }
            return "Unable to generate summary at this time.";
        } catch (error) {
            console.error('Error getting feedback summary:', error);
            return "Error generating summary. Please try again.";
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const filteredData = statusFilter === "all" 
        ? data 
        : data.filter(item => item.status === statusFilter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "resolved":
                return "bg-green-100 text-green-800";
            case "archived":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateFeedback = async () => {
        const success = await createFeedback({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            status: formData.status
        });
        
        if (success) {
            setFormData({ name: "", email: "", message: "", status: "pending" });
            setShowCreateModal(false);
        } else {
            toast.error("Failed to create feedback. Please try again.");
        }
    };

    const handleEdit = (feedback: Feedback) => {
        setEditingFeedback(feedback);
        setFormData({
            name: feedback.name,
            email: feedback.email,
            message: feedback.message,
            status: feedback.status
        });
        setShowEditModal(true);
    };

    const handleShowSummary = async (feedback: Feedback) => {
        setSelectedFeedback(feedback);
        setShowSummaryModal(true);
        
        const summary = await getFeedbackSummary(feedback.message);
        setAiSummary(summary);
    };

    const handleUpdateFeedback = async () => {
        if (!editingFeedback) return;
        
        const success = await updateFeedbackStatus(editingFeedback.id, formData.status);
        
        if (success) {
            setShowEditModal(false);
            setEditingFeedback(null);
            setFormData({ name: "", email: "", message: "", status: "pending" });
        } else {
            toast.error("Failed to update feedback. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading feedbacks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Feedback Viewer Dashboard
                    </h1>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Add Feedback
                        </button>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                Filter by Status:
                            </label>
                            <select
                                id="status-filter"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="resolved">Resolved</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">
                            Feedback List ({filteredData.length} items)
                        </h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                            Email
                                        </th>
                                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                            Message
                                        </th>
                                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredData.map((feedback) => (
                                        <tr key={feedback.id} className="hover:bg-gray-50">
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {feedback.id}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {feedback.name}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                                {feedback.email}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 max-w-xs truncate hidden md:table-cell">
                                                {feedback.message}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(feedback.status)}`}>
                                                    {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 sm:space-x-4">
                                                <button
                                                    onClick={() => handleEdit(feedback)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleShowSummary(feedback)}
                                                    className="inline-flex items-center px-2 sm:px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-md text-xs sm:text-sm font-medium transition-colors"
                                                >
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                    </svg>
                                                    <span className="hidden sm:inline">AI</span> Summary
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {filteredData.length === 0 && (
                        <div className="px-6 py-8 text-center">
                            <p className="text-gray-500">No feedback found for the selected status.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Feedback Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Feedback"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        >
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateFeedback}
                            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Edit Feedback Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Feedback"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-100"
                            required
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-100"
                            required
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-100"
                            required
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        >
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowEditModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdateFeedback}
                            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </Modal>

            {/* AI Summary Modal */}
            <Modal
                isOpen={showSummaryModal}
                onClose={() => setShowSummaryModal(false)}
                title="AI Feedback Analysis"
            >
                {selectedFeedback && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Original Feedback</h4>
                            <p className="text-sm text-gray-600 mb-1"><strong>From:</strong> {selectedFeedback.name} ({selectedFeedback.email})</p>
                            <p className="text-sm text-gray-600 mb-1"><strong>Message:</strong> {selectedFeedback.message}</p>
                            <p className="text-sm text-gray-600"><strong>Status:</strong> {selectedFeedback.status}</p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">🤖 AI Analysis</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {aiSummary || "Loading analysis..."}
                            </p>
                        </div>
                        
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setShowSummaryModal(false)}
                                className="px-4 py-2 bg-gray-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}