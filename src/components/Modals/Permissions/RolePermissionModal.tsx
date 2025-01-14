import React from 'react';

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  role,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{role.name} İcazələri</h2>
        <ul className="list-disc list-inside">
          {role.permissions.map((permission) => (
            <li key={permission.id}>{permission.name}</li>
          ))}
        </ul>
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Bağla
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;
