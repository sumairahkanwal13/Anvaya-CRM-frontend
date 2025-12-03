# Anvaya CRM

A full-stack CRM system to create, manage, update, view, and delete leads.
Built with React, Node.js/Express, MongoDB .

---
## Demo Link

[Live Demo] (https://anvaya-crm-frontend-lilac.vercel.app/)

---
## Quick Start

```
git clone https://github.com/sumairahkanwal13/Anvaya-CRM-frontend.git
cd Anvaya_CRM
npm install
npm start
```

---

## Technologies

- React JS
- React Router
- Node.js
- Express
- MongoDB
- Bootstrap

---

## Demo Video
Watch a walkthrought (7:42 minutes) of all the major features of this app:
[Video Link] (https://drive.google.com/file/d/1buYtuCa2rWBNQFMGrEdT6Vl5F-Sc-RIA/view?usp=sharing)

---

## Features
**Home page**

- Displays sidebar with required CRM modules
- Show a dashboard with leads details and summary
- A form link so user can add new lead to the system

**lead List**

- Display list of all leads fetched from backend API
- View Details link is also available

**Lead View Details**

- Display all the lead detailes like: name, sales agent, source, status, and tags
- Comment section where user can read previous comments, and can sbmit new comment as well
- Edit button for editing the existing lead if needed

**Filter by Lead Status/ Sales Agent**

- Filter lead by lead status or asign agents

**Reports**

- Display system progress


---
## Api Reference

### **Get /leads/**<br>
List all leads<br>
Sample response<br>
```
[
  { "_id": "1", "name": "John Doe", "email": "john@gmail.com" }
]
```

### **POST /leads/**<br>
Create a lead<br>
Sample response<br>
```
{
  "message": "Lead created successfully",
  "lead": { "_id": "...", "name": "John Doe" }
}

```

### **Get /agents/**<br>
List all agents<br>
Sample response<br>
```
[
  { "_id": "1", "salesAgent": "John Doe", "email": "john@gmail.com" }
]
```

### **POST /agents/**<br>
Create a sales agent<br>
Sample response<br>
```
{
  "message": "Sales Agent created successfully",
  "lead": { "_id": "...", "name": "John Doe" }
}

```

---
## Contact
For bugs or features request, please reach out to sumairahkanwal33@gmail.com 
