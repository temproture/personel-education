import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import './App.css';

const employees = [
  { id: 1, name: 'Ahmet Yılmaz', title: 'Satış Müdürü', position: 'Müdür' },
  { id: 2, name: 'Ayşe Demir', title: 'Pazarlama Müdürü', position: 'Müdür' },
  { id: 3, name: 'Mehmet Kaya', title: 'İK Uzmanı', position: 'Uzman' },
  { id: 4, name: 'Fatma Çelik', title: 'Finans Müdürü', position: 'Müdür' },
  { id: 5, name: 'Ali Öztürk', title: 'Yazılım Geliştirici', position: 'Uzman' },
  { id: 6, name: 'Zeynep Aydın', title: 'Müşteri Hizmetleri Temsilcisi', position: 'Temsilci' },
  { id: 7, name: 'Mustafa Şahin', title: 'Operasyon Müdürü', position: 'Müdür' },
  { id: 8, name: 'Emine Yıldız', title: 'Grafik Tasarımcı', position: 'Uzman' },
  { id: 9, name: 'Hasan Arslan', title: 'Satış Temsilcisi', position: 'Temsilci' },
  { id: 10, name: 'Hatice Güneş', title: 'Proje Yöneticisi', position: 'Yönetici' },
];

const educations = [
  { id: 1, name: 'İletişim Eğitimi', positions: ['Temsilci', 'Müdür'] },
  { id: 2, name: 'KVKK Eğitimi', positions: ['Temsilci', 'Uzman', 'Müdür', 'Yönetici'] },
  { id: 3, name: 'Excel Eğitimi', positions: ['Uzman', 'Müdür'] },
  { id: 4, name: 'Psikoloji', positions: ['Temsilci', 'Müdür'] },
  { id: 5, name: 'Yönetim Eğitimi', positions: ['Müdür', 'Yönetici'] },
];

function App() {
  const [assignments, setAssignments] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [assignmentSearchTerm, setAssignmentSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('employees'); // New state for tab management

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const assignEducation = useCallback(() => {
    if (selectedEducation) {
      let eligibleEmployees = [];
      
      if (selectedEmployee) {
        eligibleEmployees = [selectedEmployee];
      } else if (selectedPositions.length > 0) {
        eligibleEmployees = employees.filter(employee => 
          selectedPositions.includes(employee.position)
        );
      } else {
        eligibleEmployees = employees.filter(employee => 
          selectedEducation.positions.includes(employee.position)
        );
      }
      
      setAssignments(prev => {
        const newAssignments = { ...prev };
        eligibleEmployees.forEach(employee => {
          if (!newAssignments[employee.id]) {
            newAssignments[employee.id] = [];
          }
          if (!newAssignments[employee.id].includes(selectedEducation.id)) {
            newAssignments[employee.id].push(selectedEducation.id);
          }
        });
        return newAssignments;
      });
      setSelectedEducation(null);
      setSelectedEmployee(null);
      setSelectedPositions([]);
    }
  }, [selectedEducation, selectedEmployee, selectedPositions]);

  const filteredAssignments = Object.entries(assignments).filter(([employeeId, _]) => 
    employees.find(e => e.id === parseInt(employeeId)).name.toLowerCase().includes(assignmentSearchTerm.toLowerCase()) ||
    employees.find(e => e.id === parseInt(employeeId)).title.toLowerCase().includes(assignmentSearchTerm.toLowerCase()) ||
    employees.find(e => e.id === parseInt(employeeId)).position.toLowerCase().includes(assignmentSearchTerm.toLowerCase())
  );

  const togglePosition = (position) => {
    setSelectedPositions(prev => 
      prev.includes(position) 
        ? prev.filter(p => p !== position)
        : [...prev, position]
    );
  };

  const uniquePositions = [...new Set(employees.map(e => e.position))];

  const deleteAssignment = (employeeId, educationId) => {
    setAssignments(prev => {
      const newAssignments = { ...prev };
      newAssignments[employeeId] = newAssignments[employeeId].filter(id => id !== educationId);
      if (newAssignments[employeeId].length === 0) {
        delete newAssignments[employeeId];
      }
      return newAssignments;
    });
  };

  return (
    <div className="App">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Çalışan Eğitim Atama
      </motion.h1>
      <div className="main-content">
        <motion.div
          className="left-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="tab-buttons">
            <button 
              className={activeTab === 'employees' ? 'active' : ''}
              onClick={() => setActiveTab('employees')}
            >
              Çalışanlar
            </button>
            <button 
              className={activeTab === 'positions' ? 'active' : ''}
              onClick={() => setActiveTab('positions')}
            >
              Pozisyonlar
            </button>
          </div>
          {activeTab === 'employees' && (
            <>
              <input
                type="text"
                placeholder="Çalışan ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="scrollable-list">
                {filteredEmployees.map(employee => (
                  <motion.div 
                    key={employee.id} 
                    className={`employee-item ${selectedEmployee && selectedEmployee.id === employee.id ? 'selected' : ''}`}
                    onClick={() => setSelectedEmployee(employee)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <strong>{employee.name}</strong>
                    <div>{employee.title}</div>
                    <div className="position-tag">{employee.position}</div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
          {activeTab === 'positions' && (
            <div className="position-selection">
              <h3>Pozisyon Seçimi</h3>
              {uniquePositions.map(position => (
                <button
                  key={position}
                  className={`position-button ${selectedPositions.includes(position) ? 'selected' : ''}`}
                  onClick={() => togglePosition(position)}
                >
                  {position}
                </button>
              ))}
            </div>
          )}
        </motion.div>
        <motion.div
          className="right-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2>Eğitim Seçenekleri</h2>
          <div className="scrollable-list">
            {educations.map(education => (
              <motion.div 
                key={education.id} 
                className={`education-item ${selectedEducation && selectedEducation.id === education.id ? 'selected' : ''}`}
                onClick={() => setSelectedEducation(education)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <strong>{education.name}</strong>
                <div>Pozisyonlar: {education.positions.join(', ')}</div>
              </motion.div>
            ))}
          </div>
          <motion.button
            className="assign-button"
            onClick={assignEducation}
            disabled={!selectedEducation || (!selectedEmployee && selectedPositions.length === 0)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Eğitimi Ata
          </motion.button>
        </motion.div>
      </div>
      <motion.div
        className="assigned-educations-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2>Atanmış Eğitimler</h2>
        <input
          type="text"
          placeholder="Atanmış çalışanları ara..."
          value={assignmentSearchTerm}
          onChange={(e) => setAssignmentSearchTerm(e.target.value)}
        />
        <div className="scrollable-list assignments-list">
          {filteredAssignments.map(([employeeId, educationIds]) => {
            const employee = employees.find(e => e.id === parseInt(employeeId));
            return (
              <motion.div
                key={employeeId}
                className="assignment-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <strong>{employee.name}</strong>
                <div>{employee.title} - {employee.position}</div>
                <ul>
                  {educationIds.map(educationId => (
                    <motion.li
                      key={educationId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {educations.find(e => e.id === educationId).name}
                      <button 
                        className="delete-button"
                        onClick={() => deleteAssignment(employeeId, educationId)}
                      >
                        Sil
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export default App;
