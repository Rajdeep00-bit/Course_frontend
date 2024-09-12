import React, { useEffect, useState } from 'react';
import './App.css';
import CourseForm from './components/CourseForm';
import CourseInstanceForm from './components/CourseInstanceForm';
import CourseInstanceList from './components/CourseInstanceList';
import CourseList from './components/CourseList';
import CourseInstanceDetails from './components/CourseInstanceDetails';

function App() {
  const [courses, setCourses] = useState([]);
  const [instances, setInstances] = useState([]);
  const [year, setYear] = useState('');  // Initialize as string
  const [semester, setSemester] = useState('');  // Initialize as string
  const [selectedInstance, setSelectedInstance] = useState(null);

  // Fetch all courses
  const fetchCourses = () => {
    console.log('Fetching courses...');  // Log to verify it's being called
    fetch('http://127.0.0.1:8000/api/courses/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched courses:', data);  // Log the fetched courses
        setCourses(data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        al
