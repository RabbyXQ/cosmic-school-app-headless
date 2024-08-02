import { InfoOutlineIcon, SettingsIcon } from '@chakra-ui/icons';
import { MdAddAPhoto, MdAddBox, MdAdminPanelSettings, MdBrowseGallery, MdCalendarToday, MdCategory, MdClass, MdDashboard, MdEmojiPeople, MdEvent, MdFileUpload, MdImage, MdLogout, MdNewspaper, MdNotificationAdd, MdOutlineBrowseGallery, MdPayment, MdPeople, MdSettings, MdSubject, MdSyncLock, MdTimer } from 'react-icons/md';

export const adminSidebarItems = [
  { name: 'Admissions', icon: MdAddBox, url: '/admin/admissions/' },

  { name: 'Dashboard', icon: MdDashboard, url: '/admin/' },
  { name: 'Classes', icon: MdClass, url: '/admin/classes' },
  { name: 'Sections', icon: MdCategory, url: '/admin/sections/' },
  { name: 'Subjects', icon: MdSubject, url: '/admin/subjects/' },
  { name: 'Attendances', icon: MdCalendarToday, url: '/admin/attendances/' },
  
  { name: 'Employees', icon: MdEmojiPeople, url: '/admin/employees/' },
  { name: 'Notices', icon: MdNotificationAdd, url: '/admin/notices/' },
  { name: 'News', icon: MdNewspaper, url: '/admin/news/' },
  { name: 'Events', icon: MdEvent, url: '/admin/Events/' },
  { name: 'Gallery', icon: MdImage, url: '/admin/gallery/' },
  { name: 'Files', icon: MdFileUpload, url: '/admin/files/' },
  { name: 'Payments', icon: MdPayment, url: '/admin/payments/' },

  { name: 'Routine', icon: MdTimer, url: '/admin/routine/' },
  { name: 'Patrons', icon: MdAdminPanelSettings, url: '/admin/patrons/'},

  { name: 'Students', icon: MdPeople, url: '/admin/students/' },


  { name: 'Settings', icon: MdSettings, url: '/admin/settings/' },

  { name: 'Logout', icon: MdLogout, url: '/admin/logout/' },
];