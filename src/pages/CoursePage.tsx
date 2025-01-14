import React, { useEffect, useState } from 'react';
import { get, post, put, del } from '../api/service';
import { FaRegEdit } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import Modal from 'react-modal';
import AddCourseModal from '../components/Modals/Course/AddCourseModal';
import EditCourseModal from '../components/Modals/Course/CourseEditModal';
import DeleteCourseModal from '../components/Modals/Course/CourseDeleteModal';
import { ClipLoader } from 'react-spinners';
import '../components/Modals/Modal.css';
import { PiEyeLight } from 'react-icons/pi';

Modal.setAppElement('#root'); // Modalın accessibility üçün kök elementi təyin edin

const CoursePage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isDeleteCourseModalOpen, setIsDeleteCourseModalOpen] = useState(false);
  const [isSpecialitiesModalOpen, setIsSpecialitiesModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await get('/api/course');
      const courseData = Object.values(response.data.courses);
      setCourses(courseData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddCourseModal = () => {
    setIsAddCourseModalOpen(true);
  };

  const closeAddCourseModal = () => {
    setIsAddCourseModalOpen(false);
  };

  const openEditCourseModal = (course: any) => {
    setSelectedCourse(course);
    setIsEditCourseModalOpen(true);
  };

  const closeEditCourseModal = () => {
    setIsEditCourseModalOpen(false);
    setSelectedCourse(null);
    fetchCourses(); // Kursları yenidən yüklə
  };

  const openDeleteCourseModal = (course: any) => {
    setSelectedCourse(course);
    setIsDeleteCourseModalOpen(true);
  };

  const closeDeleteCourseModal = () => {
    setIsDeleteCourseModalOpen(false);
    setSelectedCourse(null);
    fetchCourses(); // Kursları yenidən yüklə
  };

  const openSpecialitiesModal = (course: any) => {
    setSelectedCourse(course);
    setIsSpecialitiesModalOpen(true);
  };

  const closeSpecialitiesModal = () => {
    setIsSpecialitiesModalOpen(false);
    setSelectedCourse(null);
  };

  const handleSaveCourse = async (name: string, specialityIds: number[]) => {
    try {
      const newCourse = { name, specialty_id: specialityIds };
      await post('/api/course', newCourse);
      closeAddCourseModal();
      fetchCourses(); // Kursları yenidən yüklə
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleEditCourse = async (
    id: number,
    name: string,
    specialityIds: number[],
  ) => {
    try {
      const updatedCourse = { name, specialty_id: specialityIds };
      await put(`/api/course/${id}`, updatedCourse);
      closeEditCourseModal();
      fetchCourses(); // Kursları yenidən yüklə
    } catch (error) {
      console.error('Error editing course:', error);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    try {
      await del(`/api/course/${id}`);
      closeDeleteCourseModal();
      fetchCourses(); // Kursları yenidən yüklə
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">Kurslar</h2>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        onClick={openAddCourseModal}
      >
        Yeni Kurs Əlavə Et
      </button>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <ClipLoader size={50} color={'#123abc'} loading={isLoading} />
        </div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="py-2 px-4 border-b">Ad</th>
              <th className="py-2 px-4 border-b">İxtisaslar</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr
                key={course.id}
                className="hover:bg-gray-100 dark:bg-gray-700"
              >
                <td className="py-2 px-4 border-b text-center">
                  {course.name}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    className="<PiEyeLight /> text-yellow-600 text-lg  px-4 py-2 rounded-lg"
                    onClick={() => openSpecialitiesModal(course)}
                  >
                    <PiEyeLight />
                  </button>
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    className="bg-blue-500 text-white p-2 rounded-lg mr-2"
                    onClick={() => openEditCourseModal(course)}
                  >
                    <FaRegEdit className="w-3 md:w-5 h-3 md:h-5" />
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-lg"
                    onClick={() => openDeleteCourseModal(course)}
                  >
                    <AiOutlineDelete className="w-3 md:w-5 h-3 md:h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <AddCourseModal
        isOpen={isAddCourseModalOpen}
        onClose={closeAddCourseModal}
        onSave={handleSaveCourse}
      />

      <EditCourseModal
        isOpen={isEditCourseModalOpen}
        onClose={closeEditCourseModal}
        onSave={handleEditCourse}
        course={selectedCourse}
      />

      <DeleteCourseModal
        isOpen={isDeleteCourseModalOpen}
        onClose={closeDeleteCourseModal}
        onConfirm={handleDeleteCourse}
        course={selectedCourse}
      />

      <Modal
        isOpen={isSpecialitiesModalOpen}
        onRequestClose={closeSpecialitiesModal}
        contentLabel="İxtisaslar"
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="text-2xl font-bold mb-4">İxtisaslar</h2>
        {selectedCourse && (
          <ul>
            {Array.isArray(selectedCourse.specialities)
              ? selectedCourse.specialities.map((speciality, index) => (
                  <li key={index} className="mb-2">
                    {speciality}
                  </li>
                ))
              : Object.values(selectedCourse.specialities).map(
                  (speciality, index) => (
                    <li key={index} className="mb-2">
                      {speciality}
                    </li>
                  ),
                )}
          </ul>
        )}
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={closeSpecialitiesModal}
        >
          Bağla
        </button>
      </Modal>
    </div>
  );
};

export default CoursePage;
