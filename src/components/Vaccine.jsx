import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Table, Button, Form, Input,Space,message} from 'antd';
import {DeleteOutlined,EditOutlined} from "@ant-design/icons/lib/icons"
import "./modal.style.css";
import './vaccine.style.css';

function Vaccine() {
  const [vaccines, setVaccines] = useState([]);
  const [newVaccine, setNewVaccine] = useState({
    id: null,
    vaccineName: null,
    vaccineCode: null
  });
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [editVaccineData, setEditVaccineData] = useState({
    id: null,
    vaccineName: null,
    vaccineCode: null
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`https://vet-app-pmc9.onrender.com/vaccines/get`)
      .then(response => {
        setVaccines(response.data);
        console.log("Gelen Veriler:", response.data);
      })
      .catch(error => console.error(error));
      console.log(vaccines)
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVaccine((prevVac)=>({
      ...prevVac,
      [name]:value,
    }));
  }

  const handleEditClick = (vaccine) => {
    setEditingVaccine(vaccine);
    setEditVaccineData({
      id:vaccine.id,
      vaccineName:vaccine.vaccineName,
      vaccineCode:vaccine.vaccineCode
    })
    setIsModalOpen(true);
  }

  const handleUpdateChange = (name,value) => {
    setEditVaccineData((prevData)=>({
      ...prevData,
      [name]:value,
    }));
  };

  const handleUpdateVaccine = () => {
    const { id } = editingVaccine;
    axios.put(`https://vet-app-pmc9.onrender.com/vaccines/update/${id}`, editVaccineData)
      .then(response => {
        const updatedVaccines = vaccines.map(vaccine => (vaccine.id === id ? response.data : vaccine));
        setVaccines(updatedVaccines);
        setEditingVaccine(null);
        setEditVaccineData({
          id: null,
          vaccineName: null,
          vaccineCode: null
        });
        setIsModalOpen(false);
        message.success('Vaccine updated successfully!');
      })
      .catch((error) => {console.error(error);
        message.error('Failed to update vaccine.')});
  };

  const handleAddVaccine = () => {
    const{vaccineName,vaccineCode}= newVaccine;
    if(!vaccineName || !vaccineCode){
      message.warning('Please fill in all fields.');
      return;
    }
    axios.post('https://vet-app-pmc9.onrender.com/vaccines/add', newVaccine)
      .then(response => {
        setVaccines([...vaccines, response.data]);
        setNewVaccine({
          id: null,
          vaccineName: null,
          vaccineCode: null
        });
        message.success('Customer added successfully!');
      })
      .catch((error) => {
        console.error(error);
        message.error('Failed to add vaccine.');
      });
  };

  const handleDeleteVaccine = (id) => {
    axios.delete(`https://vet-app-pmc9.onrender.com/vaccines/delete/${id}`)
      .then(() => {
        setVaccines(vaccines.filter(vaccine => vaccine.id !== id))
        message.success('Vaccine deleted successfully!');
      })
      .catch((error) => {console.error(error);
        message.error('Failed to delete vaccine.')});
  };

  const dataSource = vaccines.map((vaccine) => ({
    key: vaccine.id,
    id: vaccine.id,
    vaccineName: vaccine.vaccineName,
    vaccineCode: vaccine.vaccineCode,
  }));

  const columns = [
    {
      title: 'Vaccine Name',
      dataIndex: 'vaccineName',
      key: 'vaccineName',
    },
    {
      title: 'Vaccine Code',
      dataIndex: 'vaccineCode',
      key: 'vaccineCode',
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
            onClick={() => handleDeleteVaccine(record.key)}
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
    <div className="vaccine-container">
      <h1 className='list-headers'>Vaccine List</h1>
      <br />
      <Table columns={columns} dataSource={dataSource} />
      <Modal
        className="Modal"
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Vaccine Modal"
      >
        <div className="ModalOverlay"></div>
        <div className="ModalContent">
          <h2 className="modalTitle">Edit Vaccine</h2>
          <br />
          <Form className="vaccineForm">
            <Form.Item className='form-item' label="Vaccine Name">
              <Input
                className='inputField'
                type="text"
                name="vaccineName"
                value={editVaccineData.vaccineName}
                onChange={(e) => handleUpdateChange('vaccineName', e.target.value)}
              />
            </Form.Item>
            <Form.Item className='form-item' label="Vaccine Code">
              <Input
                className='inputField'
                type="text"
                name="vaccineCode"
                value={editVaccineData.vaccineCode}
                onChange={(e) => handleUpdateChange('vaccineCode', e.target.value)}
              />
            </Form.Item>
            <div className='form-button'>
              <Button className="submitButton" onClick={handleUpdateVaccine}>
                Update Vaccine
              </Button>
              <Button className="cancelButton" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
      <Form onFinish={handleAddVaccine}>
        <h2 className='list-headers'>Add New Vaccine</h2>
        <br />
        <Form.Item label="Vaccine Name" name="vaccineName" className='form-item'>
          <Input
            type="text"
            name="vaccineName"
            placeholder="Vaccine Name"
            value={newVaccine.vaccineName}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label="Vaccine Code" name="vaccineCode" className='form-item'>
          <Input
            type="text"
            name="vaccineCode"
            placeholder="Vaccine Code"
            value={newVaccine.vaccineCode}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Button className="add-vaccine-button" type="primary" htmlType="submit" style={{ color: "black", borderStyle: "solid", borderColor: "black" }}>
          Add Vaccine
        </Button>
      </Form>
    </div>
  );
}

export default Vaccine;
