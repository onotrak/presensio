import { openDatabase } from 'react-native-sqlite-storage';
const db = openDatabase({ name: 'AbsensiDB.db' });

export const createEmployeeTable = () => {
  db.transaction(txn => {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'employee'
      );`,
      [],
      () => console.log('✅ Table employees created'),
      error => console.log('❌ Error creating employees table: ', error),
    );
  });
};

export const addEmployee = (name, email, password, role = 'employee') => {
  db.transaction(txn => {
    txn.executeSql(
      `INSERT INTO employees (name, email, password, role) VALUES (?, ?, ?, ?);`,
      [name, email, password, role],
      () => console.log('👤 Employee added'),
      error => console.log('❌ Error adding employee: ', error),
    );
  });
};

export const getEmployeeByLogin = (email, password, callback) => {
  db.transaction(txn => {
    txn.executeSql(
      `SELECT * FROM employees WHERE email = ? AND password = ?;`,
      [email, password],
      (tx, results) => {
        if (results.rows.length > 0) {
          callback(results.rows.item(0));
        } else {
          callback(null);
        }
      },
      error => console.log('❌ Error login: ', error),
    );
  });
};

export const getAllEmployees = callback => {
  db.transaction(txn => {
    txn.executeSql(
      `SELECT * FROM employees;`,
      [],
      (tx, results) => {
        const list = [];
        for (let i = 0; i < results.rows.length; i++) {
          list.push(results.rows.item(i));
        }
        callback(list);
      },
      error => console.log('❌ Error fetching employees: ', error),
    );
  });
};
