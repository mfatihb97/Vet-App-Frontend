import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Table, Button,  Form, Input, Select, Space,DatePicker ,message} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import './modal.style.css'
import './doctorAvailability.style.css'


function DoctorAvailability({ fetchDoctors }) {
  const [days, setDays] = useState([]);
  const [newDay, setNewDay] = useState({
    id: null,
    availableDays: null,
    doctor: null,
  });
  const [editingDay, setEditingDay] = useState(null);
  const [editDayData, setEditDayData] = useState({
    id: null,
    availableDays: null,
    doctor: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`https://vet-app-pmc9.onrender.com/vetAvailability/get`)
      .then(response => {
        setDays(response.data);
        console.log("Gelen Veriler:", response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const handleEditClick = (day) => {
    setEditingDay(day);
    setEditDayData({
      id: day.id,
      availableDays: day.availableDays,
      doctor: day.doctor.id,
    });
    setIsModalOpen(true);
  };

  const handleUpdateChange = (name,value) => {
    setEditDayData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateDay = () => {
    const { id } = editingDay;
    axios.put(`https://vet-app-pmc9.onrender.com/vetAvailability/update/${id}`, editDayData)
      .then(response => {
        const updatedDays = days.map(day => (day.id === id ? response.data : day));
        setDays(updatedDays);
        setEditingDay(null);
        setEditDayData({
          id: null,
          availableDays: null,
          doctor: null,
        });
        setIsModalOpen(false);
        message.success('Available date updated successfully!');
      })
      .catch((error) => {console.error(error);
        message.error('Failed to update date.')});
  };

  const handleAddDay = () => {
    const{availableDays,doctor} = newDay;
    if(!availableDays || !doctor){
      message.warning('Please fill in all fields.');
      return;
    }
    axios.post('https://vet-app-pmc9.onrender.com/vetAvailability/add', newDay)
      .then(response => {
        setDays([...days, response.data]);
        setNewDay({
          id:null,
          availableDays: null,
          doctor: null,
        });
        message.success('Available day added successfully!');
      })
      .catch((error) => {
        console.error(error);
        message.error('Failed to add new day.');
      });
  };

  const handleDeleteDay = (id) => {
    axios.delete(`https://vet-app-pmc9.onrender.com/vetAvailability/delete/${id}`)
      .then(() => {
        setDays(days.filter(day => day.id !== id))
        message.success('Date deleted successfully!');
      })
      .catch(error => {
        console.error(error)
        message.error('Failed to delete date.')
      });
  };

  const handleDoctorChange = (e) => {
    const selectedDoctorId = e.target.value;
    setNewDay((prevDoc) => ({
      ...prevDoc,
      doctor: selectedDoctorId,
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDay((prevDay) => ({
      ...prevDay,
      [name]: value,
    }));
  };

  const dataSource = days.map((day) => ({
    key: day.id,
    id:day.id,
    doctor: day.doctor.name,
    availableDays: day.availableDays,
  }));

  const columns = [
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Available Day',
      dataIndex: 'availableDays',
      key: 'availableDays',
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => handleDeleteDay(record.key)}
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
    {
      title: 'Update',
      dataIndex: 'update',
      key: 'update',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => handleEditClick(record)}
            icon={<EditOutlined />}
            size="small"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className='doctor-aDays-container'>
      <br/>
      <h1 className='list-headers'>Doctor Availability</h1>
      <br/>
      <Table columns={columns} dataSource={dataSource}/>
      <Modal
        className="Modal"
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Customer Modal"
      >
            <div className="ModalOverlay"></div>
            <div className='ModalContent'>
              <h2 className="modalTitle">Edit Availability</h2>
              <br/>
            <Form className='doctorAvForm'>
              <Form.Item className='form-item' label="Doctor">
                  <Select
                  className="doctorSelect"
                  placeholder="Select Doctor"
                  value={editDayData.doctor}
                  onChange={(value) => handleUpdateChange('doctor', value)}
                >
                  {fetchDoctors.map((doctor) => (
                    <Select.Option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            <Form.Item className='form-item' label="Available Day">
              <DatePicker
                value={editDayData.availableDays ? moment(editDayData.availableDays, 'YYYY-MM-DD') : null}
                onChange={(date, dateString) => handleUpdateChange('availableDays',dateString)}
                placeholder="Select Day"
                format="YYYY-MM-DD"
                style={{width:"120px"}}
                name="availableDays"
              />  
            </Form.Item>
              <div className='form-button'>
              <Button className="submitButton" onClick={handleUpdateDay}>
                  Update Day
                </Button>
                <Button className="cancelButton" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </Form>
          </div>  
        </Modal>
        <h2 className='list-headers'>Add New Day</h2>
        <br/>
      <Form onFinish={handleAddDay}>
          <Form.Item label="Doctor" name="doctor" className='form-item'>
            <Select
              className="doctor-select"
              placeholder="Select Doctor"
              value={newDay.doctor}
              onChange={(value) => handleDoctorChange({ target: { name: 'doctor', value } })}
            
            >
              <Select.Option value="">Select Doctor</Select.Option>
              {fetchDoctors.map((doctor) => (
                <Select.Option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        <Form.Item label="Available Day" name="availableDays" className='form-item'>
          <DatePicker
              value={editDayData.availableDays ? moment(editDayData.availableDays, 'YYYY-MM-DD') : null}
              onChange={(date, dateString) => handleInputChange({ target: { name: 'availableDays', value: dateString } })}
              placeholder="Select Day"
              format="YYYY-MM-DD"
              style={{width:"120px"}}
            />
        </Form.Item>
          <Button  type="primary" htmlType="submit" style={{color:"black",borderStyle:"solid",borderColor:"black"}}>
            Add Day
          </Button>  
      </Form>
    </div>
  );
}

export default DoctorAvailability;
