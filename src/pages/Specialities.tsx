import React, { useEffect, useState } from 'react';
import { get, post, put, del } from '../api/service';
import AddSpecialityModal from '../components/Modals/Speciality/AddSpeciality.Modal';
import DeleteSpecialityModal from '../components/Modals/Speciality/DeleteSpecialityModal';
import { FaRegEdit } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { PiEyeLight } from 'react-icons/pi';

interface Speciality {
  id: number;
  name: string;
  faculty_id: number;
}

interface Faculty {
  id: number;
  name: string;
}

const Specialities: React.FC = () => {
  const navigate = useNavigate();
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [newSpecialityName, setNewSpecialityName] = useState<string>('');
  const [newSpecialityFacultyId, setNewSpecialityFacultyId] = useState<
    number | null
  >(null);
  const [editSpecialityId, setEditSpecialityId] = useState<number | null>(null);
  const [editSpecialityName, setEditSpecialityName] = useState<string>('');
  const [editSpecialityFacultyId, setEditSpecialityFacultyId] = useState<
    number | null
  >(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [specialityToDelete, setSpecialityToDelete] = useState<number | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const fetchSpecialities = async () => {
    try {
      const response = await get('/api/specialities');
      setSpecialities(response.data);
    } catch (err: any) {
      console.error('Error fetching specialities:', err);
      setError(err.message || 'An error occurred');
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await get('/api/faculties');
      setFaculties(response.data);
    } catch (err: any) {
      console.error('Error fetching faculties:', err);
      setError(err.message || 'An error occurred');
    }
  };

  useEffect(() => {
    fetchSpecialities();
    fetchFaculties();
  }, []);

  const handleAddSpeciality = async (name: string, facultyId: number) => {
    try {
      await post('/api/specialities', { name, faculty_id: facultyId });
      setIsAddModalOpen(false);
      fetchSpecialities();
    } catch (err: any) {
      console.error('Error adding speciality:', err);
      setError(err.message || 'An error occurred');
    }
  };

  const handleEditSpeciality = async () => {
    if (editSpecialityId !== null && editSpecialityFacultyId !== null) {
      try {
        await put(`/api/specialities/${editSpecialityId}`, {
          name: editSpecialityName,
          faculty_id: editSpecialityFacultyId,
        });
        setEditSpecialityId(null);
        setEditSpecialityName('');
        setEditSpecialityFacultyId(null);
        fetchSpecialities(); // Uzmanlıkları yeniden fetch ederek bileşeni güncelle
      } catch (err: any) {
        console.error('Error editing speciality:', err);
        setError(err.message || 'An error occurred');
      }
    }
  };

  const handleDeleteSpeciality = async () => {
    if (specialityToDelete !== null) {
      try {
        await del(`/api/specialities/${specialityToDelete}`);
        setSpecialities(
          specialities.filter(
            (speciality) => speciality.id !== specialityToDelete,
          ),
        );
        setSpecialityToDelete(null);
        setIsDeleteModalOpen(false);
      } catch (err: any) {
        console.error('Error deleting speciality:', err);
        setError(err.message || 'An error occurred');
      }
    }
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">İxtisas</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
        onClick={() => setIsAddModalOpen(true)}
      >
        Yeni İxtisas Əlavə Et
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white">
          <thead>
            <tr className="bg-gray-200  dark:bg-gray-800">
              <th className="py-2 px-4 border-b">İxtisas</th>
              <th className="py-2 px-4 border-b">Fakültə</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {specialities.map((speciality) => (
              <tr
                key={speciality.id}
                className="hover:bg-gray-100  dark:bg-gray-700 transition-all duration-300 ease-linear"
              >
                <td className="py-2 px-4 border-b text-center">
                  {editSpecialityId === speciality.id ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={editSpecialityName}
                      onChange={(e) => setEditSpecialityName(e.target.value)}
                    />
                  ) : (
                    speciality.name
                  )}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {editSpecialityId === speciality.id ? (
                    <select
                      className="w-full px-3 py-2 border rounded-lg"
                      value={editSpecialityFacultyId || ''}
                      onChange={(e) =>
                        setEditSpecialityFacultyId(Number(e.target.value))
                      }
                    >
                      <option value="">Fakültə seçin</option>
                      {faculties.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    faculties.find(
                      (faculty) => faculty.id === speciality.faculty_id,
                    )?.name
                  )}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {editSpecialityId === speciality.id ? (
                    <button
                    className="bg-blue-500 text-white p-2 rounded-lg mr-2"
                      onClick={handleEditSpeciality}
                    >
                      Yenilə
                    </button>
                  ) : (
                    <div >
                      <button
                    className="bg-blue-500 text-white p-2 rounded-lg mr-2"
                    onClick={() => {
                          setEditSpecialityId(speciality.id);
                          setEditSpecialityName(speciality.name);
                          setEditSpecialityFacultyId(speciality.faculty_id);
                        }}
                      >
                      <FaRegEdit className="w-3 md:w-5 h-3 md:h-5" />
                      </button>

                      <button
                  className="bg-red-500 text-white p-2 w-fit mr-2 rounded-lg"
                  onClick={() => {
                          setSpecialityToDelete(speciality.id);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <AiOutlineDelete className="w-3 md:w-5 h-3 md:h-5" />
                      </button>
                      <button
                        className="bg-[#d29a00] text-white p-2 rounded-lg"
                        onClick={() => navigate(`/specialities/${speciality.id}`)}
                      >
                        <PiEyeLight className="w-3 md:w-5 h-3 md:h-5" />
                      </button>
                    </div>
                  )}{' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddSpecialityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddSpeciality}
      />

      <DeleteSpecialityModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSpeciality}
      />
    </div>
  );
};

export default Specialities;
