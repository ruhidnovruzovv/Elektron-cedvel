import React, { useEffect, useState } from 'react';
import { get, post, put, del } from '../api/service';
import AddLessonModal from '../components/Modals/Lesson/AddLesson';
import EditLessonModal from '../components/Modals/Lesson/EditLesson';
import DeleteLessonModal from '../components/Modals/Lesson/DeleteLesson';
import ClipLoader from 'react-spinners/ClipLoader';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';

interface Lesson {
  id: number;
  name: string;
  department: {
    id: number;
    name: string;
  };
}

const Lessons: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
  const [isEditLessonModalOpen, setIsEditLessonModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await get('/api/lesson');
      setLessons(response.data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsEditLessonModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedLesson) {
      try {
        await del(`/api/lesson/${selectedLesson.id}`);
        setLessons(lessons.filter((l) => l.id !== selectedLesson.id));
        closeDeleteModal();
      } catch (error) {
        console.error('Error deleting lesson:', error);
      }
    }
  };

  const openDeleteModal = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedLesson(null);
    setIsDeleteModalOpen(false);
  };

  const openAddLessonModal = () => {
    setSelectedLesson(null);
    setIsAddLessonModalOpen(true);
  };

  const closeAddLessonModal = () => {
    setSelectedLesson(null);
    setIsAddLessonModalOpen(false);
  };

  const closeEditLessonModal = () => {
    setSelectedLesson(null);
    setIsEditLessonModalOpen(false);
  };

  const handleSaveLesson = async (name: string, department_name: string) => {
    try {
      if (selectedLesson) {
        await put(`/api/lesson/${selectedLesson.id}`, {
          name,
          department_name,
        });
        setLessons(
          lessons.map((l) =>
            l.id === selectedLesson.id
              ? {
                  ...l,
                  name,
                  department: { ...l.department, name: department_name },
                }
              : l,
          ),
        );
      } else {
        const response = await post('/api/lesson', { name, department_name });
        setLessons([...lessons, response.data]);
      }
      closeAddLessonModal();
      closeEditLessonModal();
      fetchLessons();
    } catch (error) {
      console.error('Error saving lesson:', error);
    }
  };

  return (
    <div className="">
      <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Dərslər</h2>
      <button
        className="bg-green-500 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg mb-4"
        onClick={openAddLessonModal}
      >
        Yeni Dərs Əlavə Et
      </button>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center">
            <ClipLoader size={50} color={'#123abc'} loading={loading} />
          </div>
        ) : (
          <table className="min-w-full bg-white text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800">
                <th className="py-2 px-2 md:py-2 md:px-4 border-b">Ad</th>
                <th className="py-2 px-2 md:py-2 md:px-4 border-b">Kafedra</th>
                <th className="py-2 px-2 md:py-2 md:px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr
                  key={lesson.id}
                  className="hover:bg-gray-100 dark:bg-gray-700"
                >
                  <td className="py-2 px-2 md:py-2 md:px-4 border-b text-center">
                    {lesson.name}
                  </td>
                  <td className="py-2 px-2 md:py-2 md:px-4 border-b text-center">
                    {lesson.department.name}
                  </td>
                  <td className="py-2  px-2 border-b text-center">
                    <div>
                      <button
                        className="bg-blue-500 text-white p-2 rounded-lg mr-2"
                        onClick={() => handleEdit(lesson)}
                      >
                        <FaRegEdit className="w-3 md:w-5 h-3 md:h-5" />
                      </button>
                      <button
                        className="bg-red-500 text-white p-2 rounded-lg"
                        onClick={() => openDeleteModal(lesson)}
                      >
                        <AiOutlineDelete className="w-3 md:w-5 h-3 md:h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <DeleteLessonModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />

      <AddLessonModal
        isOpen={isAddLessonModalOpen}
        onClose={closeAddLessonModal}
        onSave={handleSaveLesson}
      />

      {selectedLesson && (
        <EditLessonModal
          isOpen={isEditLessonModalOpen}
          onClose={closeEditLessonModal}
          onSave={handleSaveLesson}
          initialData={{
            id: selectedLesson.id,
            name: selectedLesson.name,
            department_name: selectedLesson.department.name,
          }}
        />
      )}
    </div>
  );
};

export default Lessons;