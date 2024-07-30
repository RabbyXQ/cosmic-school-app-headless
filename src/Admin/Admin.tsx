import React from 'react';

import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';

function Admin() {
  return (
    <>
      <AdminLayout>
        <Dashboard/>
      </AdminLayout>
    </>
  );
}

export default Admin;
