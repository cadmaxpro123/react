// DepartmentDetails.js
import React from 'react';
import SurveyForm from './workingdept/SurveyForm';
import ArchitectureForm from './workingdept/ArchitectureForm';
import UrbanForm from './workingdept/UrbanForm';
import EngineeringForm from './workingdept/EngineeringForm';
import JDAForm from './workingdept/JDAForm';
import GISForm from './workingdept/GISForm';
import SiteForm from './workingdept/SiteForm';
import AreaForm from './workingdept/AreaForm';
import SectorForm from './workingdept/SectorForm';
import PrintForm from './workingdept/PrintForm';

// Import other forms as necessary

const DepartmentDetails = ({ selectedDepartment }) => {
  switch (selectedDepartment) {
    case 'Survey Department':
      return <SurveyForm />;
    case 'Architecture Department':
      return <ArchitectureForm />;
    case 'Urban Planning Department':
      return <UrbanForm />;
    case 'Engineering Drawing Department':
      return <EngineeringForm />;
    case 'JDA Submission':
      return <JDAForm />;
    case 'GIS':
      return <GISForm />;
    case 'Site Plan':
      return <SiteForm />;
    case 'Area Conversion':
      return <AreaForm />;
    case 'Sector SuperImpose':
      return <SectorForm />;
    case 'Print':
      return <PrintForm />;
    // Add other cases as necessary
    default:
      return <div>Please select a department.</div>;
  }
};

export default DepartmentDetails;
