import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './doctor.style.css';
import './modal.style.css'
import Modal from 'react-modal';
import DoctorAvailability from './DoctorAvailability'
import { Table, Button, Form, Input,Space,Select,message} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import cities from "../data/cityData"

function Doctor({ fetchDoctors }) {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    id: null,
    name: null,
    phone: null,
    mail: null,
    address: null,
    city: null,
  });
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editDoctorData, setEditDoctorData] = useState({
    id: null,
    name: null,
    phone: null,
    mail: null,
    address: null,
    city: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`https://vet-app-pmc9.onrender.com/vets/get`)
      .then(response => setDoctors(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const handleEditClick = (doctor) => {
    setEditingDoctor(doctor);
    setEditDoctorData({
      id: doctor.id,
      name: doctor.name,
      phone: doctor.phone,
      mail: doctor.mail,
      address: doctor.address,
      city: doctor.city,
    });
    setIsModalOpen(true);
  };

  const handleUpdateChange = (name,value) => {
    setEditDoctorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateDoctor = () => {
    const { id } = editingDoctor;
    axios.put(`https://vet-app-pmc9.onrender.com/vets/update/${id}`, editDoctorData)
      .then(response => {
        const updatedDoctors = doctors.map(doctor => (doctor.id === id ? response.data : doctor));
        setDoctors(updatedDoctors);
        setEditingDoctor(null);
        setEditDoctorData({
          id: null,
          name: null,
          phone: null,
          mail: null,
          address: null,
          city: null,
        });
        setIsModalOpen(false);
        message.success('Doctor updated successfully!');
      })
      .catch((error) => {console.error(error);
       message.error('This doctor is already exists!')});
  };

  const handleAddDoctor = () => {
    const{name,phone,mail,address,city}=newDoctor;
    if(!name || !phone || !mail || !address || !city){
      message.warning('Please fill in all fields.');
      return;
    }
    axios.post('https://vet-app-pmc9.onrender.com/vets/add', newDoctor)
      .then(response => {
        setDoctors([...doctors, response.data]);
        setNewDoctor({
          id: null,
          name: null,
          phone: null,
          mail: null,
          address: null,
          city: null,
        });
        message.success('Doctor added successfully!');
      })
      .catch((error) => {
        console.error(error);
        message.error('Failed to add doctor.');
      });
  };

  const handleDeleteDoctor = (id) => {
    axios.delete(`https://vet-app-pmc9.onrender.com/vets/delete/${id}`)
      .then(() => {
        setDoctors(doctors.filter(doctor => doctor.id !== id))
        message.success('Doctor deleted successfully!');
      })
      .catch((error) => {console.error(error);
        message.error('Failed to delete doctor.')});
  };

  const doctorDataSource = doctors.map((doctor) => ({
    key: doctor.id,
    id: doctor.id,
    name: doctor.name,
    phone: doctor.phone,
    mail: doctor.mail,
    address: doctor.address,
    city: doctor.city,
  }));

  const doctorColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Mail',
      dataIndex: 'mail',
      key: 'mail',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
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
            size="mini"
            onClick={() => handleDeleteDoctor(record.key)}
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
            size="mini"
          />
        </Space>
      ),
    },
  ];
  
  return (
    <div className="doctor-container">
      <div className='doctor-list'>
      <h1 className='list-headers'>Doctor List</h1>
      <br/>
      <Table columns={doctorColumns} dataSource={doctorDataSource} />

      <Modal
        className="Modal"
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Doctor Modal"
      >
      <div className="ModalContent">
        <h2>Edit Doctor</h2>
        <Form className="doctorForm">
          <Form.Item label="Name" className="form-item">
            <Input
              type="text"
              name="name"
              value={editDoctorData.name}
              onChange={(e) => handleUpdateChange('name', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Phone" className="form-item">
            <Input
              type="text"
              name="phone"
              value={editDoctorData.phone}
              onChange={(e) => handleUpdateChange('phone', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Mail" className="form-item">
            <Input
              type="text"
              name="mail"
              value={editDoctorData.mail}
              onChange={(e) => handleUpdateChange('mail', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Address" className="form-item">
            <Input
              type="text"
              name="address"
              value={editDoctorData.address}
              onChange={(e) => handleUpdateChange('address', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="City" className="form-item">
              <Select
                className='inputField'
                name="city"
                value={editDoctorData.city}
                onChange={(value) => handleUpdateChange('city', value)}
                >
                {cities.map(city => (
                  <Select.Option key={city} value={city}>
                    {city}
                  </Select.Option>
                ))}
              </Select>
          </Form.Item>
          <div className="form-button">
            <Button className="submitButton" onClick={handleUpdateDoctor}>
              Update Doctor
            </Button>
            <Button className="cancelButton" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </Form>
        </div> 
      </Modal>
      <h2 className='list-headers'>Add New Doctor</h2>
      <br/>
      <Form style={{display:"flex",gap:"50px"}} onFinish={handleAddDoctor} className="addDoctorForm">
        <div>
        <Form.Item label="Name" name="name" className="form-item">
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={newDoctor.name}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label="Phone" name="phone" className="form-item">
          <Input
            type="text"
            name="phone"
            placeholder="Phone"
            value={newDoctor.phone}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label="Mail" name="mail" className="form-item">
          <Input
            type="text"
            name="mail"
            placeholder="Mail"
            value={newDoctor.mail}
            onChange={handleInputChange}
          />
        </Form.Item>
        </div>
        <div>
        <Form.Item label="Address" name="address" className="form-item">
          <Input
            type="text"
            name="address"
            placeholder="Address"
            value={newDoctor.address}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label="City" name="city" className="form-item">
              <Select
                className='inputField'
                name="city"
                value={newDoctor.city}
                onChange={(value) => handleInputChange({ target: { name: 'city', value } })}
                >
                {cities.map(city => (
                  <Select.Option key={city} value={city}>
                    {city}
                  </Select.Option>
                ))}
              </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" className='add-button'>
          Add Doctor
        </Button>
        </div>
      </Form>
      </div>
        <DoctorAvailability fetchDoctors={fetchDoctors} />
    </div>
  );
}

export default Doctor;
