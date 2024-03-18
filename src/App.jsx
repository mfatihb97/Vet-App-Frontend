import { useEffect, useState } from 'react';
import Animal from './components/Animal'
import Customer from './components/Customer'
import Doctor from './components/Doctor';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route,useNavigate} from 'react-router-dom';
import axios from 'axios';
import Vaccine from './components/Vaccine';
import Vaccination from './components/Vaccination';
import Appointment from './components/Appointment';
import Reports from './components/Reports';
import {Menu} from "antd";
import {HomeOutlined,BaiduOutlined,DiscordOutlined,HeartOutlined,PushpinOutlined,ThunderboltOutlined,FormOutlined,EditOutlined  } from "@ant-design/icons/lib/icons"
import "../src/App.css"


function App() {
  
  return (
  <div style={{display:"flex",flexDirection:"column",flex:1,height:"100vh"}}>
    <div>
      <Header/> 
    </div>
    <div className='main-container'>
        <SideMenu/>
        <Content className="contents"/>
    </div>
  </div>  
  )
}

function Header(){
  return (
    <h1 style={{height:60,
      backgroundColor:"lightblue",
      color:"purple",display:"flex",
      justifyContent:"center",
      alignItems:"center",
      fontSize:24,
      fontWeight:"bold",
      borderBottom:"1px solid #000"}}>Veteriner Application</h1> 
  )
}

function SideMenu(){
  const navigate = useNavigate();
  return (
    <div className='side-menu'>
      <Menu 
      onClick={({key})=>{
        navigate(key)
      }}
      defaultSelectedKeys={[window.location.pathname]}
      items={[{label:"Home",key:"/",icon:<HomeOutlined/>},
      {label:"Animal",key:"/animals",icon:<BaiduOutlined />},
      {label:"Customer",key:"/customers",icon:<DiscordOutlined />},
      {label:"Doctor",key:"/doctors",icon:<HeartOutlined />},
      {label:"Vaccine",key:"/vaccines",icon:<PushpinOutlined />},
      {label:"Vaccination",key:"/vaccination",icon:<ThunderboltOutlined />},
      {label:"Report",key:"/report",icon:<FormOutlined />},
      {label:"Appointment",key:"/appointment",icon:<EditOutlined />},
    ]}> </Menu>
        
    </div>
  )
}
export default App

function Content() {
  const [customers,setCustomers]= useState([]);
  const [fetchDoctors,setFetchDoctors]=useState([]);
  const [vaccines,setVaccines]=useState([]);
  const [animals,setAnimals]=useState([]);
  const [appointments,setAppointments]=useState([])
  const [reports,setReports]=useState([])

  useEffect(() => {
    axios.get(`https://vet-app-pmc9.onrender.com/vets/get`)
      .then(response => {
        const newDoctors = response.data;
        if (newDoctors.length !== fetchDoctors.length) {
          setFetchDoctors(newDoctors);
        }
      })
      .catch(error => console.log(error));
  }, [fetchDoctors]);

  useEffect(() => {
    axios.get(`https://vet-app-pmc9.onrender.com/reports/get`)
      .then(response => {
        const newReports = response.data;
        if (newReports.length !== reports.length) {
          setReports(newReports);
        }
      })
      .catch(error => console.log(error));
  }, [reports]);

  useEffect(() => {
    axios.get(`https://vet-app-pmc9.onrender.com/appointments/get`)
      .then(response => {
        const newAppointments = response.data;
        if (newAppointments.length !== appointments.length) {
          setAppointments(newAppointments);
        }
      })
      .catch(error => console.log(error));
  }, [appointments]);

  useEffect(() => {
    axios.get(`https://vet-app-pmc9.onrender.com/animals/get`)
      .then(response => {
        const newAnimals = response.data;
        if (newAnimals.length !== animals.length) {
          setAnimals(newAnimals);
        }
      })
      .catch(error => console.log(error));
  }, [animals]);

  useEffect(() => {
    axios.get(`https://vet-app-pmc9.onrender.com/customers/get`)
      .then(response => {
        const newCustomers = response.data;
        if (newCustomers.length !== customers.length) {
          setCustomers(newCustomers);
        }
      })
      .catch(error => console.log(error));
  }, [customers]);
  
  useEffect(() => {
    axios.get(`https://vet-app-pmc9.onrender.com/vaccines/get`)
      .then(response => {
        const newVaccines = response.data;
        if (newVaccines.length !== vaccines.length) {
          setVaccines(newVaccines);
        }
      })
      .catch(error => console.log(error));
  }, [vaccines]);

  return (
    
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/animals" element={<Animal customers={customers}/>} />
        <Route path="/customers" element={<Customer/>} />
        <Route path="/doctors" element={<Doctor fetchDoctors={fetchDoctors} />}/>
        <Route path="/vaccines" element={<Vaccine/>}></Route>
        <Route path="/vaccination" element={<Vaccination animals={animals} vaccines={vaccines} reports={reports}/>}></Route>
        <Route path="/appointment" element={<Appointment fetchDoctors={fetchDoctors} animals={animals} /> }></Route>
        <Route path="/report" element={<Reports appointments={appointments}/>}></Route>
      </Routes>
    
  )
} 


