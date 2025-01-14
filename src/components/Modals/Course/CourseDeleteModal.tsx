import React from 'react';

interface DeleteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  course: { id: number; name: string };
}

const DeleteCourseModal: React.FC<DeleteCourseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  course,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(course.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Silmek istediyinizden emin misiniz?
        </h2>
        <p className="mb-4">Kurs: {course.name}</p>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
            onClick={onClose}
          >
            İptal
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded-lg"
            onClick={handleConfirm}
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCourseModal;
