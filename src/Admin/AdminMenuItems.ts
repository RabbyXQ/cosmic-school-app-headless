import { InfoOutlineIcon, SettingsIcon } from '@chakra-ui/icons';
import { MdAddAPhoto, MdAddBox, MdBrowseGallery, MdCalendarToday, MdCategory, MdClass, MdDashboard, MdEmojiPeople, MdEvent, MdFileUpload, MdImage, MdNewspaper, MdNotificationAdd, MdOutlineBrowseGallery, MdPeople, MdSubject } from 'react-icons/md';

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
  { name: 'Students', icon: MdPeople, url: '/admin/students/' },

  { name: 'Games', icon: SettingsIcon, url: '/admin/games/' },
  { name: 'Uploads', icon: SettingsIcon, url: '/admin/uploads/' },
  { name: 'Logout', icon: SettingsIcon, url: '/admin/logout/' },
];