import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Preloader from '../components/Preloader';

export default function AdminBootcamp() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the main Admin Dashboard with the bootcamps tab active
    navigate('/admin', { state: { activeTab: 'bootcamps' } });
  }, [navigate]);

  return <Preloader text="REDIRECTING TO COMMAND CENTER..." />;
}
