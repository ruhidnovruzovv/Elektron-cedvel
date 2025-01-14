import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get } from '../api/service';

interface User {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  duty: string;
  employee_type: string;
  faculty_id: number;
  department_id: number;
  email: string;
  roles: string[];
}

interface Faculty {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

const UserViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [facultyName, setFacultyName] = useState<string>('');
  const [departmentName, setDepartmentName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await get(`/api/users/${id}`);
        const userData = response.data.userData;
        setUser(userData);

        const facultyResponse = await get(
          `/api/faculty/${userData.faculty_id}`,
        );
        setFacultyName(facultyResponse.data.name);

        const departmentResponse = await get(
          `/api/department/${userData.department_id}`,
        );
        setDepartmentName(departmentResponse.data.name);
      } catch (err: any) {
        console.error('Error fetching user:', err);
        setError(err.message || 'An error occurred');
      }
    };

    fetchUser();
  }, [id]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <h2 className="text-3xl font-bold mb-8">İstifadəçi Məlumatları</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Şəxsi Məlumatlar</h3>
          <div className="space-y-2">
            <p>
              <strong>Ad:</strong> {user.name}
            </p>
            <p>
              <strong>Soyad:</strong> {user.surname}
            </p>
            <p>
              <strong>Ata adı:</strong> {user.patronymic}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Rollar:</strong> {user.roles.join(', ')}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">İş Məlumatları</h3>
          <div className="space-y-2">
            <p>
              <strong>Vəzifə:</strong> {user.duty}
            </p>
            <p>
              <strong>İşçi növü:</strong> {user.employee_type}
            </p>
            <p>
              <strong>Fakültə:</strong> {facultyName}
            </p>
            <p>
              <strong>Kafedra:</strong> {departmentName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserViewPage;
