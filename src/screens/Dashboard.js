import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addCheckIn,
  addCheckOut,
  getAttendanceHistory,
  getAllAttendance,
} from '../database/attendanceTable';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import dayjs from 'dayjs';

const DashboardScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disableCheckin, setDisableCheckin] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem('user');
      if (data) {
        const parsed = JSON.parse(data);
        setUser(parsed);
        if (parsed.role === 'hrd') {
          fetchAllAttendance();
        } else {
          fetchAttendance(parsed.id);
        }
      } else {
        navigation.replace('Login');
      }
    };
    loadUser();
  }, []);

  const fetchAttendance = employeeId => {
    getAttendanceHistory(employeeId, data => {
      setAttendance(data);

      const today = dayjs().format('YYYY-MM-DD');

      const hasCheckedInToday = data.some(
        item =>
          item.check_in_time &&
          dayjs(item.check_in_time).format('YYYY-MM-DD') === today,
      );

      setDisableCheckin(hasCheckedInToday);
    });
  };

  const fetchAllAttendance = () => {
    getAllAttendance(setAttendance);
  };

  const requestLocationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    return result === RESULTS.GRANTED;
  };

  const handleCheckIn = async () => {
    if (disableCheckin) return;
    if (!user) return;
    const granted = await requestLocationPermission();
    if (!granted) {
      Alert.alert('Izin diperlukan', 'Aktifkan GPS untuk melakukan check-in.');
      return;
    }

    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        addCheckIn(user.id, latitude.toString(), longitude.toString());
        Alert.alert('✅ Check-In', 'Berhasil melakukan check-in.');
        fetchAttendance(user.id);
        setLoading(false);
      },
      error => {
        console.log(error);
        Alert.alert('❌ Error', 'Tidak dapat mengambil lokasi.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const handleCheckOut = async () => {
    if (!user) return;
    const granted = await requestLocationPermission();
    if (!granted) {
      Alert.alert('Izin diperlukan', 'Aktifkan GPS untuk melakukan check-out.');
      return;
    }

    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        addCheckOut(user.id, latitude.toString(), longitude.toString());
        Alert.alert('🏁 Check-Out', 'Berhasil melakukan check-out.');
        fetchAttendance(user.id);
        setLoading(false);
      },
      error => {
        console.log(error);
        Alert.alert('❌ Error', 'Tidak dapat mengambil lokasi.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.replace('LoginScreen');
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name || user.name}</Text>
      <Text>
        Check-In:{' '}
        {item?.check_in_time
          ? dayjs(item.check_in_time).format('HH:mm:ss - DD/MM/YYYY')
          : '-'}
      </Text>
      <Text>
        Check-Out:{' '}
        {item?.check_out_time
          ? dayjs(item.check_out_time).format('HH:mm:ss - DD/MM/YYYY')
          : '-'}
      </Text>
      <Text>
        Lokasi: {item.latitude}, {item.longitude}
      </Text>
    </View>
  );

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Selamat Datang, {user.name}</Text>
      <Text style={styles.subHeader}>Role: {user.role.toUpperCase()}</Text>

      {user.role === 'employee' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: !disableCheckin ? '#4caf50' : '#a5a5a5' },
            ]}
            onPress={handleCheckIn}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Check In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#f44336' }]}
            onPress={handleCheckOut}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Check Out</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={attendance}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ marginTop: 20 }}
      />

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  subHeader: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  name: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  logout: {
    backgroundColor: '#9e9e9e',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
