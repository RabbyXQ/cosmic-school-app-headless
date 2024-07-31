import React, { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel, Select, Input, Button, VStack, Text, Stack } from '@chakra-ui/react';

// Mock Data
const mockData = [
  // Admission Data
  { id: 'A1', type: 'Admission', admission_id: 'AD123', class: '10A', section: 'A', year: '2024', status: 'Paid', name: 'John Doe' },
  { id: 'A2', type: 'Admission', admission_id: 'AD124', class: '10B', section: 'B', year: '2024', status: 'Unpaid', name: 'Jane Smith' },

  // Regular Data
  { id: 'R1', type: 'Regular', student_id: 'ST456', class: '11A', section: 'A', year: '2023', month: 'March', status: 'Paid', name: 'Robert Brown' },
  { id: 'R2', type: 'Regular', student_id: 'ST457', class: '11B', section: 'B', year: '2023', month: 'April', status: 'Unpaid', name: 'Emily Johnson' },

  // Job Data
  { id: 'J1', type: 'Job', job_id: 'JB789', application_id: 'AP111', status: 'Paid', name: 'Alice Williams' },
  { id: 'J2', type: 'Job', job_id: 'JB790', application_id: 'AP112', status: 'Unpaid', name: 'Bob Miller' }
];

const Payment: React.FC = () => {
  const [paymentType, setPaymentType] = useState<string>('Admission');
  const [admissionId, setAdmissionId] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [jobId, setJobId] = useState<string>('');
  const [applicationId, setApplicationId] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [data, setData] = useState(mockData);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Extract unique classes and sections from the mock data
  const classes = Array.from(new Set(mockData.map(item => item.class)).values());
  const sections = Array.from(new Set(mockData.map(item => item.section)).values());
  const statuses = Array.from(new Set(mockData.map(item => item.status)).values());

  useEffect(() => {
    handleFilterChange();
  }, [paymentType, admissionId, studentId, jobId, applicationId, year, month, selectedClass, selectedSection, status]);

  const handlePaymentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentType(e.target.value);
    // Reset fields when payment type changes
    setAdmissionId('');
    setStudentId('');
    setJobId('');
    setApplicationId('');
    setYear('');
    setMonth('');
    setSelectedClass('');
    setSelectedSection('');
    setStatus('');
  };

  const handleFilterChange = () => {
    const filteredData = mockData.filter(item => 
      (paymentType === 'Admission' && item.type === 'Admission' && admissionId ? item.admission_id === admissionId : true) &&
      (paymentType === 'Regular' && item.type === 'Regular' && studentId ? item.student_id === studentId : true) &&
      (paymentType === 'Job' && item.type === 'Job' && jobId ? item.job_id === jobId : true) &&
      (!year || item.year === year) &&
      (!month || item.month === month) &&
      (!selectedClass || item.class === selectedClass) &&
      (!selectedSection || item.section === selectedSection) &&
      (!status || item.status === status)
    );
    setData(filteredData);
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md">
      <VStack spacing={4} align="start">
        <FormControl>
          <FormLabel htmlFor="paymentType">Payment Type</FormLabel>
          <Select
            id="paymentType"
            value={paymentType}
            onChange={handlePaymentTypeChange}
          >
            <option value="Admission">Admission</option>
            <option value="Regular">Regular</option>
            <option value="Job">Job</option>
          </Select>
        </FormControl>

        {paymentType === 'Admission' && (
          <FormControl>
            <FormLabel htmlFor="admissionId">Admission ID</FormLabel>
            <Input
              id="admissionId"
              value={admissionId}
              onChange={(e) => setAdmissionId(e.target.value)}
            />
          </FormControl>
        )}

        {paymentType === 'Regular' && (
          <>
            <FormControl>
              <FormLabel htmlFor="studentId">Student ID</FormLabel>
              <Input
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="year">Year</FormLabel>
              <Select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">Select Year</option>
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="month">Month</FormLabel>
              <Select
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Select Month</option>
                {months.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="class">Class</FormLabel>
              <Select
                id="class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="section">Section</FormLabel>
              <Select
                id="section"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">Select Section</option>
                {sections.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </Select>
            </FormControl>
          </>
        )}

        {paymentType === 'Job' && (
          <>
            <FormControl>
              <FormLabel htmlFor="jobId">Job ID</FormLabel>
              <Input
                id="jobId"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="applicationId">Application ID</FormLabel>
              <Input
                id="applicationId"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
              />
            </FormControl>
          </>
        )}

        <FormControl>
          <FormLabel htmlFor="status">Status</FormLabel>
          <Select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            {statuses.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </Select>
        </FormControl>

        <Stack spacing={3} mt={4}>
          {data.map((item) => (
            <Box
              key={item.id}
              p={4}
              borderWidth={1}
              borderRadius="md"
              boxShadow="md"
            >
              <Text><strong>Type:</strong> {item.type}</Text>
              {item.type === 'Admission' && (
                <>
                  <Text><strong>Admission ID:</strong> {item.admission_id}</Text>
                  <Text><strong>Class:</strong> {item.class}</Text>
                  <Text><strong>Section:</strong> {item.section}</Text>
                  <Text><strong>Year:</strong> {item.year}</Text>
                </>
              )}
              {item.type === 'Regular' && (
                <>
                  <Text><strong>Student ID:</strong> {item.student_id}</Text>
                  <Text><strong>Class:</strong> {item.class}</Text>
                  <Text><strong>Section:</strong> {item.section}</Text>
                  <Text><strong>Year:</strong> {item.year}</Text>
                  <Text><strong>Month:</strong> {item.month}</Text>
                </>
              )}
              {item.type === 'Job' && (
                <>
                  <Text><strong>Job ID:</strong> {item.job_id}</Text>
                  <Text><strong>Application ID:</strong> {item.application_id}</Text>
                </>
              )}
              <Text><strong>Status:</strong> {item.status}</Text>
              <Text><strong>Name:</strong> {item.name}</Text>
            </Box>
          ))}
        </Stack>
      </VStack>
    </Box>
  );
};

export default Payment;
