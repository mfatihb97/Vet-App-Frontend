import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import moment from 'moment';
import { Table, Button, Select, DatePicker, Form, Space ,message,Input} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './vaccination.style.css'
import './modal.style.css'
function Vaccination({ animals, vaccines, reports }) {
  const [vaccinations, setVaccinations] = useState([]);
  const [newVaccination, setNewVaccination] = useState({
    id: null,
    prtStart: null,
    prtEnd: null,
    animal: "",
    vaccine: "",
    report: ""
  });
  const [editingVaccination, setEditingVaccination] = useState(null);
  const [editVaccinationData, setEditVaccinationData] = useState({
    id: null,
    prtStart: null,
    prtEnd: null,
    animal: "",
    vaccine: "",
    report: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchAnimalName, setSearchAnimalName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate,setEndDate] = useState(null)

  useEffect(() => {
      axios.get(`https://vet-app-pmc9.onrender.com/animalVaccines/get`)
        .then(response => {
          setVaccinations(response.data);
          console.log("Gelen Veriler:", response.data);
        })
        .catch(error => console.error(error));
    }, [vaccinations]);

  const handleEditClick = (vaccination) => {
    setEditingVaccination(vaccination);
    setEditVaccinationData({
      id:vaccination.id,
      prtStart:vaccination.prtStart,
      prtEnd:vaccination.prtEnd,
      animal:vaccination.animal.id,
      vaccine:vaccination.vaccine.id,
      report:vaccination.report.id
    });
    setIsModalOpen(true);
  }

  const handleUpdateChange = (name,value) => {
    setEditVaccinationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVaccination((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateVaccination = () => {
    const { id } = editingVaccination;
    axios.put(`https://vet-app-pmc9.onrender.com/animalVaccines/update/${id}`, editVaccinationData)
      .then(response => {
        const updatedVaccinations = vaccinations.map(vaccination => (vaccination.id === id ? response.data : vaccination))
        setVaccinations(updatedVaccinations);
        setEditingVaccination(null);
        setEditVaccinationData({
          prtStart: null,
          prtEnd: null,
          animal: "",
          vaccine: "",
          report: ""
        });
        setIsModalOpen(false);
        message.success('Vaccination updated successfully!');
      })
      .catch((error) => {console.error(error);
        message.error('Failed to update vaccination.')});
  }

  const handleAddVaccination = () => {
    const{prtStart,prtEnd,animal,vaccine,report}= newVaccination;
    if(!prtStart || !prtEnd || !animal || !vaccine || !report){
      message.warning('Please fill in all fields.');
      return;
    }
    axios.post('https://vet-app-pmc9.onrender.com/animalVaccines/add', newVaccination)
      .then(response => {
        setVaccinations([...vaccinations, response.data]);
        setNewVaccination({
          id:null,
          prtStart: null,
          prtEnd: null,
          animal: "",
          vaccine: "",
          report: ""
        });
        message.success('Vaccination added successfully!');
      })
      .catch((error) => {
        console.error(error);
        message.error('Failed to add vaccination.');
      });
  };

  const handleDeleteVaccination = (id) => {
    axios.delete(`https://vet-app-pmc9.onrender.com/animalVaccines/delete/${id}`)
      .then(() => {
        setVaccinations(vaccinations.filter(vaccination => vaccination.id !== id))
        message.success('Vaccination deleted successfully!');
      })
      .catch((error) => {console.error(error);
        message.error('Failed to delete vaccination.')});
  };
  const handleSearchAnimal = () => {
    axios.get(`https://vet-app-pmc9.onrender.com/animalVaccines/getByAnimalName/${searchAnimalName}`)
      .then(response => {
        const searchData = response.data; 
        setVaccinations(searchData);
        console.log("Gelen Veri:", searchData);
      })
      .catch(error => {
        console.error(error);
        message.error('Error fetching animals.');
      });
  };

  const handleResetVaccination = () => {
    axios.get('https://vet-app-pmc9.onrender.com/animalVaccines/get')
      .then(response => {
        setVaccinations(response.data);
      })
      .catch(error => console.error(error));
  };

  const handleSearchDate = () => {
    axios.get(`https://vet-app-pmc9.onrender.com/animalVaccines/getBetween?startDate=${startDate}&endDate=${endDate}`)
      .then(response => {
        const searchData = response.data; 
        setVaccinations(searchData);
        console.log("Gelen Veri:", searchData);
      })
      .catch(error => {
        console.error(error);
        message.error('Error fetching animals.');
      });
  };

  const handleResetDate = () => {
    axios.get('https://vet-app-pmc9.onrender.com/animalVaccines/get')
      .then(response => {
        setVaccinations(response.data);
      })
      .catch(error => console.error(error));
  };

  const vaccinationDataSource = vaccinations
    .map((vaccination) => ({
    key: vaccination.id,
    id:vaccination.id,
    animal: vaccination.animal.name,
    prtStart: vaccination.prtStart,
    prtEnd: vaccination.prtEnd,
    vaccine: vaccination.vaccine.vaccineName,
    report: vaccination.report.title,
  }));

  const vaccinationColumns = [
    {
      title: 'Animal',
      dataIndex: 'animal',
      key: 'animal',
    },
    {
      title: 'Start Date',
      dataIndex: 'prtStart',
      key: 'prtStart',
    },
    {
      title: 'End Date',
      dataIndex: 'prtEnd',
      key: 'prtEnd',
    },
    {
      title: 'Vaccine',
      dataIndex: 'vaccine',
      key: 'vaccine',
    },
    {
      title: 'Report',
      dataIndex: 'report',
      key: 'report',
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
            onClick={() => handleDeleteVaccination(record.key)}
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
    <div className='vaccination-container'>
      <br/>
      <h1 className='list-headers'>Vaccination Records</h1>
      <br/>
    <Form.Item label="Animal Name">
      <div style={{display:'flex',gap:'10px'}}>
        <Input
          placeholder="Animal"
          value={searchAnimalName}
          onChange={(e) => setSearchAnimalName(e.target.value)}
          style={{width:"120px"}}

        />
          <Button type="primary" onClick={handleSearchAnimal} className='add-button'>Search</Button>
          <Button type="primary" onClick={handleResetVaccination} className='add-button'>Reset</Button>
      </div>
    </Form.Item>
    <div style={{display:'flex',gap:'10px'}}>
      <Form.Item label="Protection Start" style={{ display: 'flex', marginBottom: '10px' }}>
          <DatePicker
            placeholder="Start Date"
            value={startDate ? moment(startDate,'YYYY-MM-DD'):null}
            onChange={(date,dateString) => setStartDate(dateString)}
            style={{width:"120px"}}
          />
      </Form.Item>
          <Form.Item label="Protection End">
                <DatePicker
                  placeholder="End Date"
                  value={endDate ? moment(endDate,'YYYY-MM-DD'):null}
                  onChange={(date,dateString) => setEndDate(dateString)}
                  style={{width:"120px"}}
                />
          </Form.Item>
                <Button type="primary" onClick={handleSearchDate} className='add-button'>Search</Button>
                <Button type="primary" onClick={handleResetDate} className='add-button'>Reset</Button>
      </div>
      <Table columns={vaccinationColumns} dataSource={vaccinationDataSource}/>
      <Modal
        className="Modal"
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Vaccination Modal"
      >
    <div className='ModalContent'>
        <h2>Edit Vaccination</h2>
        <br/>
      <Form className='vaccinationForm'>
        <Form.Item className="form-item" label="Protection Start Day" >
            <DatePicker
              className="datePicker"
              value={editVaccinationData.prtStart ? moment(editVaccinationData.prtStart, 'YYYY-MM-DD') : null}
              onChange={(date, dateString) => handleUpdateChange('prtStart', dateString)}
              placeholder="Protection Start"
              format="YYYY-MM-DD"
              name="prtStart"
              style={{width:"140px"}}
            />
        </Form.Item>
        <Form.Item  label="Protection End Day" >
            <DatePicker
              className="datePicker"
              value={editVaccinationData.prtEnd ? moment(editVaccinationData.prtEnd, 'YYYY-MM-DD') : null}
              onChange={(date, dateString) => handleUpdateChange('prtEnd', dateString)}
              placeholder="Protection End"
              format="YYYY-MM-DD"
              name="prtEnd"
              style={{width:"140px"}}
            />
        </Form.Item>
        <Form.Item className="form-item" label="Animal" >
            <Select
              className="animalSelect"
              placeholder="Select Animal"
              value={editVaccinationData.animal}
              onChange={(value) => handleUpdateChange('animal', value)}
              name="animal"
            >
              {animals.map((animal) => (
                <Select.Option key={animal.id} value={animal.id}>
                  {animal.name}
                </Select.Option>
              ))}
            </Select>
        </Form.Item>
        <Form.Item className="form-item" label="Vaccine" >
            <Select
              className="vaccineSelect"
              placeholder="Select Vaccine"
              value={editVaccinationData.vaccine}
              onChange={(value) => handleUpdateChange('vaccine', value)}
              name="vaccine"
            >
              {vaccines.map((vaccine) => (
                <Select.Option key={vaccine.id} value={vaccine.id}>
                  {vaccine.vaccineName}
                </Select.Option>
              ))}
            </Select>
        </Form.Item>
        <Form.Item className="form-item" label="Report" >
            <Select
              className="reportSelect"
              placeholder="Select Report"
              value={editVaccinationData.report}
              onChange={(value) => handleUpdateChange('report', value)}
              name="report"
            >
              {reports.map((report) => (
                <Select.Option key={report.id} value={report.id}>
                  {report.title}
                </Select.Option>
              ))}
            </Select>
        </Form.Item>
        <div className='form-button'>
            <Button className="submitButton" onClick={handleUpdateVaccination}>
              Update Vaccination
            </Button>
            <Button className="cancelButton" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
          </Form>
        </div>
      </Modal>

      <h2 className='list-headers'>Add New Vaccination</h2>
      <br/>         
      <Form style={{display:"flex",gap:"100px"}}  onFinish={handleAddVaccination}>
        <div>
        <Form.Item className="form-item" label="Protection Start Day" name="prtStart">
            <DatePicker
              className="datePicker"
              value={newVaccination.prtStart ? moment(newVaccination.prtStart, 'YYYY-MM-DD') : null}
              onChange={(date, dateString) => handleInputChange({ target: { name: 'prtStart', value: dateString } })}
              format="YYYY-MM-DD"
              style={{width:"120px"}}
            />
        </Form.Item>
        <Form.Item className="form-item" label="Protection End Day" name="prtEnd">
            <DatePicker
              className="datePicker"
              value={newVaccination.prtEnd ? moment(newVaccination.prtEnd, 'YYYY-MM-DD') : null}
              onChange={(date, dateString) => handleInputChange({ target: { name: 'prtEnd', value: dateString } })}
              format="YYYY-MM-DD"
              style={{width:"120px"}}
            />
        </Form.Item>
        <Form.Item className="form-item" label="Animal" name="animal">
            <Select
              className="animalSelect"
              placeholder="Select Animal"
              value={newVaccination.animal}
              onChange={(value) => handleInputChange({ target: { name: 'animal', value } })}
            >
              {animals.map((animal) => (
                <Select.Option key={animal.id} value={animal.id}>
                  {animal.name}
                </Select.Option>
              ))}
            </Select>
        </Form.Item>
        </div>
        <div>
        <Form.Item className="form-item" label="Vaccine" name="vaccine">
            <Select
              className="vaccineSelect"
              placeholder="Select Vaccine"
              value={newVaccination.vaccine}
              onChange={(value) => handleInputChange({ target: { name: 'vaccine', value } })}
            >
              {vaccines.map((vaccine) => (
                <Select.Option key={vaccine.id} value={vaccine.id}>
                  {vaccine.vaccineName}
                </Select.Option>
              ))}
            </Select>
        </Form.Item>
        <Form.Item className="form-item" label="Report" name="report">
            <Select
              className="reportSelect"
              placeholder="Select Report"
              value={newVaccination.report}
              onChange={(value) => handleInputChange({ target: { name: 'report', value } })}
            >
              {reports.map((report) => (
                <Select.Option key={report.id} value={report.id}>
                  {report.title}
                </Select.Option>
              ))}
            </Select>
        </Form.Item>
        <Button  type="primary" htmlType="submit" className='add-button'>
          Add Vaccination
        </Button>
        </div>  
      </Form>
    </div>
  );
}

export default Vaccination;
