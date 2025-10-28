import { openDatabase } from 'react-native-sqlite-storage';
import { createEmployeeTable } from './employeeTable';
import { createAttendanceTable } from './attendanceTable';

export const db = openDatabase(
  { name: 'AbsensiDB.db', location: 'default' },
  () => console.log('✅ Database opened successfully'),
  error => console.log('❌ Error opening database: ', error),
);

export const initDatabase = () => {
  console.log('📦 Initializing local database...');
  db.transaction(txn => {
    createEmployeeTable();
    createAttendanceTable();
  });
};

export default db;
