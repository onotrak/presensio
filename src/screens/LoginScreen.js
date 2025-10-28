import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { getEmployeeByLogin } from '../database/employeeTable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = data => {
    setLoading(true);
    getEmployeeByLogin(data.email, data.password, async user => {
      setLoading(false);
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        Alert.alert('✅ Login Berhasil', `Selamat datang ${user.name}`);
        navigation.replace('Dashboard');
      } else {
        Alert.alert('❌ Login Gagal', 'Email atau password salah');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PRESENSIO</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          rules={{ required: 'Email wajib diisi' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Masukkan email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
          name="email"
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          rules={{ required: 'Password wajib diisi' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Memproses...' : 'Login'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonRegister]}
          onPress={() => navigation.navigate('RegisterScreen')}
          disabled={loading}
        >
          <Text style={styles.buttonTextRegister}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
  },
  form: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonRegister: {
    backgroundColor: '#fff',
    borderColor: '#1976d2',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonTextRegister: {
    color: '#1976d2',
    fontWeight: '700',
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
});
