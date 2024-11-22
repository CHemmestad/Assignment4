import logo from './logo.svg';
import './App.css';
import AddContact from "./AddContacts.js";
import reportWebVitals from './reportWebVitals';
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
