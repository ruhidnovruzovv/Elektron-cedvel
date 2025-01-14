import React, { useEffect, useState } from 'react';
import { get, del } from '../api/service';
import AddGroupModal from '../components/Modals/Group/AddGroup';
import EditGroupModal from '../components/Modals/Group/EditGroup';
import DeleteGroupModal from '../components/Modals/Group/DeleteGroup';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';

interface Group {
  id: number;
  name: string;
  student_amount: number;
  group_type_label: string;
  group_level_label: string;
  faculty_name: string;
  speciality_name: string;
  course_name: string;
}

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await get('/api/group');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setIsEditGroupModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedGroup) {
      try {
        await del(`/api/group/${selectedGroup.id}`);
        setGroups(groups.filter((group) => group.id !== selectedGroup.id));
        closeDeleteModal();
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  const openDeleteModal = (group: Group) => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedGroup(null);
    setIsDeleteModalOpen(false);
  };

  const openAddGroupModal = () => {
    setSelectedGroup(null);
    setIsAddGroupModalOpen(true);
  };

  const closeAddGroupModal = () => {
    setSelectedGroup(null);
    setIsAddGroupModalOpen(false);
  };

  const closeEditGroupModal = () => {
    setSelectedGroup(null);
    setIsEditGroupModalOpen(false);
  };

  const handleSaveGroup = () => {
    fetchGroups(); // Yeni grup eklendikten veya güncellendikten sonra tabloyu yenile
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">Qruplar</h2>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
        onClick={openAddGroupModal}
      >
        Yeni Qrup Əlavə Et
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200  dark:bg-gray-800">
              <th className="py-2 px-4 border-b">Ad</th>
              <th className="py-2 px-4 border-b">Tələbə Sayı</th>
              <th className="py-2 px-4 border-b">Qrup Tipi</th>
              <th className="py-2 px-4 border-b">Qrup Səviyyəsi</th>
              <th className="py-2 px-4 border-b">Fakültə</th>
              <th className="py-2 px-4 border-b">İxtisas</th>
              <th className="py-2 px-4 border-b">Kurs</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr
                key={group.id}
                className="hover:bg-gray-100  dark:bg-gray-700"
              >
                <td className="py-2 px-4 border-b text-center">{group.name}</td>
                <td className="py-2 px-4 border-b text-center">
                  {group.student_amount}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {group.group_type_label}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {group.group_level_label}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {group.faculty_name}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {group.speciality_name}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {group.course_name}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 items-center md:justify-center gap-2">
                    <button
                      className="bg-blue-500 text-white p-2 rounded-lg mr-2"
                      onClick={() => handleEdit(group)}
                    >
                      <FaRegEdit className="w-3 md:w-5 h-3 md:h-5" />
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded-lg"
                      onClick={() => openDeleteModal(group)}
                    >
                      <AiOutlineDelete className="w-3 md:w-5 h-3 md:h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteGroupModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />

      <AddGroupModal
        isOpen={isAddGroupModalOpen}
        onClose={closeAddGroupModal}
        onSave={handleSaveGroup}
      />

      {selectedGroup && (
        <EditGroupModal
          isOpen={isEditGroupModalOpen}
          onClose={closeEditGroupModal}
          onSave={handleSaveGroup}
          initialData={{
            id: selectedGroup.id,
            name: selectedGroup.name,
            studentAmount: selectedGroup.student_amount,
            groupType: selectedGroup.group_type_label,
            groupLevel: selectedGroup.group_level_label,
            faculty: selectedGroup.faculty_name,
            course: selectedGroup.course_name,
            speciality: selectedGroup.speciality_name,
          }}
        />
      )}
    </div>
  );
};

export default Groups;
