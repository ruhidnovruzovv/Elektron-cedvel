import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, put } from '../api/service';
import usePermissions from '../hooks/usePermissions';

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

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [duty, setDuty] = useState('');
  const [employeeType, setEmployeeType] = useState('');
  const [facultyId, setFacultyId] = useState<number | null>(null);
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const hasEditPermission = usePermissions('user_edit');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await get(`/api/users/${id}`);
        const userData = response.data.userData; 
        setName(userData.name || '');
        setSurname(userData.surname || '');
        setPatronymic(userData.patronymic || '');
        setDuty(userData.duty || '');
        setEmployeeType(userData.employee_type || '');
        setFacultyId(userData.faculty_id || null);
        setDepartmentId(userData.department_id || null);
        setEmail(userData.email || '');
        setRole(
          userData.roles && userData.roles.length > 0 ? userData.roles[0] : '',
        ); // İlk rolü al
      } catch (err: any) {
        console.error('Error fetching user:', err);
        setError(err.message || 'An error occurred');
      }
    };

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

    fetchUser();
    fetchFaculties();
    fetchDepartments();
    fetchRoles();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await put(`/api/users/${id}`, {
        name,
        surname,
        patronymic,
        duty,
        employee_type: employeeType,
        faculty_id: facultyId,
        department_id: departmentId,
        email,
        roles: [role],
      });
      navigate('/users');
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'An error occurred');
    }
  };

  if (!hasEditPermission) {
    return <div>İcazəniz yoxdur</div>;
  }

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">İstifadəçini Redaktə Et</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
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
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="surname"
            className="block text-sm font-medium text-gray-700"
          >
            Soyad
          </label>
          <input
            id="surname"
            name="surname"
            type="text"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="patronymic"
            className="block text-sm font-medium text-gray-700"
          >
            Ata adı
          </label>
          <input
            id="patronymic"
            name="patronymic"
            type="text"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={patronymic}
            onChange={(e) => setPatronymic(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="duty"
            className="block text-sm font-medium text-gray-700"
          >
            Vəzifə
          </label>
          <input
            id="duty"
            name="duty"
            type="text"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={duty}
            onChange={(e) => setDuty(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="employeeType"
            className="block text-sm font-medium text-gray-700"
          >
            İşçi növü
          </label>
          <input
            id="employeeType"
            name="employeeType"
            type="text"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={employeeType}
            onChange={(e) => setEmployeeType(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="facultyId"
            className="block text-sm font-medium text-gray-700"
          >
            Fakültə
          </label>
          <select
            id="facultyId"
            name="facultyId"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={facultyId || ''}
            onChange={(e) => setFacultyId(Number(e.target.value))}
          >
            <option value="">Fakültə seçin</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="departmentId"
            className="block text-sm font-medium text-gray-700"
          >
            Kafedra
          </label>
          <select
            id="departmentId"
            name="departmentId"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={departmentId || ''}
            onChange={(e) => setDepartmentId(Number(e.target.value))}
          >
            <option value="">Kafedra seçin</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Rol
          </label>
          <select
            id="role"
            name="role"
            required
            className="w-full px-3 py-2 border rounded-lg"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Rol seçin</option>
            {allRoles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Yenilə
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
