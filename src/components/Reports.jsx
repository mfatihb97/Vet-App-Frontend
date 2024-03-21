import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './modal.style.css'
import './reports.style.css'
import moment from 'moment';
import { Table, Button, Form, Input,Select,message} from 'antd';
import {DeleteOutlined,EditOutlined} from "@ant-design/icons/lib/icons"

function Reports({ appointments }) {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({
    title: null,
    diagnosis: null,
    price: null,
    appointment: null,
  });
  const [editingReport, setEditingReport] = useState(null);
  const [editReportData, setEditReportData] = useState({
    title: null,
    diagnosis: null,
    price: null,
    appointment: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateChange = (name,value) => {
    setEditReportData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    axios.get(`https://vet-app-pmc9.onrender.com/reports/get`)
      .then(response => {
        setReports(response.data);
        console.log("Gelen Rapor Verileri:", response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const handleEditClick = (report) => {
    setEditingReport(report);
    setEditReportData({
      title:report.title,
      diagnosis:report.diagnosis,
      price:report.price,
      appointment:report.appointment
    });
    setIsModalOpen(true);
  }

  const handleUpdateReport = () => {
    const { id } = editingReport;
    axios.put(`https://vet-app-pmc9.onrender.com/reports/update/${id}`, editReportData)
      .then(response => {
        const updatedReports = reports.map(report => (report.id === id ? response.data : report))
        setReports(updatedReports)
        setEditingReport(null)
        setEditReportData({
          title: null,
          diagnosis: null,
          price: null,
          appointment: null,
        })
        setIsModalOpen(false);
        message.success('Report updated successfully!');
      })
      .catch((error) => {console.error(error);
        message.error('Failed to update report.')});
  }

  const handleAddReport = () => {
    const{title,diagnosis,price,appointment}= newReport;
    if(!title||!diagnosis||!price||!appointment){
      message.warning('Please fill in all fields.');
      return;
    }
    axios.post('https://vet-app-pmc9.onrender.com/reports/add', newReport)
      .then(response => {
        setReports([...reports, response.data]);
        setNewReport({
          id:null,
          title: null,
          diagnosis: null,
          price: null,
          appointment: null,
        });
        message.success('Report added successfully!');
      })
      .catch((error) => {
        console.error(error);
        message.error('Failed to add report.');
      });
  };

  const handleDeleteReport = (id) => {
    axios.delete(`https://vet-app-pmc9.onrender.com/reports/delete/${id}`)
      .then(() => {
        setReports(reports.filter(report => report.id !== id))
        message.success('Report deleted successfully!');
      })
      .catch((error) => {console.error(error);
        message.error('Failed to delete report.')});
  };

  const reportDataSource = reports.map((report) => ({
    key: report.id,
    id:report.id,
    title: report.title,
    diagnosis: report.diagnosis,
    price: report.price,
    appointment: report.appointment.appointmentDate,
  }));

  const reportColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Appointment Date',
      dataIndex: 'appointment',
      key: 'appointment',
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
          onClick={() => handleDeleteReport(record.key)}
          icon={<DeleteOutlined />}
        />
      ),
    },
    {
      title: 'Update',
      dataIndex: 'update',
      key: 'update',
      render: (_, record) => (
        <Button type="link" onClick={() => handleEditClick(record)} icon={<EditOutlined />} size="small" />
      ),
    },
  ];


  return (
    <div className="report-container">
      <h1 className='list-headers'>Reports</h1>
      <br/>
      <Table columns={reportColumns} dataSource={reportDataSource} />
      <Modal
        className="Modal"
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Report Modal"
      >
        <div className="ModalContent">
        <h2>Edit Report</h2>
        <Form>
          <Form.Item label="Title" className="form-item">
            <Input
              type="text"
              name="title"
              value={editReportData.title}
              onChange={(e) => handleUpdateChange('title', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Diagnosis" className="form-item">
            <Input
              type="text"
              name="diagnosis"
              value={editReportData.diagnosis}
              onChange={(e) => handleUpdateChange('diagnosis', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Price" className="form-item">
            <Input
              type="text"
              name="price"
              value={editReportData.price}
              onChange={(e) => handleUpdateChange('price', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Select Appointment" className="form-item">
            <Select
              value={editReportData.appointment}
              onChange={(value)=> handleUpdateChange('appointment',value)}
              placeholder="Select Appointment"
            >
              {appointments.map((appointment) => (
                <Option key={appointment.id} value={appointment.id}>
                  {moment(appointment.appointmentDate).format('YYYY-MM-DD')}
                </Option>
              ))}
            </Select>
          </Form.Item>
        <div className='form-button'> 
          <Button type="primary" onClick={handleUpdateReport} className="submitButton">
            Update Report
          </Button>
          <Button onClick={() => setIsModalOpen(false)} className="cancelButton">Cancel</Button>
        </div>
        </Form>
        </div>
      </Modal>

        <h2 className='list-headers'>Add New Report</h2>
        <br/>
      <Form style={{display:"flex",gap:"50px"}} onFinish={handleAddReport}>
        <div>
        <Form.Item label="Title" name="title" className="form-item">
          <Input
            type="text"
            name="title"
            placeholder="Title"
            value={newReport.title}
            onChange={handleInputChange}
          />
        </Form.Item>
        
        <Form.Item label="Diagnosis" name="diagnosis" className="form-item">
          <Input
            type="text"
            name="diagnosis"
            placeholder="Diagnosis"
            value={newReport.diagnosis}
            onChange={handleInputChange}
          />
        </Form.Item>
        </div>
        <div>
        <Form.Item label="Price" name="price" className="form-item">
          <Input
            type="text"
            name="price"
            placeholder="Price"
            value={newReport.price}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label="Select Appointment" name="appointment">
          <Select
            value={newReport.appointment}
            onChange={(value) => setNewReport({ ...newReport, appointment: value })}
            placeholder="Select Appointment"
            style={{width:120}}
          >
            {appointments.map((appointment) => (
              <Option key={appointment.id} value={appointment.id}>
                {moment(appointment.appointmentDate).format('YYYY-MM-DD')}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" className='add-button'>
          Add Report
        </Button>
        </div>
      </Form>
    </div>
  );
}

export default Reports;
