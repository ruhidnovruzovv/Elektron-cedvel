import React, { useState, useEffect } from 'react';
import { get, put } from '../../../api/service';

interface GroupHelpers {
  group_types: { [key: string]: string };
  group_levels: { [key: string]: string };
}

interface Faculty {
  id: number;
  name: string;
}

interface Course {
  id: number;
  name: string;
}

interface Speciality {
  id: number;
  name: string;
}

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    name: string,
    studentAmount: number,
    groupType: number,
    groupLevel: number,
    faculty: string,
    course: string,
    speciality: string,
  ) => void;
  initialData: {
    id: number;
    name: string;
    studentAmount: number;
    groupType: string;
    groupLevel: string;
    faculty: string;
    course: string;
    speciality: string;
  };
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState(initialData.name);
  const [studentAmount, setStudentAmount] = useState(initialData.studentAmount);
  const [groupType, setGroupType] = useState('');
  const [groupLevel, setGroupLevel] = useState('');
  const [faculty, setFaculty] = useState(initialData.faculty);
  const [course, setCourse] = useState(initialData.course);
  const [speciality, setSpeciality] = useState(initialData.speciality);
  const [groupHelpers, setGroupHelpers] = useState<GroupHelpers | null>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);

  useEffect(() => {
    const fetchGroupHelpers = async () => {
      try {
        const response = await get('/api/group-info');
        setGroupHelpers(response.data);
      } catch (error) {
        console.error('Error fetching group helpers:', error);
      }
    };

    const fetchFaculties = async () => {
      try {
        const response = await get('/api/faculty');
        setFaculties(response.data);
      } catch (error) {
        console.error('Error fetching faculties:', error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await get('/api/course');
        const coursesData = Object.values(response.data.courses);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchSpecialities = async () => {
      try {
        const response = await get('/api/speciality');
        setSpecialities(response.data);
      } catch (error) {
        console.error('Error fetching specialities:', error);
      }
    };

    if (isOpen) {
      fetchGroupHelpers();
      fetchFaculties();
      fetchCourses();
      fetchSpecialities();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && groupHelpers) {
      setName(initialData.name);
      setStudentAmount(initialData.studentAmount);
      setFaculty(initialData.faculty);
      setCourse(initialData.course);
      setSpeciality(initialData.speciality);

      // groupType ve groupLevel değerlerini eşleştir
      const groupTypeKey = Object.keys(groupHelpers.group_types).find(
        (key) => groupHelpers.group_types[key] === initialData.groupType,
      );
      const groupLevelKey = Object.keys(groupHelpers.group_levels).find(
        (key) => groupHelpers.group_levels[key] === initialData.groupLevel,
      );

      setGroupType(groupTypeKey || '');
      setGroupLevel(groupLevelKey || '');
    }
  }, [isOpen, initialData, groupHelpers]);

  const handleSubmit = async () => {
    try {
      await put(`/api/group/${initialData.id}`, {
        name,
        student_amount: studentAmount,
        group_type: Number(groupType),
        group_level: Number(groupLevel),
        faculty_name: faculty,
        course_name: course,
        speciality_name: speciality,
      });
      onSave(
        name,
        studentAmount,
        Number(groupType),
        Number(groupLevel),
        faculty,
        course,
        speciality,
      );
      onClose();
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full sm:w-2/3 md:w-1/2 lg:w-1/3 p-6 rounded-lg shadow-lg overflow-y-auto max-h-full">
        <h2 className="text-xl font-bold mb-4">Qrupu Redaktə Et</h2>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Ad
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="studentAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Tələbə Sayı
          </label>
          <input
            id="studentAmount"
            name="studentAmount"
            type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={studentAmount}
            onChange={(e) => setStudentAmount(Number(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="groupType"
            className="block text-sm font-medium text-gray-700"
          >
            Qrup Tipi
          </label>
          <select
            id="groupType"
            name="groupType"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={groupType}
            onChange={(e) => setGroupType(e.target.value)}
          >
            <option value="">Seçin</option>
            {groupHelpers &&
              Object.entries(groupHelpers.group_types).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="groupLevel"
            className="block text-sm font-medium text-gray-700"
          >
            Qrup Səviyyəsi
          </label>
          <select
            id="groupLevel"
            name="groupLevel"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={groupLevel}
            onChange={(e) => setGroupLevel(e.target.value)}
          >
            <option value="">Seçin</option>
            {groupHelpers &&
              Object.entries(groupHelpers.group_levels).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="faculty"
            className="block text-sm font-medium text-gray-700"
          >
            Fakültə
          </label>
          <select
            id="faculty"
            name="faculty"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
          >
            <option value="">Seçin</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.name}>
                {faculty.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="course"
            className="block text-sm font-medium text-gray-700"
          >
            Kurs
          </label>
          <select
            id="course"
            name="course"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            <option value="">Seçin</option>
            {courses.map((course) => (
              <option key={course.id} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="speciality"
            className="block text-sm font-medium text-gray-700"
          >
            İxtisas
          </label>
          <select
            id="speciality"
            name="speciality"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
          >
            <option value="">Seçin</option>
            {specialities.map((speciality) => (
              <option key={speciality.id} value={speciality.name}>
                {speciality.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600 transition duration-200"
            onClick={onClose}
          >
            Ləğv et
          </button>
          <button
            type="button"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
            onClick={handleSubmit}
          >
            Təsdiq et
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGroupModal;