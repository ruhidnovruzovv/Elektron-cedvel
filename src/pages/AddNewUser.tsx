import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../api/service';

interface Faculty {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

const AddNewUser: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [duty, setDuty] = useState('');
  const [employeeType, setEmployeeType] = useState('');
  const [facultyId, setFacultyId] = useState<number | null>(null);
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>(''); // Tek bir rol için state
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await get('/api/faculty');
        setFaculties(response.data);
      } catch (err: any) {
        console.error('Error fetching faculties:', err);
        setError(err.message || 'An error occurred');
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await get('/api/department');
        setDepartments(response.data);
      } catch (err: any) {
        console.error('Error fetching departments:', err);
        setError(err.message || 'An error occurred');
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await get('/api/roles');
        setAllRoles(response.data);
      } catch (err: any) {
        console.error('Error fetching roles:', err);
        setError(err.message || 'An error occurred');
      }
    };

    fetchFaculties();
    fetchDepartments();
    fetchRoles();
  }, []);

  const handleAddUser = async () => {
    try {
      await post('/api/users', {
        name,
        surname,
        patronymic,
        duty,
        employee_type: employeeType,
        faculty_id: facultyId!,
        department_id: departmentId!,
        email,
        password,
        role,
      });
      navigate('/users');
    } catch (err: any) {
      console.error('Error adding user:', err);
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">Yeni İstifadəçi Əlavə Et</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
        <label className="block text-gray-700 mb-2">Soyad</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-lg"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Ata adı</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-lg"
          value={patronymic}
          onChange={(e) => setPatronymic(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Vəzifə</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-lg"
          value={duty}
          onChange={(e) => setDuty(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">İşçi növü</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-lg"
          value={employeeType}
          onChange={(e) => setEmployeeType(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Fakültə</label>
        <select
          className="w-full px-3 py-2 border rounded-lg"
          value={facultyId || ''}
          onChange={(e) => setFacultyId(Number(e.target.value))}
          required
        >
          <option value="">Fakültə seçin</option>
          {faculties.map((faculty) => (
            <option key={faculty.id} value={faculty.id}>
              {faculty.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Kafedra</label>
        <select
          className="w-full px-3 py-2 border rounded-lg"
          value={departmentId || ''}
          onChange={(e) => setDepartmentId(Number(e.target.value))}
          required
        >
          <option value="">Kafedra seçin</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Email</label>
        <input
          type="email"
          className="w-full px-3 py-2 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Şifrə</label>
        <input
          type="password"
          className="w-full px-3 py-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Rol</label>
        <select
          className="w-full px-3 py-2 border rounded-lg"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Rol seçin</option>
          {allRoles.map((role) => (
            <option key={role.id} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        onClick={handleAddUser}
      >
        Əlavə et
      </button>
    </div>
  );
};

export default AddNewUser;
