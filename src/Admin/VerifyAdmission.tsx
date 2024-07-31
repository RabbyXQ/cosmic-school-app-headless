import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  Alert,
  AlertIcon,
  HStack,
} from '@chakra-ui/react';
import { DeleteIcon, CheckIcon, ViewIcon, EditIcon, AddIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

interface FormData {
  id: number;
  studentNameBn: string;
  studentNameEn: string;
  fatherNameBn: string;
  fatherNameEn: string;
  fatherMobile: string;
  motherNameBn: string;
  motherNameEn: string;
  motherMobile: string;
  dob: string;
  desiredGrade: string;
  previousSchool: string;
  permanentAddressVillage: string;
  permanentAddressPostOffice: string;
  permanentAddressUpazila: string;
  permanentAddressDistrict: string;
  currentAddressVillage: string;
  currentAddressPostOffice: string;
  currentAddressUpazila: string;
  currentAddressDistrict: string;
  desiredDivision: string;
  desiredGradeForAdmission: string;
  previousGradeCertificate: File | null;
  birthCertificate: File | null;
  parentsIdCard: File | null;
  studentPhoto: File | null;
  bloodGroup: string;
  year: number;
}

const mockApplications: FormData[] = [
  {
    id: 1,
    studentNameBn: 'মোহাম্মদ আলী',
    studentNameEn: 'Mohammad Ali',
    fatherNameBn: 'আব্দুল হানিফ',
    fatherNameEn: 'Abdul Hanif',
    fatherMobile: '01712345678',
    motherNameBn: 'জাহানারা বেগম',
    motherNameEn: 'Jahanara Begum',
    motherMobile: '01812345678',
    dob: '2005-01-15',
    desiredGrade: '১০ম',
    previousSchool: 'ঢাকা কলেজ',
    permanentAddressVillage: 'ভাটারা',
    permanentAddressPostOffice: 'ভাটারা পোস্ট অফিস',
    permanentAddressUpazila: 'উত্তরা',
    permanentAddressDistrict: 'ঢাকা',
    currentAddressVillage: 'গণভবন',
    currentAddressPostOffice: 'গণভবন পোস্ট অফিস',
    currentAddressUpazila: 'গণভবন',
    currentAddressDistrict: 'ঢাকা',
    desiredDivision: 'ঢাকা',
    desiredGradeForAdmission: '১০ম',
    previousGradeCertificate: null,
    birthCertificate: null,
    parentsIdCard: null,
    studentPhoto: null,
    bloodGroup: 'O+',
    year: 2024,
  },
  // Add more mock data as needed
];

const currentYear = new Date().getFullYear();

const VerifyAdmission: React.FC = () => {
  const [applications, setApplications] = useState<FormData[]>(mockApplications);
  const [filteredApplications, setFilteredApplications] = useState<FormData[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<FormData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [searchId, setSearchId] = useState<string>('');
  const toast = useToast();

  useEffect(() => {
    const filtered = applications
      .filter(app => app.id.toString().includes(searchId))
      .filter(app => app.year === selectedYear);
      
    setFilteredApplications(filtered);
  }, [applications, selectedYear, searchId]);

  const handleApprove = (application: FormData) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleView = (application: FormData) => {
    setSelectedApplication(application);
    setShowViewModal(true);
  };

  const handleEdit = (application: FormData) => {
    setSelectedApplication(application);
    setShowEditModal(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      setApplications(prev => prev.filter((_, i) => i !== index));
      toast({
        title: 'Application Deleted',
        description: `Application has been deleted.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleConfirmApproval = () => {
    if (selectedApplication) {
      setApplications(prev =>
        prev.map(app =>
          app.id === selectedApplication.id
            ? { ...app, desiredGradeForAdmission: 'Approved' }
            : app
        )
      );

      toast({
        title: 'Application Approved',
        description: `Application for ${selectedApplication.studentNameEn} has been approved.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setShowModal(false);
      setSelectedApplication(null);
    }
  };

  const handleUpdate = () => {
    if (selectedApplication) {
      setApplications(prev =>
        prev.map(app =>
          app.id === selectedApplication.id ? selectedApplication : app
        )
      );

      toast({
        title: 'Application Updated',
        description: `Application for ${selectedApplication.studentNameEn} has been updated.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setShowEditModal(false);
      setSelectedApplication(null);
    }
  };

  return (
    <Box p={5} maxW="1200px" mx="auto">
      <Text fontSize="2xl" mb={4}>List of Applications</Text>
      
      <Stack spacing={4} mb={4}>
        
        <FormControl>
        <HStack>
          
          <FormLabel>Filter by Year</FormLabel>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {[currentYear, currentYear - 1, currentYear - 2].map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
          <Link to="/admin/add-admission">
          <Button mx={10} type='button' colorScheme='green'>
             <AddIcon/> 
             New
             </Button>
             </Link>
          </HStack>
        </FormControl>
        <FormControl>
          <FormLabel>Search by Application ID</FormLabel>
          <Input
            placeholder="Enter application ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </FormControl>
      </Stack>

      {filteredApplications.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No applications match the current filters.
        </Alert>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Application ID</Th>
              <Th>Student Name (English)</Th>
              <Th>Year</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredApplications.map((application, index) => (
              <Tr key={application.id}>
                <Td>{application.id}</Td>
                <Td>{application.studentNameEn}</Td>
                <Td>{application.year}</Td>
                <Td>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleView(application)}
                    mr={2}
                  >
                    <ViewIcon />
                  </Button>
                  <Button
                    colorScheme="green"
                    onClick={() => handleApprove(application)}
                    mr={2}
                  >
                    <CheckIcon />
                  </Button>
                  <Button
                    colorScheme="yellow"
                    onClick={() => handleEdit(application)}
                    mr={2}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDelete(filteredApplications.indexOf(application))}
                  >
                    <DeleteIcon />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Approval Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Approve Application</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedApplication && (
              <Box>
                <Text fontSize="lg" mb={2}>
                  Are you sure you want to approve the application for{' '}
                  {selectedApplication.studentNameEn}?
                </Text>
                <Text mb={2}>Application ID: {selectedApplication.id}</Text>
                <Text mb={2}>Desired Grade: {selectedApplication.desiredGradeForAdmission}</Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleConfirmApproval}>
              Confirm Approval
            </Button>
            <Button ml={3} onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>View Application</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      {selectedApplication && (
        <Box>
          <Text fontSize="lg" mb={2}>Application ID: {selectedApplication.id}</Text>
          <Text mb={2}>Student Name (Bangla): {selectedApplication.studentNameBn}</Text>
          <Text mb={2}>Student Name (English): {selectedApplication.studentNameEn}</Text>
          <Text mb={2}>Father's Name (Bangla): {selectedApplication.fatherNameBn}</Text>
          <Text mb={2}>Father's Name (English): {selectedApplication.fatherNameEn}</Text>
          <Text mb={2}>Father's Mobile: {selectedApplication.fatherMobile}</Text>
          <Text mb={2}>Mother's Name (Bangla): {selectedApplication.motherNameBn}</Text>
          <Text mb={2}>Mother's Name (English): {selectedApplication.motherNameEn}</Text>
          <Text mb={2}>Mother's Mobile: {selectedApplication.motherMobile}</Text>
          <Text mb={2}>Date of Birth: {selectedApplication.dob}</Text>
          <Text mb={2}>Desired Grade: {selectedApplication.desiredGrade}</Text>
          <Text mb={2}>Previous School: {selectedApplication.previousSchool}</Text>
          <Text mb={2}>Permanent Address Village: {selectedApplication.permanentAddressVillage}</Text>
          <Text mb={2}>Permanent Address Post Office: {selectedApplication.permanentAddressPostOffice}</Text>
          <Text mb={2}>Permanent Address Upazila: {selectedApplication.permanentAddressUpazila}</Text>
          <Text mb={2}>Permanent Address District: {selectedApplication.permanentAddressDistrict}</Text>
          <Text mb={2}>Current Address Village: {selectedApplication.currentAddressVillage}</Text>
          <Text mb={2}>Current Address Post Office: {selectedApplication.currentAddressPostOffice}</Text>
          <Text mb={2}>Current Address Upazila: {selectedApplication.currentAddressUpazila}</Text>
          <Text mb={2}>Current Address District: {selectedApplication.currentAddressDistrict}</Text>
          <Text mb={2}>Desired Division: {selectedApplication.desiredDivision}</Text>
          <Text mb={2}>Desired Grade for Admission: {selectedApplication.desiredGradeForAdmission}</Text>
          <Text mb={2}>Blood Group: {selectedApplication.bloodGroup}</Text>
        </Box>
      )}
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" onClick={() => setShowViewModal(false)}>
        Close
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <ModalOverlay />
        <ModalContent>
  <ModalHeader>Edit Application</ModalHeader>
  <ModalCloseButton />
  <ModalBody>
    {selectedApplication && (
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Student Name (Bangla)</FormLabel>
          <Input
            value={selectedApplication.studentNameBn}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                studentNameBn: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Student Name (English)</FormLabel>
          <Input
            value={selectedApplication.studentNameEn}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                studentNameEn: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Father's Name (Bangla)</FormLabel>
          <Input
            value={selectedApplication.fatherNameBn}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                fatherNameBn: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Father's Name (English)</FormLabel>
          <Input
            value={selectedApplication.fatherNameEn}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                fatherNameEn: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Father's Mobile</FormLabel>
          <Input
            value={selectedApplication.fatherMobile}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                fatherMobile: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Mother's Name (Bangla)</FormLabel>
          <Input
            value={selectedApplication.motherNameBn}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                motherNameBn: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Mother's Name (English)</FormLabel>
          <Input
            value={selectedApplication.motherNameEn}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                motherNameEn: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Mother's Mobile</FormLabel>
          <Input
            value={selectedApplication.motherMobile}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                motherMobile: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Date of Birth</FormLabel>
          <Input
            type="date"
            value={selectedApplication.dob}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                dob: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Desired Grade</FormLabel>
          <Input
            value={selectedApplication.desiredGrade}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                desiredGrade: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Previous School</FormLabel>
          <Input
            value={selectedApplication.previousSchool}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                previousSchool: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Permanent Address Village</FormLabel>
          <Input
            value={selectedApplication.permanentAddressVillage}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                permanentAddressVillage: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Permanent Address Post Office</FormLabel>
          <Input
            value={selectedApplication.permanentAddressPostOffice}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                permanentAddressPostOffice: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Permanent Address Upazila</FormLabel>
          <Input
            value={selectedApplication.permanentAddressUpazila}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                permanentAddressUpazila: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Permanent Address District</FormLabel>
          <Input
            value={selectedApplication.permanentAddressDistrict}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                permanentAddressDistrict: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Current Address Village</FormLabel>
          <Input
            value={selectedApplication.currentAddressVillage}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                currentAddressVillage: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Current Address Post Office</FormLabel>
          <Input
            value={selectedApplication.currentAddressPostOffice}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                currentAddressPostOffice: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Current Address Upazila</FormLabel>
          <Input
            value={selectedApplication.currentAddressUpazila}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                currentAddressUpazila: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Current Address District</FormLabel>
          <Input
            value={selectedApplication.currentAddressDistrict}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                currentAddressDistrict: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Desired Division</FormLabel>
          <Input
            value={selectedApplication.desiredDivision}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                desiredDivision: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Desired Grade for Admission</FormLabel>
          <Input
            value={selectedApplication.desiredGradeForAdmission}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                desiredGradeForAdmission: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Blood Group</FormLabel>
          <Input
            value={selectedApplication.bloodGroup}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                bloodGroup: e.target.value,
              })
            }
          />
        </FormControl>
      </Stack>
    )}
  </ModalBody>
  <ModalFooter>
    <Button colorScheme="blue" onClick={handleUpdate}>
      Update
    </Button>
    <Button ml={3} onClick={() => setShowEditModal(false)}>
      Cancel
    </Button>
  </ModalFooter>
</ModalContent>

      </Modal>
    </Box>
  );
};

export default VerifyAdmission;
