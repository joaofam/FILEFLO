// ?Built-in Dependencies
import React from 'react';

// MUI Components
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

// Internal Dependencies
import './About.css';

// Custom Accordion component with styling
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid \${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

// Custom AccordionSummary component with styling and expand icon
const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: '#2f3031',
  flexDirection: 'row-reverse',
  color: 'white',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

// Custom AccordionDetails component with styling
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '5px solid #9933ff',
  borderRadius: '5px',
  backgroundColor: '#3b3d3e',
}));

// Custom Typography component with styling
const CustomTypography = styled(Typography)(({ theme }) => ({
  color: '#fff',
  fontFamily: 'space-grotesk, monospace',
  '& b': {
    fontWeight: 'bold',
    color: '#bf80ff',
  },
}));

// Custom TypographyTitle component with styling
const CustomTypographyTitle = styled(Typography)(({ theme }) => ({
  color: '#fff',
  fontSize: '20px',
  fontFamily: 'space-grotesk, monospace',
  '& b': {
    fontWeight: 'bold',
    color: '#bf80ff',
  },
}));

// Main function for Customized Accordions
export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState('panel1');

  // Function to handle accordion expansion
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className="faq-box">
      <Typography
        sx={{
          fontFamily: 'space-grotesk, monospace',
          fontSize: '36px',
        }}
      >
        FAQ
      </Typography>
      {/* First Accordion */}
      <Accordion
        sx={{ backgroundColor: '#2f3031', border: '1px solid #333333' }}
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <CustomTypographyTitle>
            What is <b>Fileflo</b>?
          </CustomTypographyTitle>
        </AccordionSummary>
        <AccordionDetails>
          <CustomTypography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
            lacus ex, sit amet blandit leo lobortis eget.
          </CustomTypography>
        </AccordionDetails>
      </Accordion>
      {/* Second Accordion */}
      <Accordion
        sx={{ backgroundColor: '#2f3031', border: '1px solid #333333' }}
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <CustomTypographyTitle>
            How does File <b>Upload</b> and <b>Download</b> work?
          </CustomTypographyTitle>
        </AccordionSummary>
        <AccordionDetails>
          <CustomTypography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
            lacus ex, sit amet blandit leo lobortis eget.
          </CustomTypography>
        </AccordionDetails>
      </Accordion>
      {/* Third Accordion */}
      <Accordion
        sx={{ backgroundColor: '#2f3031', border: '1px solid #333333' }}
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <CustomTypographyTitle>
            Is my <b>encryption key</b> (passphrase) <b>safe</b>?
          </CustomTypographyTitle>
        </AccordionSummary>
        <AccordionDetails>
          <CustomTypography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
            lacus ex, sit amet blandit leo lobortis eget.
          </CustomTypography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
