import { openDatabase } from 'react-native-sqlite-storage';
const db = openDatabase({ name: 'AbsensiDB.db' });

export const createAttendanceTable = () => {
  db.transaction(txn => {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        check_in_time TEXT,
        check_out_time TEXT,
        latitude TEXT,
        longitude TEXT,
        FOREIGN KEY (employee_id) REFERENCES employees(id)
      );`,
      [],
      () => console.log('✅ Table attendance created'),
      error => console.log('❌ Error creating attendance table: ', error),
    );
  });
};

export const addCheckIn = (employeeId, latitude, longitude) => {
  const currentTime = new Date().toISOString();
  db.transaction(txn => {
    txn.executeSql(
      `INSERT INTO attendance (employee_id, check_in_time, latitude, longitude)
       VALUES (?, ?, ?, ?);`,
      [employeeId, currentTime, latitude, longitude],
      () => console.log('🕒 Check-in recorded'),
      error => console.log('❌ Error on check-in: ', error),
    );
  });
};

export const addCheckOut = (employeeId, latitude, longitude) => {
  const currentTime = new Date().toISOString();
  db.transaction(txn => {
    txn.executeSql(
      `UPDATE attendance
       SET check_out_time = ?, latitude = ?, longitude = ?
       WHERE employee_id = ? AND check_out_time IS NULL;`,
      [currentTime, latitude, longitude, employeeId],
      () => console.log('🏁 Check-out recorded'),
      error => console.log('❌ Error on check-out: ', error),
    );
  });
};

export const getAttendanceHistory = (employeeId, callback) => {
  db.transaction(txn => {
    txn.executeSql(
      `SELECT * FROM attendance WHERE employee_id = ? ORDER BY id DESC;`,
      [employeeId],
      (tx, results) => {
        const list = [];
        for (let i = 0; i < results.rows.length; i++) {
          list.push(results.rows.item(i));
        }
        callback(list);
      },
      error => console.log('❌ Error fetching attendance: ', error),
    );
  });
};

export const getAllAttendance = callback => {
  db.transaction(txn => {
    txn.executeSql(
      `SELECT a.*, e.name, e.email
       FROM attendance a
       LEFT JOIN employees e ON a.employee_id = e.id
       ORDER BY a.id DESC;`,
      [],
      (tx, results) => {
        const list = [];
        for (let i = 0; i < results.rows.length; i++) {
          list.push(results.rows.item(i));
        }
        callback(list);
      },
      error => console.log('❌ Error fetching all attendance: ', error),
    );
  });
};
