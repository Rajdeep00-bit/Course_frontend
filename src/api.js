import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; // Adjust this URL if necessary

// Courses API
export const getCourses = () => axios.get(`${API_URL}/courses/`);
export const getCourseById = (id) => axios.get(`${API_URL}/courses/${id}/`);
export const createCourse = (course) => axios.post(`${API_URL}/courses/`, course);
export const deleteCourse = (id) => axios.delete(`${API_URL}/courses/${id}/`);

// Course Instances API
export const getCourseInstances = () => axios.get(`${API_URL}/course-instances/`); // Corrected endpoint
export const getCourseInstanceById = (year, semester, id) => axios.get(`${API_URL}/course-instances/${year}/${semester}/${id}/`); // Corrected endpoint
export const createCourseInstance = (instance) => axios.post('http://127.0.0.1:8000/api/course-instances/', instance);
export const deleteCourseInstance = (year, semester, id) => axios.delete(`${API_URL}/course-instances/${year}/${semester}/${id}/`); // Corrected endpoint
