import React, {userState} from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import logo from './logo.svg';
import './App.css';
import reportWebVitals from './reportWebVitals';
import SideBar from "./SideBar.js";
import Contacts from "./Contacts.js";
import AddContact from "./AddContacts.js";
import DeleteContact from "./DeleteContacts.js";
import SearchContact from "./SearchContacts.js";
import { useState } from 'react';

function App() {
  const [contacts, setContacts] = useState([]);

  return (
    <Router>
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-3">
          <h1 className="text-center">Phone Contacts</h1>
          <Routes>
            <Route path="/" element={<div>Welcome to the contacts app!</div>}/>
            <Route path="/contacts" element={<Contacts 
              contacts={contacts}
              setContacts={setContacts}
            />}/>
            <Route path="/add-contact" element={<AddContact
              contacts={contacts}
              setContacts={setContacts}
            />} />
            <Route path="/deletecontact" element={<DeleteContact
              contacts={contacts}
              setContacts={setContacts}
            />} />
            <Route path="/searchContacts" element={<SearchContact
              contacts={contacts}
              setContacts={setContacts}
            />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
