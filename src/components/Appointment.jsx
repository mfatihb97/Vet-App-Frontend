import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Table, Button, Form, Select,DatePicker,message, Input } from 'antd';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons/lib/icons";
import './modal.style.css'
import './form.style.css'
import './appointment.style.css'
import moment from 'moment';

function Appointment({ animals, fetchDoctors }) {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    id:null,
    appointmentDate: "",
    animal: "",
    doctor: ""
  });
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editAppointmentData, setEditAppointmentData] = useState({
    id:null,
    appointmentDate: "",
    animal: "",
    doctor: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchAnimalName,setSearchAnimalName]=useState('');
  const [searchDoctorName,setSearchDoctorName]=useState('');
  const [animalStart,setAnimalStart]=useState(null);
  const [animalEnd,setAnimalEnd]=useState(null);
  const [doctorStart,setDoctorStart]=useState(null);
  const [doctorEnd,setDoctorEnd]=useState(null);

  useEffect(() => {
    axios.get(`https://vet-app-pmc9.onrender.com/appointments/get`)
      .then(response => {
        setAppointments(response.data);
        console.log("Gelen Veriler:", response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const handleUpdateChange = (name,value) => {
    setEditAppointmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prevAnimal) => ({
      ...prevAnimal,
      [name]: value,
    }));
  };

  const handleEditClick = (appointment) => {
    setEditingAppointment(appointment);
    setEditAppointmentData({
      id:appointment.id,
      appointmentDate:appointment.appointmentDate,
      animal:appointment.animal,
      doctor:appointment.doctor
    });
    setIsModalOpen(true);
  }

  const handleUpdateAppointment = () => {
    const { id } = editingAppointment;
    axios.put(`https://vet-app-pmc9.onrender.com/appointments/update/${id}`, editAppointmentData)
      .then(response => {
        const updatedAppointments = appointments.map(appointment => (appointment.id === id ? response.data : appointment));
        setAppointments(updatedAppointments);
        setEditingAppointment(null);
        setEditAppointmentData({
          id:null,
          appointmentDate: "",
          animal: "",
          doctor: ""
        });
        setIsModalOpen(false);
        message.success('Appointment updated successfully!');
      })
      .catch((error) => {console.error(error);
        message.error('Failed to update appointment.')});
  };

  const handleAddAppointment = () => {
    const {appointmentDate,animal,doctor}=newAppointment;
    if(!appointmentDate || !animal || !doctor){
      message.warning('Please fill in all fields.');
      return;
    }
    axios.post('https://vet-app-pmc9.onrender.com/appointments/add', newAppointment)
      .then(response => {
        setAppointments([...appointments, response.data]);
        setNewAppointment({
          id:null,
          appointmentDate: "",
          animal: "",
          doctor: ""
        });
        message.success('Appointment added successfully!');
      })
      .catch((error) => {
        console.error(error);
        message.error('Failed to add appointment.');
      });
  };

  const handleDeleteAppointment = (id) => {
    axios.delete(`https://vet-app-pmc9.onrender.com/appointments/delete/${id}`)
      .then(() => {
        setAppointments(appointments.filter(appointment => appointment.id !== id))
        message.success('Appointment deleted successfully!');
      })
      .catch((error) => {console.error(error);
        message.error('Failed to delete appointment.')});
  };

  const handleSearchAnimal = () => {
    axios.get(`https://vet-app-pmc9.onrender.com/appointments/getByAnimalNameBetween?startDate=${animalStart}&endDate=${animalEnd}&animalName=${searchAnimalName}`)
      .then(response => {
        const searchData = response.data; 
        setAppointments(searchData);
        console.log("Gelen Veri:", searchData);
      })
      .catch(error => {
        console.error(error);
        message.error('Error fetching animals.');
      });
  };

  const handleResetAnimal = () => {
    axios.get('https://vet-app-pmc9.onrender.com/appointments/get')
      .then(response => {
        setAppointments(response.data);
      })
      .catch(error => console.error(error));
  };

  const handleSearchDoctor = () => {
    axios.get(`https://vet-app-pmc9.onrender.com/appointments/getByDoctorNameBetween?startDate=${doctorStart}&endDate=${doctorEnd}&doctorName=${searchDoctorName}`)
      .then(response => {
        const searchData = response.data; 
        setAppointments(searchData);
        console.log("Gelen Veri:", searchData);
      })
      .catch(error => {
        console.error(error);
        message.error('Error fetching animals.');
      });
  };

  const handleResetDoctor = () => {
    axios.get('https://vet-app-pmc9.onrender.com/appointments/get')
      .then(response => {
        setAppointments(response.data);
      })
      .catch(error => console.error(error));
  };

  const appointmentDataSource = appointments.map((appointment) => ({
    key: appointment.id,
    id:appointment.id,
    appointmentDate: appointment.appointmentDate,
    animal: appointment.animal.name,
    doctor: appointment.doctor.name,
  }));

  const appointmentColumns = [
    {
      title: 'Appointment Date',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
    },
    {
      title: 'Animal',
      dataIndex: 'animal',
      key: 'animal',
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      render: (_, record) => (
        <Button
          type="primary"
          danger
          size="small"
          onClick={() => handleDeleteAppointment(record.key)}
          icon={<DeleteOutlined />}
        />
      ),
    },
    {
      title: 'Update',
      dataIndex: 'update',
      key: 'update',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleEditClick(record)}
          icon={<EditOutlined />}
          size="small"
        />
      ),
    },
  ];
  return (
    <div className='appointment-container'>
      <h1 className='list-headers'>Appointment List</h1>
      <br/>
    <div style={{display:"flex",gap:"10px"}}>
        <Form.Item label="Animal Name">
          <Input
            placeholder='Animal Name'
            value={searchAnimalName}
            onChange={(e) => setSearchAnimalName(e.target.value)}
          />
        </Form.Item>
          <Form.Item label="Search Start Day">
            <DatePicker
              placeholder='Search Start'
              value={animalStart ? moment(animalStart,'YYYY-MM-DD'):null}
              onChange={(date,dateString)=> setAnimalStart(dateString)}
            />
          </Form.Item>
          <Form.Item label="Search End Day">
            <DatePicker
              placeholder='Search End'
              value={animalEnd ? moment(animalEnd,'YYYY-MM-DD'):null}
              onChange={(date,dateString)=> setAnimalEnd(dateString)}
            />
          </Form.Item>
          <Button type="primary" onClick={handleSearchAnimal} className='add-button'>Search</Button>
          <Button type="primary" onClick={handleResetAnimal} className='add-button'>Reset</Button>
    </div>
      <div style={{display:"flex",gap:"10px"}}>
        <Form.Item label="Doctor Name">
          <Input
            placeholder='Doctor Name'
            value={searchDoctorName}
            onChange={(e) => setSearchDoctorName(e.target.value)}
          />
        </Form.Item>
          <Form.Item label="Search Start Day">
            <DatePicker
              placeholder='Search Start'
              value={doctorStart ? moment(doctorStart,'YYYY-MM-DD'):null}
              onChange={(date,dateString)=> setDoctorStart(dateString)}
            />
          </Form.Item>
          <Form.Item label="Search End Day">
            <DatePicker
              placeholder='Search End'
              value={doctorEnd ? moment(doctorEnd,'YYYY-MM-DD'):null}
              onChange={(date,dateString)=> setDoctorEnd(dateString)}
            />
          </Form.Item>
          <Button type="primary" onClick={handleSearchDoctor} className='add-button'>Search</Button>
          <Button type="primary" onClick={handleResetDoctor} className='add-button'>Reset</Button>
      </div>
      <Table columns={appointmentColumns} dataSource={appointmentDataSource} />
      <Modal
        className="Modal"
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Appointment Modal"
      >
        <div className='ModalContent'>
        <h2>Edit Appointment</h2>
        <Form>
          <Form.Item label="Appointment Date"  >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              value={editAppointmentData.appointmentDate ? moment(editAppointmentData.appointmentDate,'YYYY-MM-DD HH:mm'):null}
              onChange={(date, dateString) => handleUpdateChange('appointmentDate', dateString)}
              name="appointmentDate"
            />
          </Form.Item>
          <Form.Item label="Animal"  className="form-item">
            <Select
              name="animal"
              value={editAppointmentData.animal}
              onChange={(value) => handleUpdateChange('animal',value)}
              placeholder="Select Animal"
            >
              {animals.map(animal => (
                <Select.Option key={animal.id} value={animal.id}>
                  {animal.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Doctor" className="form-item">
            <Select
              name="doctor"
              value={editAppointmentData.doctor}
              onChange={(value) => handleUpdateChange('doctor',value)}
              placeholder="Select Doctor"
            >
              {fetchDoctors.map(doctor => (
                <Select.Option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className='form-button'>
            <Button className="submitButton" type="primary" onClick={handleUpdateAppointment}>
              Update Appointment
            </Button>
            <Button className="cancelButton" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </Form>
        </div>
      </Modal>

        <h2 className='list-headers'>Add New Appointment</h2>
        <br/>
      <Form onFinish={handleAddAppointment}>

        <Form.Item label="Appointment Date" name="appointmentDate" >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              value={newAppointment.appointmentDate ? moment(newAppointment.appointmentDate,'YYYY-MM-DD HH:mm'):null}
              onChange={(date, dateString) => handleInputChange({ target: { name: 'appointmentDate', value: dateString } })}
              name="appointmentDate"
              style={{width:'120px',color:"black"}}
            />
        </Form.Item>

        <Form.Item label="Animal" name="animal" className="form-item">
          <Select
            placeholder="Select Animal"
            value={newAppointment.animal}
            onChange={(value) => setNewAppointment({ ...newAppointment, animal: value })}
          >
            {animals.map(animal => (
              <Select.Option key={animal.id} value={animal.id}>
                {animal.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Doctor" name="doctor" className="form-item">
          <Select
            placeholder="Select Doctor"
            value={newAppointment.doctor}
            onChange={(value) => setNewAppointment({ ...newAppointment, doctor: value })}
          >
            {fetchDoctors.map(doctor => (
              <Select.Option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit" className='add-button'>
          Add Appointment
        </Button>
      </Form>
    </div>
  );
}

export default Appointment;
