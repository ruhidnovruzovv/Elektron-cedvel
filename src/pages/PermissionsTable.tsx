import React, { useEffect, useState } from 'react';
import { get, post, put, del } from '../api/service';
import AddPermissionModal from '../components/Modals/Permissions/AddPermission';
import EditPermissionModal from '../components/Modals/Permissions/EditPermissionModal';
import DeleteModal from '../components/Modals/Permissions/DeletePermissions';
import usePermissions from '../hooks/usePermissions';
import { AiOutlineDelete } from 'react-icons/ai';
import { PiEyeLight } from 'react-icons/pi';

interface Permission {
  id: number;
  name: string;
}

const PermissionsTable: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasAddPermission = usePermissions('permission_add');
  const hasEditPermission = usePermissions('permission_edit');
  const hasDeletePermission = usePermissions('permission_delete');

  const fetchPermissions = async () => {
    try {
      const response = await get('/api/permissions');
      setPermissions(response.data);
    } catch (err: any) {
      console.error('Error fetching permissions:', err);
      setError(err.message || 'An error occurred');
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleAddPermission = async (name: string) => {
    try {
      await post('/api/permissions', { name });
      setIsAddModalOpen(false);
      fetchPermissions();
    } catch (err: any) {
      console.error('Error adding permission:', err);
      setError(err.message || 'An error occurred');
    }
  };

  const handleEditPermission = async (id: number, name: string) => {
    try {
      await put(`/api/permissions/${id}`, { name });
      setIsEditModalOpen(false);
      fetchPermissions();
    } catch (err: any) {
      console.error('Error editing permission:', err);
      setError(err.message || 'An error occurred');
    }
  };

  const handleDeletePermission = async () => {
    if (selectedPermission) {
      try {
        await del(`/api/permissions/${selectedPermission.id}`);
        setPermissions(
          permissions.filter(
            (permission) => permission.id !== selectedPermission.id,
          ),
        );
        setIsDeleteModalOpen(false);
        fetchPermissions();
      } catch (err: any) {
        console.error('Error deleting permission:', err);
        setError(err.message || 'An error occurred');
      }
    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const openEditModal = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">İcazələr</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {hasAddPermission && (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
          onClick={openAddModal}
        >
          Yeni İcazə Əlavə Et
        </button>
      )}
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-[#e3e3e3]  dark:bg-gray-800">
            <th className="py-2 px-4 border-b">İcazə</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => (
            <tr
              key={permission.id}
              className="hover:bg-gray-100  dark:bg-gray-700 transition-all duration-300 ease-linear"
            >
              <td className="py-2 px-4 border-b text-center">
                {permission.name}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {hasEditPermission && (
                  <button
                  className="bg-blue-500 text-white p-2 rounded-lg mr-2"

                    onClick={() => openEditModal(permission)}
                  >
                    <PiEyeLight className="w-3 md:w-5 h-3 md:h-5" />
                  </button>
                )}
                {hasDeletePermission && (
                  <button
                    className="bg-red-500 text-white p-2 rounded-lg"
                    onClick={() => openDeleteModal(permission)}
                  >
                    <AiOutlineDelete className="w-3 md:w-5 h-3 md:h-5" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddPermissionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddPermission}
      />

      {selectedPermission && (
        <EditPermissionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onConfirm={handleEditPermission}
          initialData={selectedPermission}
        />
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePermission}
      />
    </div>
  );
};

export default PermissionsTable;
