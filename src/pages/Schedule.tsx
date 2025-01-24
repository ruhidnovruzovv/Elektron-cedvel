import React, { useEffect, useState } from 'react';
import { get, getProfile } from '../api/service';
import ClipLoader from 'react-spinners/ClipLoader';
import { useNavigate } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';

interface Lesson {
  schedule_id: number;
  day_name: string;
  hour_name: string;
  discipline_name: string;
  user_name: string;
  corp_name: string;
  lesson_type_name: string;
  room_name: string;
  year: string;
  semester_num: string;
  week_type_name: string | null;
}

interface Schedule {
  id: number;
  group_name: string;
  faculty_name: string;
  department_name: string;
  lessons: Lesson[];
}

interface Day {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  status: number;
}

interface Hour {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  status: number;
}

const Schedule: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [days, setDays] = useState<Day[]>([]);
  const [hours, setHours] = useState<Hour[]>([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [corps, setCorps] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [lessonTypes, setLessonTypes] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [weekTypes, setWeekTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [userData, setUserData] = useState<string | null>(null);
  const [filterFormShow, setFilterFormShow] = useState(false);

  const [filter, setFilter] = useState({
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchSchedules();
    fetchDays();
    fetchHours();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setUserData(response.data.userData);
      setUserName(response.data.userData.name);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const isSuperAdmin = userData?.roles?.includes('super-admin');

  const fetchSchedules = async (filterParams: string = '') => {
    try {
      setLoading(true);
      const response = await get(`/api/schedules${filterParams}`);
      const scheduleData = Object.values(response.data.schedules);
      setSchedules(scheduleData);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDays = async () => {
    try {
      const response = await get('/api/days');
      setDays(response.data);
    } catch (error) {
      console.error('Error fetching days:', error);
    }
  };

  const fetchHours = async () => {
    try {
      const response = await get('/api/hours');
      setHours(response.data);
    } catch (error) {
      console.error('Error fetching hours:', error);
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await get('/api/faculties');
      setFaculties(response.data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await get('/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await get('/api/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchCorps = async () => {
    try {
      const response = await get('/api/corps');
      setCorps(response.data);
    } catch (error) {
      console.error('Error fetching corps:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await get('/api/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchLessonTypes = async () => {
    try {
      const response = await get('/api/lesson_types');
      setLessonTypes(response.data);
    } catch (error) {
      console.error('Error fetching lesson types:', error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await get('/api/semesters');
      setSemesters(response.data);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  const fetchWeekTypes = async () => {
    try {
      const response = await get('/api/week_types');
      setWeekTypes(response.data);
    } catch (error) {
      console.error('Error fetching week types:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDisciplines = async () => {
    try {
      const response = await get('/api/disciplines');
      setDisciplines(response.data);
    } catch (error) {
      console.error('Error fetching disciplines:', error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.keys(filter).forEach((key) => {
      if (filter[key]) {
        params.append(key, filter[key]);
      }
    });
    fetchSchedules(`?${params.toString()}`);
  };

  const toggleFilterForm = () => {
    setFilterFormShow(!filterFormShow);
  };

  const resetForm = () => {
    setFilter({
      faculty_id: '',
      discipline_id: '',
      department_id: '',
      group_id: '',
      semester_id: '',
      week_type_id: '',
      day_id: '',
      hour_id: '',
      lesson_type_id: '',
      corp_id: '',
      room_id: '',
      user_id: '',
    });
  };

  const renderScheduleTable = (
    shiftHours: Hour[],
    facultySchedules: Schedule[],
  ) => {
    return (
      <div className="overflow-x-auto text-sm">
        <table className="min-w-full mb-5 mt-5 bg-white dark:bg-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-900">
              <th className="py-2 px-6 border-b dark:border-gray-500">Qrup</th>
              {days.map((day) => (
                <th
                  key={day.id}
                  className="py-2 px-6 border-b dark:border-gray-500"
                  colSpan={shiftHours.length}
                >
                  {day.name}
                </th>
              ))}
            </tr>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="py-2 px-6 border-b dark:border-gray-500"></th>
              {days.map((day) =>
                shiftHours.map((hour) => (
                  <th
                    key={`${day.id}-${hour.id}`}
                    className="py-2 px-6 border-b dark:border-gray-500"
                  >
                    {hour.name}
                  </th>
                )),
              )}
            </tr>
          </thead>
          <tbody>
            {facultySchedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="py-2 px-6 border-b dark:border-gray-500">
                  {schedule.group_name}
                </td>
                {days.map((day) =>
                  shiftHours.map((hour) => {
                    const upperWeekLesson = schedule.lessons.find(
                      (l) =>
                        l.day_name === day.name &&
                        l.hour_name === hour.name &&
                        l.week_type_name === 'ust hefte' &&
                        (isSuperAdmin || l.user_name === userName),
                    );
                    const lowerWeekLesson = schedule.lessons.find(
                      (l) =>
                        l.day_name === day.name &&
                        l.hour_name === hour.name &&
                        l.week_type_name === 'alt hefte' &&
                        (isSuperAdmin || l.user_name === userName),
                    );
                    const singleLesson = schedule.lessons.find(
                      (l) =>
                        l.day_name === day.name &&
                        l.hour_name === hour.name &&
                        l.week_type_name === null &&
                        (isSuperAdmin || l.user_name === userName),
                    );
                    return (
                      <td
                        key={`${day.id}-${hour.id}`}
                        className="py-2 px-2 border-b  dark:border-gray-500 text-center cursor-pointer"
                        style={{ minWidth: '150px', maxWidth: '200px' }}
                        onClick={() => {
                          const lesson =
                            singleLesson || upperWeekLesson || lowerWeekLesson;
                          if (lesson) {
                            navigate(`/schedule-lesson/${lesson.schedule_id}`);
                          }
                        }}
                      >
                        {singleLesson ? (
                          <div className="w-full hover:text-blue-600">
                            <div>{singleLesson.discipline_name}</div>
                            <div>{singleLesson.user_name}</div>
                            <div>
                              {singleLesson.corp_name} -{' '}
                              {singleLesson.room_name}
                            </div>
                            <div>{singleLesson.lesson_type_name.charAt(0)}</div>
                          </div>
                        ) : upperWeekLesson || lowerWeekLesson ? (
                          <div className="flex flex-col h-full">
                            {upperWeekLesson ? (
                              <div
                                className={
                                  lowerWeekLesson
                                    ? 'border-b dark:border-gray-500 hover:text-blue-600 border-gray-300'
                                    : ' hover:text-blue-600'
                                }
                              >
                                <div>{upperWeekLesson.discipline_name}</div>
                                <div>{upperWeekLesson.user_name}</div>
                                <div>
                                  {upperWeekLesson.corp_name} -{' '}
                                  {upperWeekLesson.room_name}
                                </div>
                                <div>
                                  {upperWeekLesson.lesson_type_name.charAt(0)}
                                </div>
                              </div>
                            ) : lowerWeekLesson ? (
                              <div className="mb-5">
                                <div>Dərs yoxdur</div>
                              </div>
                            ) : null}
                            {lowerWeekLesson ? (
                              <div
                                className={
                                  upperWeekLesson
                                    ? 'hover:text-blue-600'
                                    : 'border-t hover:text-blue-600 border-gray-300'
                                }
                              >
                                <div>{lowerWeekLesson.discipline_name}</div>
                                <div>{lowerWeekLesson.user_name}</div>
                                <div>
                                  {lowerWeekLesson.corp_name} -{' '}
                                  {lowerWeekLesson.room_name}
                                </div>
                                <div>
                                  {lowerWeekLesson.lesson_type_name.charAt(0)}
                                </div>
                              </div>
                            ) : upperWeekLesson ? (
                              <div className="border-t border-gray-300">
                                <div>Dərs yoxdur</div>
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          'Boş'
                        )}
                      </td>
                    );
                  }),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const facultiesList = Array.from(
    new Set(schedules.map((schedule) => schedule.faculty_name)),
  );

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">Dərs Cədvəli</h2>
      <div className="flex w-full justify-between items-center  mb-6">
        <button
          onClick={() => navigate('/add-schedule-lesson')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-4"
        >
          Dərs Əlavə Et
        </button>
        <button
          className="cursor-pointer ml-10 border flex items-center px-4 py-2 gap-4 rounded-lg"
          onClick={() => toggleFilterForm()}
        >
         Filter <FaFilter  />
        </button>
      </div>
      {filterFormShow ? (
        <form
          onSubmit={handleFilterSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <select
            name="faculty_id"
            value={filter.faculty_id}
            onChange={handleFilterChange}
            onFocus={fetchFaculties}
            className="p-2 border rounded-lg"
          >
            <option value="">Fakültə</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
          <select
            name="department_id"
            value={filter.department_id}
            onChange={handleFilterChange}
            onFocus={fetchDepartments}
            className="p-2 border rounded-lg"
          >
            <option value="">Kafedra</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          <select
            name="group_id"
            value={filter.group_id}
            onChange={handleFilterChange}
            onFocus={fetchGroups}
            className="p-2 border rounded-lg"
          >
            <option value="">Qrup</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <select
            name="corp_id"
            value={filter.corp_id}
            onChange={handleFilterChange}
            onFocus={fetchCorps}
            className="p-2 border rounded-lg"
          >
            <option value="">Korpus</option>
            {corps.map((corp) => (
              <option key={corp.id} value={corp.id}>
                {corp.name}
              </option>
            ))}
          </select>
          <select
            name="room_id"
            value={filter.room_id}
            onChange={handleFilterChange}
            onFocus={fetchRooms}
            className="p-2 border rounded-lg"
          >
            <option value="">Otaq</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
          <select
            name="lesson_type_id"
            value={filter.lesson_type_id}
            onChange={handleFilterChange}
            onFocus={fetchLessonTypes}
            className="p-2 border rounded-lg"
          >
            <option value="">Dərs Tipi</option>
            {lessonTypes.map((lessonType) => (
              <option key={lessonType.id} value={lessonType.id}>
                {lessonType.name}
              </option>
            ))}
          </select>
          <select
            name="hour_id"
            value={filter.hour_id}
            onChange={handleFilterChange}
            onFocus={fetchHours}
            className="p-2 border rounded-lg"
          >
            <option value="">Saat</option>
            {hours.map((hour) => (
              <option key={hour.id} value={hour.id}>
                {hour.name}
              </option>
            ))}
          </select>
          <select
            name="semester_id"
            value={filter.semester_id}
            onChange={handleFilterChange}
            onFocus={fetchSemesters}
            className="p-2 border rounded-lg"
          >
            <option value="">Semestr</option>
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.semester_num}
              </option>
            ))}
          </select>
          <select
            name="week_type_id"
            value={filter.week_type_id}
            onChange={handleFilterChange}
            onFocus={fetchWeekTypes}
            className="p-2 border rounded-lg"
          >
            <option value="">Həftə Tipi</option>
            {weekTypes.map((weekType) => (
              <option key={weekType.id} value={weekType.id}>
                {weekType.name}
              </option>
            ))}
          </select>
          <select
            name="day_id"
            value={filter.day_id}
            onChange={handleFilterChange}
            onFocus={fetchDays}
            className="p-2 border rounded-lg"
          >
            <option value="">Gün</option>
            {days.map((day) => (
              <option key={day.id} value={day.id}>
                {day.name}
              </option>
            ))}
          </select>
          <select
            name="user_id"
            value={filter.user_id}
            onChange={handleFilterChange}
            onFocus={fetchUsers}
            className="p-2 border rounded-lg"
          >
            <option value="">Müəllim</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <select
            name="discipline_id"
            value={filter.discipline_id}
            onChange={handleFilterChange}
            onFocus={fetchDisciplines}
            className="p-2 border rounded-lg"
          >
            <option value="">Fənn</option>
            {disciplines.map((discipline) => (
              <option key={discipline.id} value={discipline.id}>
                {discipline.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Filter
          </button>
          <div className=""></div>
          <button
            className="bg-gray-300 rounded-lg px-4 py-2"
            onClick={() => resetForm()}
          >
            Reset
          </button>
        </form>
      ) : null}
      {loading ? (
        <div className="flex justify-center items-center">
          <ClipLoader size={50} color={'#123abc'} loading={loading} />
        </div>
      ) : (
        facultiesList.map((facultyName) => {
          const facultySchedules = schedules.filter(
            (schedule) => schedule.faculty_name === facultyName,
          );
          return (
            <div key={facultyName}>
              <h3 className="text-xl mt-10 font-bold">{facultyName}</h3>
              {renderScheduleTable(
                hours.filter((hour) =>
                  ['09:00-10:20', '10:30-11:50', '12:00-13:20'].includes(
                    hour.name,
                  ),
                ),
                facultySchedules,
              )}
              {renderScheduleTable(
                hours.filter((hour) =>
                  ['13:35-14:55', '15:05-16:25', '16:35-17:55'].includes(
                    hour.name,
                  ),
                ),
                facultySchedules,
              )}
              {renderScheduleTable(
                hours.filter((hour) =>
                  ['18:30-19:50', '20:00-21:20'].includes(hour.name),
                ),
                facultySchedules,
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Schedule;
