import React, { useState } from 'react';
import { RefreshControl } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import { HeaderContainer, HeaderTitle } from '../components/Header';
import theme from '../styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment, RootStackParamList, Doctor } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import { ActionButton, ActionButtons, AppointmentCard, AppointmentList, Container, Content, DateTime, Description, DoctorImage, DoctorName, DoctorSpecialty, EmptyText, InfoContainer, Status } from '../styles/homeScreen';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. João Silva',
    specialty: 'Cardiologista',
    image: 'https://mighty.tools/mockmind-api/content/human/91.jpg',
  },
  {
    id: '2',
    name: 'Dra. Maria Santos',
    specialty: 'Dermatologista',
    image: 'https://mighty.tools/mockmind-api/content/human/97.jpg',
  },
  {
    id: '3',
    name: 'Dr. Pedro Oliveira',
    specialty: 'Oftalmologista',
    image: 'https://mighty.tools/mockmind-api/content/human/79.jpg',
  },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('appointments');
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    const storedAppointments = await AsyncStorage.getItem('appointments')
    if (!storedAppointments) {
      alert('Não é possivel remover esse item')
      return
    }

    const appointmentsJson: Appointment[] = JSON.parse(storedAppointments)
    const newAppointmentsList = appointmentsJson.filter((appointment) => appointment.id != appointmentId)

    await AsyncStorage.setItem('appointments', JSON.stringify(newAppointmentsList))
    setAppointments(newAppointmentsList)
  }

  const getDoctorInfo = (doctorId: string): Doctor | undefined => {
    return doctors.find(doctor => doctor.id === doctorId);
  };

  const renderAppointment = ({ item }: { item: Appointment }) => {
    const doctor = getDoctorInfo(item.doctorId);

    return (
      <AppointmentCard>
        <DoctorImage source={{ uri: doctor?.image || 'https://via.placeholder.com/100' }} />
        <InfoContainer>
          <DoctorName>{doctor?.name || 'Médico não encontrado'}</DoctorName>
          <DoctorSpecialty>{doctor?.specialty || 'Especialidade não encontrada'}</DoctorSpecialty>
          <DateTime>{new Date(item.date).toLocaleDateString()} - {item.time}</DateTime>
          <Description>{item.description}</Description>
          <Status status={item.status}>
            {item.status === 'pending' ? 'Pendente' : 'Confirmado'}
          </Status>
          <ActionButtons>
            <ActionButton>
              <Icon name="edit" type="material" size={20} color={theme.colors.primary} />
            </ActionButton>
            <ActionButton onPress={() => handleDeleteAppointment(item.id)}>
              <Icon name="delete" type="material" size={20} color={theme.colors.error} />
            </ActionButton>
          </ActionButtons>
        </InfoContainer>
      </AppointmentCard>
    );
  };

  return (
    <Container>
      <HeaderContainer>
        <HeaderTitle>Minhas Consultas</HeaderTitle>
      </HeaderContainer>

      <Content>
        <Button
          title="Agendar Nova Consulta"
          icon={
            <FontAwesome
              name="calendar-plus-o"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
          }
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            padding: 12,
            marginBottom: theme.spacing.medium
          }}
          onPress={() => navigation.navigate('CreateAppointment')}
        />

        <AppointmentList
          data={appointments}
          keyExtractor={(item: Appointment) => item.id}
          renderItem={renderAppointment}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <EmptyText>Nenhuma consulta agendada</EmptyText>
          }
        />
      </Content>
    </Container>
  );
};

export default HomeScreen;