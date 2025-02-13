import React, { useEffect, useState } from 'react';
import { get, post, put, del } from '../api/service';
import ClipLoader from 'react-spinners/ClipLoader';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';
import { PiEyeLight } from 'react-icons/pi';
import DeleteDepartmentModal from './../components/Modals/Department/DeleteDepartmentModal';
import AddDepartmentModal from './../components/Modals/Department/AddDepartmentModal';
import EditDepartmentModal from './../components/Modals/Department/EditDepartment';
import { useNavigate } from 'react-router-dom';
import usePermissions from '../hooks/usePermissions';
import Swal from 'sweetalert2';


interface Discipline {
  id: number;
  name: string;
}

interface Faculty {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  faculty_id: number;
  created_at: string;
  updated_at: string;
  status: number;
  faculty: Faculty;
  disciplines: Discipline[];
}

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] =
    useState(false);
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const hasAddPermission = usePermissions('add_department');
  const hasEditPermission = usePermissions('edit_department');
  const hasDeletePermission = usePermissions('delete_department');
  const hasViewPermission = usePermissions('view_department');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await get('/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditDepartmentModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedDepartment) {
      try {
        await del(`/api/departments/${selectedDepartment.id}`);
        setDepartments(
          departments.filter((d) => d.id !== selectedDepartment.id),
        );
        closeDeleteModal();
        Swal.fire({
          title: 'Silindi!',
          text: 'Kafedra uğurla silindi.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } catch (error) {
        console.error('Error deleting department:', error);
        Swal.fire({
          title: 'Xəta!',
          text: error.response?.data?.message || 'Fakültəni silərkən xəta baş verdi.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const openDeleteModal = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedDepartment(null);
    setIsDeleteModalOpen(false);
  };

  const openAddDepartmentModal = () => {
    setSelectedDepartment(null);
    setIsAddDepartmentModalOpen(true);
  };

  const closeAddDepartmentModal = () => {
    setSelectedDepartment(null);
    setIsAddDepartmentModalOpen(false);
  };

  const closeEditDepartmentModal = () => {
    setSelectedDepartment(null);
    setIsEditDepartmentModalOpen(false);
  };

  const handleSaveDepartment = async (
    id: number,
    name: string,
    facultyId: number,
  ) => {
    try {
      const payload = {
        name: name.toString(),
        faculty_id: facultyId,
      };

      if (selectedDepartment) {
        // Update existing department
        await put(`/api/departments/${id}`, payload);
        setDepartments(
          departments.map((d) =>
            d.id === id ? { ...d, name, faculty_id: facultyId } : d,
          ),
        );
      } else {
        // Create new department
        const response = await post('/api/departments', payload);
        setDepartments([...departments, response.data]);
      }
      closeAddDepartmentModal();
      closeEditDepartmentModal();
      fetchDepartments(); // Refresh departments after saving
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const toDetailsPage = (department: Department) => {
    navigate(`/departments/${department.id}`);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">Kafedralar</h2>
      {hasAddPermission && (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
          onClick={openAddDepartmentModal}
        >
          Yeni Kafedra Əlavə Et
        </button>
      )}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center">
            <ClipLoader size={50} color={'#123abc'} loading={loading} />
          </div>
        ) : (
          <table className="min-w-full bg-white text-sm">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800">
                <th className="py-2 px-4 border-b">Ad</th>
                <th className="py-2 px-4 border-b">Fakültə</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr
                  key={department.id}
                  className="hover:bg-gray-100 dark:bg-gray-700"
                >
                  <td className="py-2 px-4 border-b text-center">
                    {department.name}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {department.faculty.name ? (
                      <>
                        {department.faculty.name}
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex flex-col items-center md:flex-row md:justify-center gap-2">
                      {hasEditPermission && (
                        <button
                          className="bg-blue-500 text-white p-2 rounded-lg mr-2"
                          onClick={() => handleEdit(department)}
                        >
                          <FaRegEdit className="w-3 md:w-5 h-3 md:h-5" />
                        </button>
                      )}
                      {hasDeletePermission && (
                        <button
                          className="bg-red-500 text-white p-2 rounded-lg"
                          onClick={() => openDeleteModal(department)}
                        >
                          <AiOutlineDelete className="w-3 md:w-5 h-3 md:h-5" />
                        </button>
                      )}
                      {hasViewPermission && (
                        <button
                          className="bg-[#d29a00] text-white p-2 rounded-lg"
                          onClick={() => toDetailsPage(department)}
                        >
                          <PiEyeLight className="w-3 md:w-5 h-3 md:h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <DeleteDepartmentModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />

      <AddDepartmentModal
        isOpen={isAddDepartmentModalOpen}
        onClose={closeAddDepartmentModal}
        onConfirm={(name, facultyId) =>
          handleSaveDepartment(0, name, facultyId)
        }
      />

      {selectedDepartment && (
        <EditDepartmentModal
          isOpen={isEditDepartmentModalOpen}
          onClose={closeEditDepartmentModal}
          onConfirm={handleSaveDepartment}
          initialData={{
            id: selectedDepartment.id,
            name: selectedDepartment.name,
            facultyId: selectedDepartment.faculty_id,
          }}
        />
      )}
    </div>
  );
};

export default Departments;