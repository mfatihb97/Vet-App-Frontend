import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './customer.style.css';
import Modal from 'react-modal';
import { Table, Button, Form, Input, Space, Select, message } from 'antd';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons/lib/icons";
import "./modal.style.css";
import cities from '../data/cityData';


const Customer = () => {
  const [customers,setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    id: null,
    name: null,
    phone: null,
    mail: null,
    address: null,
    city: null,
  });

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editCustomerData, setEditCustomerData] = useState({
    id: null,
    name: null,
    phone: null,
    mail: null,
    address: null,
    city: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchCustomerName,setSearchCustomerName] = useState('')
  
 useEffect(()=>{
  axios.get(`https://vet-app-pmc9.onrender.com/customers/get`)
  .then(response =>{
    setCustomers(response.data);
    console.log(response.data)
  })
  .catch(error=> console.log(error))
 },[])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setEditCustomerData({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      mail: customer.mail,
      address: customer.address,
      city: customer.city,
    });
    setIsModalOpen(true);
  };

  const handleUpdateChange = (name, value) => {
    setEditCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateCustomer = () => {
    const { id } = editingCustomer;
    axios
      .put(`https://vet-app-pmc9.onrender.com/customers/update/${id}`, editCustomerData)
      .then((response) => {
        const updatedDataSource = customers.map((customer) =>
          customer.id === id ? response.data : customer
        );
        setCustomers(updatedDataSource);
        setEditingCustomer(null);
        setEditCustomerData({
          id: null,
          name: null,
          phone: null,
          mail: null,
          address: null,
          city: null,
        });
        setIsModalOpen(false);
        message.success('Customer updated successfully!');
      })
      .catch((error) => {
        console.error(error);
        message.error('This customer already exists!');
      });
  };

  const handleAddCustomer = () => {
    const { name, phone, mail, address, city } = newCustomer;
    if (!name || !phone || !mail || !address || !city) {
      message.warning('Please fill in all fields.');
      return;
    }
    axios
      .post(`https://vet-app-pmc9.onrender.com/customers/add`, newCustomer)
      .then((response) => {
        setCustomers([...customers, response.data]);
        setNewCustomer({
          id: null,
          name: '',
          phone: '',
          mail: '',
          address: '',
          city: null,
        });
        message.success('Customer added successfully!');
      })
      .catch((error) => {
        console.error(error);
        message.error('Failed to add customer.');
      });
  };

  const handleDeleteCustomer = (id) => {
    axios
      .delete(`https://vet-app-pmc9.onrender.com/customers/delete/${id}`)
      .then(() => {
        setCustomers(customers.filter((customer) => customer.id !== id));
        message.success('Customer deleted successfully!');
      })
      .catch((error) => {
        console.error(error);
        message.error('Failed to delete customer.');
      });
  };

  const handleSearchCustomer = () => {
    axios.get(`https://vet-app-pmc9.onrender.com/customers/getByName/${searchCustomerName}`)
      .then(response => {
        const searchData = response.data; 
        setCustomers(searchData);
        console.log("Gelen Veri:", searchData);
      })
      .catch(error => {
        console.error(error);
        message.error('Error fetching animals.');
      });
  };
  
  const handleResetCustomer = () => {
    axios.get(`https://vet-app-pmc9.onrender.com/customers/get`)
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => console.error(error));
  };
  
  const customerDataSource = customers
    .map((customer)=>({
      key:customer.id,
      id:customer.id,
      name:customer.name,
      phone:customer.phone,
      mail:customer.mail,
      address:customer.address,
      city:customer.city
    }))

  const columns = [
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
            onClick={() => handleDeleteCustomer(record.id)}
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
    <div className="customer-container">
      <h1 className='list-headers'>Customer List</h1>
      <br/>
      <Form.Item label="Customer Name" style={{ display: 'flex', gap: '10px', marginBottom: '10px',flexDirection:'column'}}>
      <div style={{display:'flex',gap:'10px'}}>
        <Input
          placeholder="Customer"
          value={searchCustomerName}
          onChange={(e) => setSearchCustomerName(e.target.value)}
          style={{width:"120px"}}

        />
          <Button type="primary" onClick={handleSearchCustomer} className='add-button'>Search</Button>
          <Button type="primary" onClick={handleResetCustomer} className='add-button'>Reset</Button>
        </div>
      </Form.Item>
      <br/>
      <Table columns={columns} dataSource={customerDataSource} />
      <Modal
        className="modal-customer"
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Customer Modal"
      >
        <div className="ModalOverlay"></div>
        <div className="ModalContent">
          <h2 className="modalTitle">Edit Customer</h2>
          <br />
          <Form className="customerForm">
            <Form.Item className='form-item' label="Name">
              <Input
                className='inputField'
                type="text"
                name="name"
                value={editCustomerData.name}
                onChange={(e) => handleUpdateChange('name', e.target.value)}
              />
            </Form.Item>
            <Form.Item className='form-item' label="Phone">
              <Input
                className='inputField'
                type="text"
                name="phone"
                value={editCustomerData.phone}
                onChange={(e) => handleUpdateChange('phone', e.target.value)}
              />
            </Form.Item>
            <Form.Item className='form-item' label="Mail">
              <Input
                className='inputField'
                type="text"
                name="mail"
                value={editCustomerData.mail}
                onChange={(e) => handleUpdateChange('mail', e.target.value)}
              />
            </Form.Item>
            <Form.Item className='form-item' label="Address">
              <Input
                className='inputField'
                type="text"
                name="address"
                value={editCustomerData.address}
                onChange={(e) => handleUpdateChange('address', e.target.value)}
              />
            </Form.Item>
            <Form.Item className='form-item' label="City">
              <Select
                className='inputField'
                name="city"
                value={editCustomerData.city}
                onChange={(value) => handleUpdateChange('city', value)}
              >
                {cities.map(city => (
                  <Select.Option key={city} value={city}>
                    {city}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <div className='form-button'>
              <Button className="submitButton" onClick={handleUpdateCustomer}>
                Update Customer
              </Button>
              <Button className="cancelButton" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
      <h2 className='list-headers'>Add New Customer</h2>
      <br/>
      <Form style={{display:"flex",gap:"50px"}} onFinish={handleAddCustomer}>
        <div>
          <Form.Item label="Name" name="name" className='form-item'>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={newCustomer.name}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Phone" name="phone" className='form-item' >
            <Input
              type="text"
              name="phone"
              placeholder="Phone"
              value={newCustomer.phone}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Mail" name="mail" className='form-item' >
            <Input
              type="text"
              name="mail"
              placeholder="Mail@blabla.com"
              value={newCustomer.mail}
              onChange={handleInputChange}
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Address" name="address" className='form-item'>
            <Input
              type="text"
              name="address"
              placeholder="Address"
              value={newCustomer.address}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="City" name="city" className='form-item'>
            <Select
              className='inputField'
              name="city"
              value={newCustomer.city}
              onChange={(value) => handleInputChange({ target: { name: 'city', value } })}
            >
              {cities.map(city => (
                <Select.Option key={city} value={city}>
                  {city}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button className="add-customer-button" type="primary" htmlType="submit" style={{color:"black",borderStyle:"solid",borderColor:"black"}}>
            Add Customer
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Customer;
