import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Button, Input, Text } from 'react-native-elements';
import { Platform, View, TouchableOpacity } from 'react-native';
import theme from '../styles/theme';
import { Doctor } from '../types';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';

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

type AppointmentFormProps = {
    onSubmit: (appointment: {
        doctorId: string;
        date: Date;
        time: string;
        description: string;
    }) => void;
};

const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
};

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit }) => {
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');
    const [dateInput, setDateInput] = useState(() => {
        return Date.now().toString()
    });
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [description, setDescription] = useState('');
    const timeSlots = generateTimeSlots();

    const validateDate = (inputDate: string) => {
        const date = new Date(parseInt(inputDate))

        const today = new Date();
        const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

        return dayjs(date).isAfter(today) && dayjs(date).isBefore(maxDate)
    }

    const handleSubmit = () => {
        if (!selectedDoctor || !selectedTime || !description) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        if (!validateDate(dateInput)) {
            alert('Por favor, insira uma data válida (DD/MM/AAAA)');
            return;
        }

        const dateFormatted = new Date(parseInt(dateInput))

        const day = dateFormatted.getDate()
        const month = dateFormatted.getMonth()
        const year = dateFormatted.getFullYear()

        const date = new Date(year, month, day);

        onSubmit({
            doctorId: selectedDoctor,
            date,
            time: selectedTime,
            description,
        });
    };

    const isTimeSlotAvailable = (time: string) => {
        // Aqui você pode adicionar lógica para verificar se o horário está disponível (Faremos isto nas próximas aulas)
        // Por exemplo, verificar se já existe uma consulta agendada para este horário
        return true;
    };

    return (
        <Container>
            <Title>Selecione o Médico</Title>
            <DoctorList>
                {doctors.map((doctor) => (
                    <DoctorCard
                        key={doctor.id}
                        selected={selectedDoctor === doctor.id}
                        onPress={() => setSelectedDoctor(doctor.id)}
                    >
                        <DoctorImage source={{ uri: doctor.image }} />
                        <DoctorInfo>
                            <DoctorName>{doctor.name}</DoctorName>
                            <DoctorSpecialty>{doctor.specialty}</DoctorSpecialty>
                        </DoctorInfo>
                    </DoctorCard>
                ))}
            </DoctorList>

            <Title>Data e Hora</Title>
            <RNDateTimePicker value={new Date(parseInt(dateInput))} onChange={(e) => setDateInput(e.nativeEvent.timestamp.toString())} mode='date' />

            <TimeSlotsContainer>
                <TimeSlotsTitle>Horários Disponíveis:</TimeSlotsTitle>
                <TimeSlotsGrid>
                    {timeSlots.map((time) => {
                        const isAvailable = isTimeSlotAvailable(time);
                        return (
                            <TimeSlotButton
                                key={time}
                                selected={selectedTime === time}
                                disabled={!isAvailable}
                                onPress={() => isAvailable && setSelectedTime(time)}
                            >
                                <TimeSlotText selected={selectedTime === time} disabled={!isAvailable}>
                                    {time}
                                </TimeSlotText>
                            </TimeSlotButton>
                        );
                    })}
                </TimeSlotsGrid>
            </TimeSlotsContainer>

            <Input
                placeholder="Descrição da consulta"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                containerStyle={InputContainer}
            />

            <SubmitButton
                title="Agendar Consulta"
                onPress={handleSubmit}
                buttonStyle={{
                    backgroundColor: theme.colors.primary,
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 20,
                }}
            />
        </Container>
    );
};

const Container = styled.View`
  padding: ${theme.spacing.medium}px;
`;

const Title = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.medium}px;
`;

const DoctorList = styled.ScrollView`
  margin-bottom: ${theme.spacing.large}px;
`;

const DoctorCard = styled(TouchableOpacity) <{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacing.medium}px;
  background-color: ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : theme.colors.white};
  border-radius: 8px;
  margin-bottom: ${theme.spacing.medium}px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
`;

const DoctorImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: ${theme.spacing.medium}px;
`;

const DoctorInfo = styled.View`
  flex: 1;
`;

const DoctorName = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
`;

const DoctorSpecialty = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
`;

const TimeSlotsContainer = styled.View`
  margin-bottom: ${theme.spacing.large}px;
`;

const TimeSlotsTitle = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.small}px;
`;

const TimeSlotsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${theme.spacing.small}px;
`;

const TimeSlotButton = styled(TouchableOpacity) <{ selected: boolean; disabled: boolean }>`
  background-color: ${(props: { selected: boolean; disabled: boolean }) =>
        props.disabled
            ? theme.colors.background
            : props.selected
                ? theme.colors.primary
                : theme.colors.white};
  padding: ${theme.spacing.small}px ${theme.spacing.medium}px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${(props: { selected: boolean; disabled: boolean }) =>
        props.disabled
            ? theme.colors.background
            : props.selected
                ? theme.colors.primary
                : theme.colors.text};
  opacity: ${(props: { disabled: boolean }) => props.disabled ? 0.5 : 1};
`;

const TimeSlotText = styled(Text) <{ selected: boolean; disabled: boolean }>`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${(props: { selected: boolean; disabled: boolean }) =>
        props.disabled
            ? theme.colors.text
            : props.selected
                ? theme.colors.white
                : theme.colors.text};
`;

const InputContainer = {
    marginBottom: theme.spacing.medium,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.medium,
};

const SubmitButton = styled(Button)`
  margin-top: ${theme.spacing.large}px;
`;

export default AppointmentForm;