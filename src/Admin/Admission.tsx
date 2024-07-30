import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Image,
  VStack,
} from '@chakra-ui/react';

interface FormData {
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
}

const Admission: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    studentNameBn: '',
    studentNameEn: '',
    fatherNameBn: '',
    fatherNameEn: '',
    fatherMobile: '',
    motherNameBn: '',
    motherNameEn: '',
    motherMobile: '',
    dob: '',
    desiredGrade: '',
    previousSchool: '',
    permanentAddressVillage: '',
    permanentAddressPostOffice: '',
    permanentAddressUpazila: '',
    permanentAddressDistrict: '',
    currentAddressVillage: '',
    currentAddressPostOffice: '',
    currentAddressUpazila: '',
    currentAddressDistrict: '',
    desiredDivision: '',
    desiredGradeForAdmission: '',
    previousGradeCertificate: null,
    birthCertificate: null,
    parentsIdCard: null,
    studentPhoto: null,
    bloodGroup: '',
  });

  const [previewPhoto, setPreviewPhoto] = useState<string | undefined>(undefined);
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === 'studentPhoto') {
        const file = files[0];
        setFormData(prevState => ({ ...prevState, [name]: file }));
        const reader = new FileReader();
        reader.onload = () => setPreviewPhoto(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setFormData(prevState => ({ ...prevState, [name]: files[0] }));
      }
    }
  };

  const handleSubmit = () => {
    // Implement form submission logic here
    toast({
      title: 'Form submitted.',
      description: 'Your admission form has been submitted successfully.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box p={5} maxW="800px" mx="auto">
      <VStack spacing={5} align="flex-start">

        <Box mb={6}>
          <FormLabel>ছাত্র / ছাত্রীর ছবি</FormLabel>
          <Image
            src={previewPhoto ? previewPhoto : "https://via.placeholder.com/150"}
            alt="Student Photo"
            borderRadius="md"
            boxSize="150px"
            mb={4}
          />
          <FormControl mb={4}>
            <FormLabel>ছাত্র / ছাত্রীর ছবি (JPG, PNG, or JPEG)</FormLabel>
            <Input
              type="file"
              accept=".jpg, .jpeg, .png"
              name="studentPhoto"
              onChange={handleFileChange}
            />
          </FormControl>
        </Box>

        <FormControl mb={4}>
          <FormLabel>ছাত্র / ছাত্রীর নাম (বাংলায়)</FormLabel>
          <Input
            name="studentNameBn"
            value={formData.studentNameBn}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>ছাত্র / ছাত্রীর নাম (ইংরেজি)</FormLabel>
          <Input
            name="studentNameEn"
            value={formData.studentNameEn}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>পিতার নাম (বাংলায়)</FormLabel>
          <Input
            name="fatherNameBn"
            value={formData.fatherNameBn}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>পিতার নাম (ইংরেজি)</FormLabel>
          <Input
            name="fatherNameEn"
            value={formData.fatherNameEn}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>মোবাইল নং (পিতা)</FormLabel>
          <Input
            name="fatherMobile"
            value={formData.fatherMobile}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>মাতার নাম (বাংলায়)</FormLabel>
          <Input
            name="motherNameBn"
            value={formData.motherNameBn}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>মাতার নাম (ইংরেজি)</FormLabel>
          <Input
            name="motherNameEn"
            value={formData.motherNameEn}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>মোবাইল নং (মাতা)</FormLabel>
          <Input
            name="motherMobile"
            value={formData.motherMobile}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>ছাত্র / ছাত্রীর জন্মতারিখ</FormLabel>
          <Input
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>রক্তের গ্রুপ</FormLabel>
          <Select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </Select>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>যে শ্রেনীতে ভর্তি হতে ইচ্ছুক</FormLabel>
          <Select
            name="desiredGrade"
            value={formData.desiredGrade}
            onChange={handleChange}
          >
            <option value="">Select Grade</option>
            <option value="5th">৫ম শ্রেনী</option>
            <option value="6th">৬ষ্ঠ শ্রেনী</option>
            <option value="7th">৭ম শ্রেনী</option>
            <option value="8th">৮ম শ্রেনী</option>
          </Select>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>যে বিদ্যালয় থেকে ৫ম/৬ষ্ঠ/৭ম/৮ম শ্রেনী পাশ করিয়াছ</FormLabel>
          <Input
            name="previousSchool"
            value={formData.previousSchool}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>স্থায়ী ঠিকানা (গ্রাম)</FormLabel>
          <Input
            name="permanentAddressVillage"
            value={formData.permanentAddressVillage}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>স্থায়ী ঠিকানা (ডাকঘর)</FormLabel>
          <Input
            name="permanentAddressPostOffice"
            value={formData.permanentAddressPostOffice}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>স্থায়ী ঠিকানা (উপজেলা)</FormLabel>
          <Input
            name="permanentAddressUpazila"
            value={formData.permanentAddressUpazila}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>স্থায়ী ঠিকানা (জেলা)</FormLabel>
          <Input
            name="permanentAddressDistrict"
            value={formData.permanentAddressDistrict}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>বর্তমান ঠিকানা (গ্রাম)</FormLabel>
          <Input
            name="currentAddressVillage"
            value={formData.currentAddressVillage}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>বর্তমান ঠিকানা (ডাকঘর)</FormLabel>
          <Input
            name="currentAddressPostOffice"
            value={formData.currentAddressPostOffice}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>বর্তমান ঠিকানা (উপজেলা)</FormLabel>
          <Input
            name="currentAddressUpazila"
            value={formData.currentAddressUpazila}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>বর্তমান ঠিকানা (জেলা)</FormLabel>
          <Input
            name="currentAddressDistrict"
            value={formData.currentAddressDistrict}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>যে বিভাগে ভর্তি হতে ইচ্ছুক</FormLabel>
          <Input
            name="desiredDivision"
            value={formData.desiredDivision}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>যে শ্রেনীতে ভর্তি হতে ইচ্ছুক</FormLabel>
          <Input
            name="desiredGradeForAdmission"
            value={formData.desiredGradeForAdmission}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>পূর্ববর্তি শ্রেনীর পাশের সনদ (PDF)</FormLabel>
          <Input
            type="file"
            accept=".pdf"
            name="previousGradeCertificate"
            onChange={handleFileChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>অনলাইন জন্ম নিবন্ধনের ফটোকপি (PDF)</FormLabel>
          <Input
            type="file"
            accept=".pdf"
            name="birthCertificate"
            onChange={handleFileChange}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>পিতা ও মাতার জাতীয় পরিচয় পত্র এর ফটোকপি (PDF)</FormLabel>
          <Input
            type="file"
            accept=".pdf"
            name="parentsIdCard"
            onChange={handleFileChange}
          />
        </FormControl>

        <Button colorScheme="teal" onClick={handleSubmit}>
          জমা দিন
        </Button>
      </VStack>
    </Box>
  );
};

export default Admission;
