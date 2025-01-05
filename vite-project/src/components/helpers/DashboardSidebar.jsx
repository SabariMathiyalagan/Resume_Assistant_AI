import { FileText, MessageSquare, LogOut } from 'lucide-react';
import axios from 'axios';

function DashboardSidebar({activeTab, setActiveTab}) {
    const handleLogout = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            await axios.post(`${backendUrl}/api/logout`, {}, {
                withCredentials: true
            });
            
            window.location.replace("/");
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="d-flex flex-column h-100">
            <div>
                <h2 className="fs-4 fw-bold mb-4">Dashboard</h2>
                <nav className="nav flex-column bg-white">
                    <button
                        onClick={() => setActiveTab('resumes')}
                        className={`btn btn-link text-start text-decoration-none mb-2 d-flex align-items-center ${
                        activeTab === 'resumes' ? 'text-primary' : 'text-dark'
                        }`}
                    >
                        <FileText className="me-2" size={20} />
                        Resumes
                    </button>
                    <button
                        onClick={() => setActiveTab('assistant')}
                        className={`btn btn-link text-start text-decoration-none d-flex align-items-center ${
                        activeTab === 'assistant' ? 'text-primary' : 'text-dark'
                        }`}
                    >
                        <MessageSquare className="me-2" size={20} />
                        Assistant
                    </button>
                </nav>
            </div>
            
            <div className="mt-auto">
                <button
                    onClick={handleLogout}
                    className="btn btn-link text-start text-decoration-none d-flex align-items-center text-danger"
                >
                    <LogOut className="me-2" size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
}

export default DashboardSidebar;