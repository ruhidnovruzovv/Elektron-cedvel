import React, { useState, useEffect } from 'react';
import { get } from '../../../api/service';

interface Department {
  id: number;
  name: string;
}

interface RoomType {
  id: number;
  name: string;
}

interface Corps {
  id: number;
  name: string;
}

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    name: string,
    room_capacity: number,
    department_name: string,
    room_type_name: string,
    corps_name: string,
  ) => void;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [roomCapacity, setRoomCapacity] = useState<number | null>(null);
  const [departmentName, setDepartmentName] = useState<string | null>(null);
  const [roomTypeName, setRoomTypeName] = useState<string | null>(null);
  const [corpsName, setCorpsName] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [corps, setCorps] = useState<Corps[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await get('/api/department');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    const fetchRoomTypes = async () => {
      try {
        const response = await get('/api/roomtype');
        setRoomTypes(response.data);
      } catch (error) {
        console.error('Error fetching room types:', error);
      }
    };

    const fetchCorps = async () => {
      try {
        const response = await get('/api/corps');
        setCorps(response.data);
      } catch (error) {
        console.error('Error fetching corps:', error);
      }
    };

    if (isOpen) {
      fetchDepartments();
      fetchRoomTypes();
      fetchCorps();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (
      departmentName !== null &&
      roomTypeName !== null &&
      corpsName !== null &&
      roomCapacity !== null
    ) {
      onSave(name, roomCapacity, departmentName, roomTypeName, corpsName);
      setName('');
      setRoomCapacity(null);
      setDepartmentName(null);
      setRoomTypeName(null);
      setCorpsName(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Yeni Otaq Əlavə Et</h2>
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
            htmlFor="roomCapacity"
            className="block text-sm font-medium text-gray-700"
          >
            Tutum
          </label>
          <input
            id="roomCapacity"
            name="roomCapacity"
            type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={roomCapacity || ''}
            onChange={(e) => setRoomCapacity(Number(e.target.value))}
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
        <div className="mb-4">
          <label
            htmlFor="roomType"
            className="block text-sm font-medium text-gray-700"
          >
            Otaq Tipi
          </label>
          <select
            id="roomType"
            name="roomType"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={roomTypeName || ''}
            onChange={(e) => setRoomTypeName(e.target.value)}
          >
            <option value="">Seçin</option>
            {roomTypes.map((roomType) => (
              <option key={roomType.id} value={roomType.name}>
                {roomType.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="corps"
            className="block text-sm font-medium text-gray-700"
          >
            Korpus
          </label>
          <select
            id="corps"
            name="corps"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={corpsName || ''}
            onChange={(e) => setCorpsName(e.target.value)}
          >
            <option value="">Seçin</option>
            {corps.map((corp) => (
              <option key={corp.id} value={corp.name}>
                {corp.name}
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

export default AddRoomModal;