import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './animal.style.css';
import './modal.style.css'
import moment from 'moment';
import { Table, Button, Form, Input,Space ,Select,DatePicker,message} from 'antd';
import {DeleteOutlined,EditOutlined} from "@ant-design/icons/lib/icons"

Modal.setAppElement('#root');
const Animal = ({ customers }) => {
  const [animals, setAnimals] = useState([]);
  const [newAnimal, setNewAnimal] = useState({
    id: null,
    name: null,
    species: null,
    breed: null,
    gender: null,
    colour: null,
    birthday: null,
    customer: null
  });
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [editAnimalData, setEditAnimalData] = useState({
    id: null,
    name: null,
    species: null,
    breed: null,
    gender: null,
    colour: null,
    birthday: null,
    customer: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchAnimalName, setSearchAnimalName] = useState('');
  const [searchCustomerName, setSearchCustomerName] = useState('');

  useEffect(() => {
    axios.get(`https://vet-app-pmc9.onrender.com/animals/get`)
      .then(response => {
        setAnimals(response.data);
        console.log("Gelen Veriler:", response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnimal((prevAnimal) => ({
      ...prevAnimal,
      [name]: value,
    }));
  };
  const handleUpdateChange = (name,value) => {
    setEditAnimalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  

  const handleEditClick = (animal) => {
    setEditingAnimal(animal);
    setEditAnimalData({
      id: animal.id,
      name: animal.name,
      species: animal.species,
      breed: animal.breed,
      gender: animal.gender,
      colour: animal.colour,
      birthday: animal.birthday,
      customer: animal.customerid,
    });
    setIsModalOpen(true);
  };
  
  
  const handleOwnerChange = (e) => {
    const selectedCustomerId = e.target.value;
    setNewAnimal((prevAnimal) => ({
      ...prevAnimal,
      customer: selectedCustomerId,
    }));
  };

  const handleUpdateAnimal = () => {
    const { id } = editingAnimal;
    axios.put(`https://vet-app-pmc9.onrender.com/animals/update/${id}`, editAnimalData) 
      .then(response => {
        console.log('Güncellenmiş Hayvan Verisi:', response.data);
        const updatedAnimals = animals.map(animal => (animal.id === id ? response.data : animal));
        setAnimals(updatedAnimals);
        setEditingAnimal(null);
        setEditAnimalData({  
          id: null,
          name: null,
          species: null,
          breed: null,
          gender: null,
          colour: null,
          birthday: null,
          customer: null,
        });
        setIsModalOpen(false);
        message.success('Animal updated successfully!');
      })
      .catch(error => {
        console.error(error);
        message.error(error.response.data.message);
        console.log(error.response.data.message)
      });
  };

  const handleAddAnimal = () => {
    const { name, species, breed, gender, colour, birthday, customer } = newAnimal;
    if (!name || !species || !breed || !gender || !colour || !birthday || !customer) {
      message.warning('Please fill in all fields.');
      return;
    }
    axios.post(`https://vet-app-pmc9.onrender.com/animals/add`, newAnimal)
      .then(response => {
        setAnimals([...animals, response.data]);
        setNewAnimal({
          id: null,
          name: null,
          species: null,
          breed: null,
          gender: null,
          colour: null,
          birthday: null,
          customer: null,
        });
        message.success('Animal added successfully!');
      })
      .catch((error) => {
        console.error(error);
        message.error('This animal is already exists!');
      });
      
  };

  const handleDeleteAnimal = (id) => {
    axios.delete(`https://vet-app-pmc9.onrender.com/animals/delete/${id}`)
      .then(() => {
        setAnimals(animals.filter(animal => animal.id !== id));
        message.success('Animal deleted successfully!');
      })
      .catch(error => {
        console.error(error);
        message.error('Failed to delete animal.');
      });
  };
  const handleSearchAnimal = () => {
    axios.get(`https://vet-app-pmc9.onrender.com/animals/getByName/${searchAnimalName}`)
      .then(response => {
        const searchData = response.data; 
        setAnimals(searchData);
        console.log("Gelen Veri:", searchData);
      })
      .catch(error => {
        console.error(error);
        message.error('Error fetching animals.');
      });
  };

  const handleResetAnimal = () => {
    axios.get(`https://vet-app-pmc9.onrender.com/animals/get`)
      .then(response => {
        setAnimals(response.data);
      })
      .catch(error => console.error(error));
  };

  const handleSearchCustomer = () => {
    axios.get(`https://vet-app-pmc9.onrender.com/animals/getByCustomerName/${searchCustomerName}`)
      .then(response => {
        const searchData = response.data;
        setAnimals(searchData);
        console.log("Gelen Müşteri Verisi:", searchData);
      })
      .catch(error => {
        console.error(error);
        message.error('Error fetching animals.');
      });
  };

  const handleResetCustomer = () => {
    axios.get(`https://vet-app-pmc9.onrender.com/animals/get`)
      .then(response => {
        setAnimals(response.data);
      })
      .catch(error => console.error(error));
  };

  const animalDataSource = animals
    .map((animal) => ({
      key: animal.id,
      id: animal.id,
      name: animal.name,
      species: animal.species,
      breed: animal.breed,
      gender: animal.gender,
      colour: animal.colour,
      birthday: animal.birthday,
      customer: animal.customer.name,
    }));  
  const animalColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Species',
      dataIndex: 'species',
      key: 'species',
    },
    {
      title: 'Breed',
      dataIndex: 'breed',
      key: 'breed',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Colour',
      dataIndex: 'colour',
      key: 'colour',
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
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
          onClick={() => handleDeleteAnimal(record.key)}
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
    <div className="animal-container" >
      <h1 className='list-headers'>Animal List</h1>
      <br/>
      <Form.Item label="Animal Name" style={{ display: 'flex', gap: '10px', marginBottom: '10px',flexDirection:'column'}}>
      <div style={{display:'flex',gap:'10px'}}>
        <Input
          placeholder="Animal"
          value={searchAnimalName}
          onChange={(e) => setSearchAnimalName(e.target.value)}
          style={{width:"120px"}}

        />
          <Button type="primary" onClick={handleSearchAnimal} className='add-button'>Search</Button>
          <Button type="primary" onClick={handleResetAnimal} className='add-button'>Reset</Button>
        </div>
      </Form.Item>
      <Form.Item label="Customer Name" style={{ display: 'flex', gap: '10px', marginBottom: '10px'}}>
        <div style={{display:'flex',gap:'10px'}}>
          <Input
            placeholder="Customer"
            value={searchCustomerName}
            onChange={(e) => setSearchCustomerName(e.target.value)}
            style={{maxWidth:"100px"}}
          />
          <Button type="primary" onClick={handleSearchCustomer} className='add-button'>Search</Button>
          <Button type="primary" onClick={handleResetCustomer} className='add-button'>Reset</Button>
        </div>
      </Form.Item> 
      <br/>
      <Table columns={animalColumns} dataSource={animalDataSource} />
      <Modal
        className="Modal"
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Animal Modal"
      >
      <div className="ModalOverlay"></div>
      <div className="ModalContent">
        <h2 className="modalTitle">Edit Animal</h2>
        <br />
        <Form className="animalForm">
          <Form.Item className="form-item" label="Name">
            <Input
              className="inputField"
              type="text"
              name="name"
              value={editAnimalData.name}
              onChange={(e) => handleUpdateChange('name', e.target.value)}
            />
          </Form.Item>
          <Form.Item className="form-item" label="Species">
            <Input
              className="inputField"
              type="text"
              name="species"
              value={editAnimalData.species}
              onChange={(e) => handleUpdateChange('species', e.target.value)}
            />
          </Form.Item>
          <Form.Item className="form-item" label="Breed">
            <Input
              className="inputField"
              type="text"
              name="breed"
              value={editAnimalData.breed}
              onChange={(e) => handleUpdateChange('breed', e.target.value)}
            />
          </Form.Item>
          <Form.Item className="form-item" label="Gender">
            <Select
              className="selectField"
              name="gender"
              value={editAnimalData.gender}
              onChange={(value) => handleUpdateChange('gender', value)}
              placeholder="Select Gender"
            >
              <Select.Option value="MALE">MALE</Select.Option>
              <Select.Option value="FEMALE">FEMALE</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item className="form-item" label="Colour">
            <Input
              className="colorInput"
              type="text"
              name="colour"
              value={editAnimalData.colour}
              onChange={(e) => handleUpdateChange('colour', e.target.value)}
            />
          </Form.Item>
          <Form.Item className="form-item" label="Birthday" >
            <DatePicker
              className="datePicker"
              value={editAnimalData.birthday ? moment(editAnimalData.birthday, 'YYYY-MM-DD') : null}
              onChange={(date, dateString) => handleUpdateChange('birthday', dateString)}
              placeholder="Select Birthday"
              format="YYYY-MM-DD"
              name="birthday"
            />
          </Form.Item>
          <Form.Item className="form-item" label="Owner" >
            <Select
              className="ownerSelect"
              placeholder="Select Owner"
              value={editAnimalData.customer}
              onChange={(value) => handleUpdateChange('customer', value)}
              name="customer"
            >
              {customers.map((customer) => (
                <Select.Option key={customer.id} value={customer.id}>
                  {customer.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div className='form-button'>
            <Button className="submitButton" onClick={handleUpdateAnimal}>
              Update Animal
            </Button>
            <Button className="cancelButton" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
        <h2 className='list-headers'>Add New Animal</h2>
        <br/>
    <Form style={{display:"flex",gap:"50px"}} onFinish={handleAddAnimal} >
      <div>
        <Form.Item label="Name" name="name" className="form-item">
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={newAnimal.name}
            onChange={handleInputChange}
          />
        </Form.Item>  
        <Form.Item label="Species" name="species" className="form-item">
          <Input
            type="text"
            name="species"
            placeholder="Species"
            value={newAnimal.species}
            onChange={handleInputChange}
          />
        </Form.Item>     
        <Form.Item label="Breed" name="breed" className="form-item">
          <Input
            type="text"
            name="breed"
            placeholder="breed"
            value={newAnimal.breed}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label="Gender" name="gender" className="form-item">
          <Select
            value={newAnimal.gender}
            onChange={(value) => handleInputChange({ target: { name: 'gender', value } })}
            placeholder="Select Gender"
          >
            <Select.Option value="MALE">MALE</Select.Option>
            <Select.Option value="FEMALE">FEMALE</Select.Option>
          </Select>
        </Form.Item>
      </div>
      <div>

        <Form.Item label="Colour" name="colour" className="form-item">
          <Input
            type="text"
            name="colour"
            placeholder="colour"
            value={newAnimal.colour}
            onChange={handleInputChange}
           
          />
        </Form.Item>
        <Form.Item label="Birthday" name="birthday">
          <DatePicker
            value={newAnimal.birthday ? moment(newAnimal.birthday) : null}
            onChange={(date, dateString) => handleInputChange({ target: { name: 'birthday', value: dateString } })}
            placeholder="Select Birthday"
            format="YYYY-MM-DD"
            style={{width:"140px"}}
            
          />
        </Form.Item>
        <Form.Item label="Owner" name="customer" className="form-item">
          <Select
            className="owner-select"
            placeholder="Select Owner"
            value={newAnimal.customer}
            onChange={(value) => handleOwnerChange({ target: { name: 'customer', value } })}
           
          >
            <Select.Option value="">Select Owner</Select.Option>
            {customers.map((customer) => (
              <Select.Option key={customer.id} value={customer.id}>
                {customer.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Button  type="primary" htmlType="submit" className='add-button'>
          Add Animal
        </Button>  
      </div>
      </Form>
    </div>
  );
};

export default Animal;
