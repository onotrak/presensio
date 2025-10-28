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
import { addEmployee, getEmployeeByLogin } from '../database/employeeTable';

const RegisterScreen = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const password = watch('password');

  const onSubmit = async data => {
    setLoading(true);

    getEmployeeByLogin(data.email, data.password, async existing => {
      if (existing) {
        setLoading(false);
        Alert.alert(
          '⚠️ Gagal',
          'Email sudah terdaftar, silakan gunakan email lain.',
        );
      } else {
        try {
          addEmployee(
            data.name,
            data.email,
            data.password,
            data.role || 'employee',
          );
          setLoading(false);
          Alert.alert('✅ Sukses', 'Registrasi berhasil, silakan login.');
          navigation.replace('LoginScreen');
        } catch (error) {
          setLoading(false);
          Alert.alert('❌ Error', 'Terjadi kesalahan saat registrasi.');
          console.log(error);
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrasi Karyawan</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nama</Text>
        <Controller
          control={control}
          rules={{ required: 'Nama wajib diisi' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Nama lengkap"
              onChangeText={onChange}
              value={value}
            />
          )}
          name="name"
        />
        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          rules={{ required: 'Email wajib diisi' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Masukkan email"
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
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
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

        <Text style={styles.label}>Konfirmasi Password</Text>
        <Controller
          control={control}
          rules={{
            required: 'Konfirmasi password wajib diisi',
            validate: value => value === password || 'Password tidak cocok',
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Ulangi password"
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
          name="confirmPassword"
        />
        {errors.confirmPassword && (
          <Text style={styles.error}>{errors.confirmPassword.message}</Text>
        )}

        <Text style={styles.label}>Role</Text>
        <Controller
          control={control}
          name="role"
          defaultValue="employee"
          render={({ field: { onChange, value } }) => (
            <View style={styles.radioGroup}>
              {['employee', 'hrd'].map(role => (
                <TouchableOpacity
                  key={role}
                  style={styles.radioButton}
                  onPress={() => onChange(role)}
                >
                  <View style={styles.radioOuter}>
                    {value === role && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>
                    {role === 'employee' ? 'Karyawan' : 'HRD'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Mendaftarkan...' : 'Daftar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Sudah punya akun? Login di sini</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
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
  link: {
    color: '#1976d2',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1976d2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1976d2',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
});
