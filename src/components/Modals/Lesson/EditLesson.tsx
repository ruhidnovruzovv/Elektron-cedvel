import React, { useState, useEffect } from 'react';
import { get } from '../../../api/service';

interface Department {
  id: number;
  name: string;
}

interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, department_name: string) => void;
  initialData: {
    id: number;
    name: string;
    department_name: string;
  };
}

const EditLessonModal: React.FC<EditLessonModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState(initialData.name);
  const [departmentName, setDepartmentName] = useState<string | null>(
    initialData.department_name,
  );
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await get('/api/department');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setName(initialData.name);
      setDepartmentName(initialData.department_name);
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (departmentName !== null) {
      onSave(name, departmentName);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  h-screen w-full bg-[#0000006c]  flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Dərsi Redaktə Et</h2>
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Kafedra
          </label>
          <select
            id="department"
            name="department"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={departmentName || ''}
            onChange={(e) => setDepartmentName(e.target.value)}
          >
            <option value="">Seçin</option>
            {departments.map((department) => (
              <option key={department.id} value={department.name}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
            onClick={onClose}
          >
            Ləğv et
          </button>
          <button
            type="button"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
            onClick={handleSubmit}
          >
            Təsdiq et
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLessonModal;
