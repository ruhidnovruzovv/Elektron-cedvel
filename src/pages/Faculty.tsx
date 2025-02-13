import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post, put, del } from '../api/service';
import AddFacultyModal from '../components/Modals/Faculty/AddFacultyModal';
import DeleteFacultyModal from '../components/Modals/Faculty/DeleteFacultyModal';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';
import { PiEyeLight } from 'react-icons/pi';
import Breadcrumb from './../components/Breadcrumbs/Breadcrumb';
import usePermissions from '../hooks/usePermissions';
import Swal from 'sweetalert2';

interface Faculty {
  id: number;
  name: string;
  departments: Department[];
}

interface Department {
  id: number;
  name: string;
  faculty_id: number;
}

const FacultyPage: React.FC = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [editFacultyId, setEditFacultyId] = useState<number | null>(null);
  const [editFacultyName, setEditFacultyName] = useState('');
  const [facultyToDelete, setFacultyToDelete] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const hasAddPermission = usePermissions('add_faculty');
  const hasEditPermission = usePermissions('edit_faculty');
  const hasDeletePermission = usePermissions('delete_faculty');
  const hasViewPermission = usePermissions('view_faculty');

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await get('/api/faculties');
      setFaculties(response.data);
    } catch (err: any) {
      console.error('Error fetching faculties:', err);
      setError(err.message || 'An error occurred');
    }
  };

  const handleAddFaculty = async (name: string) => {
    try {
      await post('/api/faculties', { name });
      setIsAddModalOpen(false);
      fetchFaculties();
    } catch (err: any) {
      console.error('Error adding faculty:', err);
      setError(err.message || 'An error occurred');
    }
  };

  const handleEditFaculty = async () => {
    if (editFacultyId !== null) {
      try {
        await put(`/api/faculties/${editFacultyId}`, { name: editFacultyName });
        setEditFacultyId(null);
        setEditFacultyName('');
        fetchFaculties();
      } catch (err: any) {
        console.error('Error editing faculty:', err);
        setError(err.message || 'An error occurred');
      }
    }
  };

  const handleDeleteFaculty = async () => {
    if (facultyToDelete !== null) {
      try {
        const response = await del(`/api/faculties/${facultyToDelete}`);
        setFacultyToDelete(null);
        setIsDeleteModalOpen(false);
        fetchFaculties();
        Swal.fire({
          title: 'Silindi!',
          text: 'Fakültə uğurla silindi.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } catch (err: any) {
        console.error('Error deleting faculty:', err);
        setError(err.message || 'An error occurred');
        Swal.fire({
          title: 'Xəta!',
          text: err.response?.data?.message || 'Fakültəni silərkən xəta baş verdi.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  return (
    <div className="">
      <Breadcrumb pageName="Fakültələr" />
      {hasAddPermission && (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
          onClick={() => setIsAddModalOpen(true)}
        >
          Yeni Fakültə Əlavə Et
        </button>
      )}
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-[#e3e3e3] dark:bg-gray-800">
            <th className="py-2 px-4 border-b">Fakültə</th>
            <th className="py-2 px-4 border-b">Kafedralar</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculties.map((faculty) => (
            <tr
              key={faculty.id}
              className="hover:bg-gray-100 dark:bg-gray-700 transition-all duration-300 ease-linear"
            >
              <td className="py-2 px-4 border-b text-center">
                {editFacultyId === faculty.id ? (
                  <input
                    type="text"
                    value={editFacultyName}
                    onChange={(e) => setEditFacultyName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                ) : (
                  faculty.name
                )}
              </td>

              <td className="py-2 px-4 border-b text-center">
                {faculty.departments
                  .slice(0, 2)
                  .map((department) => department.name)
                  .join(', ')}
                {faculty.departments.length > 2 && '...'}
              </td>

              <td className="py-2 px-4 border-b text-center">
                {editFacultyId === faculty.id ? (
                  <button
                    className="bg-blue-500 text-white p-2 rounded-lg mr-2"
                    onClick={handleEditFaculty}
                  >
                    Yenilə
                  </button>
                ) : (
                  <>
                    {hasEditPermission && (
                      <button
                        className="bg-blue-500 text-white p-2 rounded-lg mr-2"
                        onClick={() => {
                          setEditFacultyId(faculty.id);
                          setEditFacultyName(faculty.name);
                        }}
                      >
                        <FaRegEdit className="w-3 md:w-5 h-3 md:h-5" />
                      </button>
                    )}
                    {hasDeletePermission && (
                      <button
                        className="bg-red-500 text-white p-2 rounded-lg mr-2"
                        onClick={() => {
                          setFacultyToDelete(faculty.id);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <AiOutlineDelete className="w-3 md:w-5 h-3 md:h-5" />
                      </button>
                    )}
                    {hasViewPermission && (
                      <button
                        className="bg-[#d29a00] text-white p-2 rounded-lg mr-2"
                        onClick={() => navigate(`/faculty/${faculty.id}`)}
                      >
                        <PiEyeLight className="w-3 md:w-5 h-3 md:h-5" />
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddFacultyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddFaculty}
      />

      <DeleteFacultyModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteFaculty}
      />
    </div>
  );
};

export default FacultyPage;