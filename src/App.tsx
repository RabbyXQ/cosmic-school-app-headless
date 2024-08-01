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
import VerifyAdmission from './Admin/VerifyAdmission';
import Routine from './Admin/Routine';
import Payment from './Admin/Payment';
import Settings from './Admin/Settings/Settings';
import Pages from './Admin/Settings/Pages';
import AddPage from './Admin/Settings/AddPage';
import EditPage from './Admin/Settings/EditPage';
import SchoolInfo from './Admin/Settings/Schoolnfo';
import TopMenu from './Admin/Settings/TopMenu';
import BottomMenu from './Admin/Settings/BottomMenu';
import MessageBackend from './Admin/Settings/MessageBackend';
import MissionDataInput from './Admin/Settings/MissionDataInput';
import BriefEdit from './Admin/Settings/BriefEdit';
import MiddleMenu from './Admin/Settings/MiddleMenu';
import Menus from './Admin/Settings/Menus';
import ViewPage from './ViewPage';
import Header from './Header';
import Footer from './Footer';
import NoticeBoard from './NoticeBoard';

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
        <Route path="/admin/notices/add-notice" element={<AdminLayout><AddNoticePage/></AdminLayout>} />
        <Route path="/admin/notices/edit-notice/:id" element={<AdminLayout><EditNoticePage/></AdminLayout>} />
        <Route path="/admin/news" element={<AdminLayout><News/></AdminLayout>} />
        <Route path="/admin/add-news" element={<AdminLayout><AddNewsPage/></AdminLayout>} />
        <Route path="/admin/edit-news/:id" element={<AdminLayout><EditNewsPage/></AdminLayout>} />
        <Route path="/admin/admissions" element={<AdminLayout><VerifyAdmission/></AdminLayout>} />
        <Route path="/admin/add-admission" element={<AdminLayout><Admission/></AdminLayout>} />
        <Route path="/admin/payments" element={<AdminLayout><Payment/></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><Settings/></AdminLayout>} />
        <Route path="/admin/settings/pages" element={<AdminLayout><Pages/></AdminLayout>} />
        <Route path="/admin/settings/add-page" element={<AdminLayout><AddPage/></AdminLayout>} />
        <Route path="/admin/settings/edit-page/:id" element={<AdminLayout><EditPage/></AdminLayout>} />
        <Route path="/admin/settings/school-info" element={<AdminLayout><SchoolInfo/></AdminLayout>} />
        <Route path="/admin/settings/top-menu" element={<AdminLayout><TopMenu/></AdminLayout>} />
        <Route path="/admin/settings/bottom-menu" element={<AdminLayout><BottomMenu/></AdminLayout>} />
        <Route path="/admin/settings/patron-message" element={<AdminLayout><MessageBackend/></AdminLayout>} />
        <Route path="/admin/settings/mission-edit" element={<AdminLayout><MissionDataInput/></AdminLayout>} />
        <Route path="/admin/settings/brief-edit" element={<AdminLayout><BriefEdit/></AdminLayout>} />
        <Route path="/admin/settings/middle-menu" element={<AdminLayout><MiddleMenu/></AdminLayout>} />
        <Route path="/admin/settings/school-info" element={<AdminLayout><SchoolInfo/></AdminLayout>} />
        <Route path="/admin/settings/menus" element={<AdminLayout><Menus/></AdminLayout>} />

        <Route path="/admin/events" element={<AdminLayout><Events/></AdminLayout>} />
        <Route path="/admin/add-event" element={<AdminLayout><AddEventPage/></AdminLayout>} />
        <Route path="/admin/edit-event/:id" element={<AdminLayout><EditEventPage/></AdminLayout>} />
        <Route path="/admin/gallery" element={<AdminLayout><Gallery/></AdminLayout>} />
        <Route path="/admin/files" element={<AdminLayout><Files/></AdminLayout>} />
        <Route path="/admin/attendances" element={<AdminLayout><Attendances/></AdminLayout>} />
        <Route path="/admin/students" element={<AdminLayout><Students/></AdminLayout>} />
        <Route path="/admin/routine" element={<AdminLayout><Routine/></AdminLayout>} />


        <Route path="/admin/subjects" element={<AdminLayout><Subjects/></AdminLayout>} />

        <Route path="*" element={<NotFound />} /> {/* Optional */}
        <Route path="/pages/:slug" element={<>
          <Header/>
          <ViewPage />
          <Footer/>
          </>
          } />

          <Route path="/notices/" element={<>
          <Header/>
          <NoticeBoard showPaging={true} showAll={false} pageSize={5} />
          <Footer/>
          </>
          } />  

      </Routes>
    </Router>
  );
}

export default App;
