import React, { useEffect, useState } from 'react';
import { get, post, put, del } from '../api/service';
import AddRoomModal from '../components/Modals/Room/AddRoom';
import EditRoomModal from '../components/Modals/Room/EditRoom';
import DeleteRoomModal from '../components/Modals/Room/DeleteRoom';
import ClipLoader from 'react-spinners/ClipLoader';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';

interface Room {
  id: number;
  name: string;
  room_capacity: number;
  department: {
    id: number;
    name: string;
  };
  room_type: {
    id: number;
    name: string;
  };
  corps: {
    id: number;
    name: string;
  };
}

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await get('/api/room');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setIsEditRoomModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedRoom) {
      try {
        await del(`/api/room/${selectedRoom.id}`);
        setRooms(rooms.filter((r) => r.id !== selectedRoom.id));
        closeDeleteModal();
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const openDeleteModal = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedRoom(null);
    setIsDeleteModalOpen(false);
  };

  const openAddRoomModal = () => {
    setSelectedRoom(null);
    setIsAddRoomModalOpen(true);
  };

  const closeAddRoomModal = () => {
    setSelectedRoom(null);
    setIsAddRoomModalOpen(false);
  };

  const closeEditRoomModal = () => {
    setSelectedRoom(null);
    setIsEditRoomModalOpen(false);
  };

  const handleSaveRoom = async (
    name: string,
    room_capacity: number,
    department_name: string,
    room_type_name: string,
    corps_name: string,
  ) => {
    try {
      if (selectedRoom) {
        await put(`/api/room/${selectedRoom.id}`, {
          name,
          room_capacity,
          department_name,
          room_type_name,
          corps_name,
        });
        setRooms(
          rooms.map((r) =>
            r.id === selectedRoom.id
              ? {
                  ...r,
                  name,
                  room_capacity,
                  department: { ...r.department, name: department_name },
                  room_type: { ...r.room_type, name: room_type_name },
                  corps: { ...r.corps, name: corps_name },
                }
              : r,
          ),
        );
      } else {
        const response = await post('/api/room', {
          name,
          room_capacity,
          department_name,
          room_type_name,
          corps_name,
        });
        setRooms([...rooms, response.data]);
      }
      closeAddRoomModal();
      closeEditRoomModal();
      fetchRooms(); // Yeni oda eklendikten sonra tabloyu yenile
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">Otaqlar</h2>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
        onClick={openAddRoomModal}
      >
        Yeni Otaq Əlavə Et
      </button>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center">
            <ClipLoader size={50} color={'#123abc'} loading={loading} />
          </div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800">
                <th className="py-2 px-4 border-b">Ad</th>
                <th className="py-2 px-4 border-b">Tutum</th>
                <th className="py-2 px-4 border-b">Kafedra</th>
                <th className="py-2 px-4 border-b">Otaq Tipi</th>
                <th className="py-2 px-4 border-b">Korpus</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr
                  key={room.id}
                  className="hover:bg-gray-100 dark:bg-gray-700  transition-all duration-300 ease-linear"
                >
                  <td className="py-2 px-4 border-b text-center">
                    {room.name}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {room.room_capacity}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {room.department.name}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {room.room_type.name}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {room.corps.name}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                  className="bg-blue-500 text-white p-2 rounded-lg mr-2"
                  onClick={() => handleEdit(room)}
                    >
                      <FaRegEdit className="w-3 md:w-5 h-3 md:h-5" />
                    </button>
                    <button
                  className="bg-red-500 text-white p-2 rounded-lg"
                  onClick={() => openDeleteModal(room)}
                    >
                      <AiOutlineDelete className="w-3 md:w-5 h-3 md:h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <DeleteRoomModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />

      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={closeAddRoomModal}
        onSave={handleSaveRoom}
      />

      {selectedRoom && (
        <EditRoomModal
          isOpen={isEditRoomModalOpen}
          onClose={closeEditRoomModal}
          onSave={handleSaveRoom}
          initialData={{
            id: selectedRoom.id,
            name: selectedRoom.name,
            room_capacity: selectedRoom.room_capacity,
            department_name: selectedRoom.department.name,
            room_type_name: selectedRoom.room_type.name,
            corps_name: selectedRoom.corps.name,
          }}
        />
      )}
    </div>
  );
};

export default Rooms;