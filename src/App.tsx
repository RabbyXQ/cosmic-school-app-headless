import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import AdminLayout from './Admin/AdminLayout';
import Dashboard from './Admin/Dashboard';
import NotFound from './Admin/NotFount';
import Classes from './Admin/Classes';
import Sections from './Admin/Sections';
import Employees from './Admin/Employees';
import Notices from './Admin/Notices';
import AddNoticePage from './Admin/AddNoticePage';
import Subjects from './Admin/Subjects';
import EditNoticePage from './Admin/EditNoticePage';
import News from './Admin/News';
import Events from './Admin/Events';
import AddNewsPage from './Admin/AddNewsPage';
import EditNewsPage from './Admin/EditNewsPage';
import AddEventPage from './Admin/AddEventPage';
import EditEventPage from './Admin/EditEventPage';
import Gallery from './Admin/Gallery';
import Files from './Admin/Files';
import Attendances from './Admin/Attendances';
import Admission from './Admin/Admission';
import Students from './Admin/Students';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLayout><Dashboard/></AdminLayout>} />
        <Route path="/admin/dashboard" element={<AdminLayout><Dashboard/></AdminLayout>} />
        <Route path="/admin/classes" element={<AdminLayout><Classes/></AdminLayout>} />
        <Route path="/admin/sections" element={<AdminLayout><Sections/></AdminLayout>} />
        <Route path="/admin/employees" element={<AdminLayout><Employees/></AdminLayout>} />
        <Route path="/admin/notices" element={<AdminLayout><Notices/></AdminLayout>} />
        <Route path="/admin/add-notice" element={<AdminLayout><AddNoticePage/></AdminLayout>} />
        <Route path="/admin/edit-notice/:id" element={<AdminLayout><EditNoticePage/></AdminLayout>} />
        <Route path="/admin/news" element={<AdminLayout><News/></AdminLayout>} />
        <Route path="/admin/add-news" element={<AdminLayout><AddNewsPage/></AdminLayout>} />
        <Route path="/admin/edit-news/:id" element={<AdminLayout><EditNewsPage/></AdminLayout>} />
        <Route path="/admin/admissions" element={<AdminLayout><Admission/></AdminLayout>} />

        <Route path="/admin/events" element={<AdminLayout><Events/></AdminLayout>} />
        <Route path="/admin/add-event" element={<AdminLayout><AddEventPage/></AdminLayout>} />
        <Route path="/admin/edit-event/:id" element={<AdminLayout><EditEventPage/></AdminLayout>} />
        <Route path="/admin/gallery" element={<AdminLayout><Gallery/></AdminLayout>} />
        <Route path="/admin/files" element={<AdminLayout><Files/></AdminLayout>} />
        <Route path="/admin/attendances" element={<AdminLayout><Attendances/></AdminLayout>} />
        <Route path="/admin/students" element={<AdminLayout><Students/></AdminLayout>} />


        <Route path="/admin/subjects" element={<AdminLayout><Subjects/></AdminLayout>} />

        <Route path="*" element={<NotFound />} /> {/* Optional */}
      </Routes>
    </Router>
  );
}

export default App;
