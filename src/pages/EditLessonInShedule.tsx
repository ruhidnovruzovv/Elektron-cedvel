import React, { useEffect, useState } from 'react';
import { get, put } from '../api/service';
import { useNavigate, useParams } from 'react-router-dom';

const EditLessonInShedule = () => {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [corps, setCorps] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [lessonTypes, setLessonTypes] = useState([]);
  const [hours, setHours] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [weekTypes, setWeekTypes] = useState([]);
  const [days, setDays] = useState([]);
  const [users, setUsers] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [filteredDisciplines, setFilteredDisciplines] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    faculty_id: '',
    department_id: '',
    group_id: '',
    corp_id: '',
    room_id: '',
    lesson_type_id: '',
    hour_id: '',
    semester_id: '',
    week_type_id: '',
    day_id: '',
    user_id: '',
    discipline_id: '',
  });

  const fetchData = async () => {
    try {
      const [
        groupsResponse,
        corpsResponse,
        roomsResponse,
        lessonTypesResponse,
        hoursResponse,
        semestersResponse,
        weekTypesResponse,
        daysResponse,
        usersResponse,
        facultiesResponse,
        departmentsResponse,
        disciplinesResponse,
        scheduleResponse,
      ] = await Promise.all([
        get('/api/group'),
        get('/api/corps'),
        get('/api/room'),
        get('/api/lessontype'),
        get('/api/hour'),
        get('/api/semestr'),
        get('/api/weektype'),
        get('/api/day'),
        get('/api/users'),
        get('/api/faculty'),
        get('/api/department'),
        get('/api/lesson'),
        get(`/api/schedule/${id}`),
      ]);

      setGroups(groupsResponse.data);
      setCorps(corpsResponse.data);
      setRooms(roomsResponse.data);
      setLessonTypes(lessonTypesResponse.data);
      setHours(hoursResponse.data);
      setSemesters(semestersResponse.data);
      setWeekTypes(weekTypesResponse.data);
      setDays(daysResponse.data);
      setUsers(usersResponse.data);
      setFaculties(facultiesResponse.data);
      setDepartments(departmentsResponse.data);
      setDisciplines(disciplinesResponse.data);

      const schedule = scheduleResponse.data.schedule;
      setFormData({
        faculty_id:
          facultiesResponse.data.find(
            (faculty) => faculty.name === schedule.faculty_name,
          )?.id || '',
        department_id:
          departmentsResponse.data.find(
            (department) => department.name === schedule.department_name,
          )?.id || '',
        group_id:
          groupsResponse.data.find(
            (group) => group.name === schedule.group_name,
          )?.id || '',
        corp_id:
          corpsResponse.data.find((corp) => corp.name === schedule.corp_name)
            ?.id || '',
        room_id:
          roomsResponse.data.find((room) => room.name === schedule.room_name)
            ?.id || '',
        lesson_type_id:
          lessonTypesResponse.data.find(
            (lessonType) => lessonType.name === schedule.lesson_type_name,
          )?.id || '',
        hour_id:
          hoursResponse.data.find((hour) => hour.name === schedule.hour_name)
            ?.id || '',
        semester_id:
          semestersResponse.data.find(
            (semester) => semester.semester_num === schedule.semester_num,
          )?.id || '',
        week_type_id:
          weekTypesResponse.data.find(
            (weekType) => weekType.name === schedule.week_type_name,
          )?.id || '',
        day_id:
          daysResponse.data.find((day) => day.name === schedule.day_name)?.id ||
          '',
        user_id:
          usersResponse.data.find((user) => user.name === schedule.user_name)
            ?.id || '',
        discipline_id:
          disciplinesResponse.data.find(
            (discipline) => discipline.name === schedule.discipline_name,
          )?.id || '',
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (formData.faculty_id) {
      const filtered = departments.filter(
        (department) => department.faculty_id === parseInt(formData.faculty_id),
      );
      setFilteredDepartments(filtered);
    }
  }, [formData.faculty_id, departments]);

  useEffect(() => {
    if (formData.department_id) {
      const filtered = disciplines.filter(
        (discipline) =>
          discipline.department_id === parseInt(formData.department_id),
      );
      setFilteredDisciplines(filtered);
    }
  }, [formData.department_id, disciplines]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await put(`/api/schedule/${id}`, formData);
      navigate('/schedule');
    } catch (error) {
      console.error('Error updating schedule lesson:', error);
      alert('Dərs cədvələ yenilənərkən xəta baş verdi');
    }
  };

  return (
    <div className="grid md:grid-cols-2 m-5 md:m-10 gap-4">
      <h2 className="col-span-2 text-center text-2xl font-bold">
        Dərsi Redaktə Et
      </h2>
      <form
        onSubmit={handleSubmit}
        className="col-span-2 grid grid-cols-2 gap-4"
      >
        <div>
          <label className="block font-medium">Fakültə:</label>
          <select
            name="faculty_id"
            value={formData.faculty_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Seçin</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Kafedra:</label>
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Seçin</option>
            {filteredDepartments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Qrup:</label>
          <select
            name="group_id"
            value={formData.group_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Seçin</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Korpus:</label>
          <select
            name="corp_id"
            value={formData.corp_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Seçin</option>
            {corps.map((corp) => (
              <option key={corp.id} value={corp.id}>
                {corp.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Otaq:</label>
          <select
            name="room_id"
            value={formData.room_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Seçin</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Dərs Tipi:</label>
          <select
            name="lesson_type_id"
            value={formData.lesson_type_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Seçin</option>
            {lessonTypes.map((lessonType) => (
              <option key={lessonType.id} value={lessonType.id}>
                {lessonType.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Saat:</label>
          <select
            name="hour_id"
            value={formData.hour_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Seçin</option>
            {hours.map((hour) => (
              <option key={hour.id} value={hour.id}>
                {hour.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Semestr:</label>
          <select
            name="semester_id"
            value={formData.semester_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Seçin</option>
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.semester_num}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Həftə Tipi:</label>
          <select
            name="week_type_id"
            value={formData.week_type_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Seçin</option>
            {weekTypes.map((weekType) => (
              <option key={weekType.id} value={weekType.id}>
                {weekType.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Gün:</label>
          <select
            name="day_id"
            value={formData.day_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Seçin</option>
            {days.map((day) => (
              <option key={day.id} value={day.id}>
                {day.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Müəllim:</label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Seçin</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Fənn:</label>
          <select
            name="discipline_id"
            value={formData.discipline_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Seçin</option>
            {filteredDisciplines.map((discipline) => (
              <option key={discipline.id} value={discipline.id}>
                {discipline.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2 text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
          >
            Yenilə
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLessonInShedule;
