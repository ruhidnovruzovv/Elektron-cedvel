import React, { useState, useEffect } from 'react';
import { get } from '../../../api/service';

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, name: string, specialtyIds: number[]) => void;
  course: {
    id: number;
    name: string;
    specialities: { [key: string]: string } | string[];
  };
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  course,
}) => {
  const [name, setName] = useState('');
  const [specialtyIds, setSpecialtyIds] = useState<number[]>([]);
  const [allSpecialities, setAllSpecialities] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    if (course) {
      setName(course.name);
      const initialSpecialtyIds = Array.isArray(course.specialities)
        ? (course.specialities
            .map((speciality) => {
              const foundSpeciality = allSpecialities.find(
                (s) => s.name === speciality,
              );
              return foundSpeciality ? foundSpeciality.id : null;
            })
            .filter((id) => id !== null) as number[])
        : Object.keys(course.specialities).map(Number);
      setSpecialtyIds(initialSpecialtyIds);
    }
  }, [course, allSpecialities]);

  useEffect(() => {
    // Fetch all specialities from the API
    const fetchSpecialities = async () => {
      try {
        const response = await get('/api/speciality');
        setAllSpecialities(response.data);
      } catch (error) {
        console.error('Error fetching specialities:', error);
      }
    };

    fetchSpecialities();
  }, []);

  const handleSave = () => {
    if (name && specialtyIds.length > 0) {
      onSave(course.id, name, specialtyIds);
    }
  };

  const handleSpecialtyChange = (id: number) => {
    setSpecialtyIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full sm:w-2/3 md:w-1/2  p-6 rounded-lg shadow-lg overflow-y-auto max-h-full">
        <h2 className="text-2xl font-bold mb-4">Kursu Redaktə Et</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Ad</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <label className="block text-gray-700 mb-2">İxtisaslar</label>
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allSpecialities.map((speciality) => (
            <div key={speciality.id} className="flex items-center">
              <input
                type="checkbox"
                checked={specialtyIds.includes(speciality.id)}
                onChange={() => handleSpecialtyChange(speciality.id)}
                className="mr-2"
              />
              <label>{speciality.name}</label>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2 hover:bg-gray-600 transition duration-200"
          >
            Ləğv et
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Yadda saxla
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCourseModal;