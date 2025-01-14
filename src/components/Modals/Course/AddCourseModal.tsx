import React, { useState, useEffect } from 'react';
import { get } from '../../../api/service';

interface Speciality {
  id: number;
  name: string;
}

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, specialityIds: number[]) => void;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [selectedSpecialities, setSelectedSpecialities] = useState<number[]>(
    [],
  );

  useEffect(() => {
    if (isOpen) {
      fetchSpecialities();
    }
  }, [isOpen]);

  const fetchSpecialities = async () => {
    try {
      const response = await get('/api/speciality');
      setSpecialities(response.data);
    } catch (error) {
      console.error('Error fetching specialities:', error);
    }
  };

  const handleSpecialityChange = (id: number) => {
    setSelectedSpecialities((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((specialityId) => specialityId !== id)
        : [...prevSelected, id],
    );
  };

  const handleSave = () => {
    if (name && selectedSpecialities.length > 0) {
      onSave(name, selectedSpecialities);
      setName('');
      setSelectedSpecialities([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Yeni Kurs Əlavə Et</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Ad</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">İxtisaslar</label>
          <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
            {specialities.map((speciality) => (
              <div key={speciality.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`speciality-${speciality.id}`}
                  className="mr-2"
                  checked={selectedSpecialities.includes(speciality.id)}
                  onChange={() => handleSpecialityChange(speciality.id)}
                />
                <label htmlFor={`speciality-${speciality.id}`}>
                  {speciality.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
            onClick={onClose}
          >
            İptal
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
            onClick={handleSave}
          >
            Əlavə et
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCourseModal;
