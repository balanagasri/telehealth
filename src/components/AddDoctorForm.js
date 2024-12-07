import React, { useState } from 'react';
import { db } from '../firebase'; // Import Firestore configuration
import { collection, addDoc } from 'firebase/firestore'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage
import { Form, Button, Alert } from 'react-bootstrap';

const AddDoctorForm = () => {
  const [doctorDetails, setDoctorDetails] = useState({
    name: '',
    specialty: '',
    experience: '',
    languages: '',
    license: '',
    livingPlace: '',
    profilePicture: null, // Store the file for profile picture
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [imageUrl, setImageUrl] = useState(''); // Store the URL of the uploaded image
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDoctorDetails((prevDetails) => ({
      ...prevDetails,
      profilePicture: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorDetails.profilePicture) {
      setError('Please upload a profile picture');
      return;
    }

    const storage = getStorage(); // Initialize Firebase Storage
    const storageRef = ref(storage, `doctorProfilePictures/${doctorDetails.profilePicture.name}`);
    
    // Upload the profile picture to Firebase Storage
    try {
      const snapshot = await uploadBytes(storageRef, doctorDetails.profilePicture);
      const downloadURL = await getDownloadURL(snapshot.ref); // Get the URL of the uploaded image
      setImageUrl(downloadURL); // Store the image URL

      const doctorData = {
        name: doctorDetails.name,
        specialty: doctorDetails.specialty,
        experience: doctorDetails.experience,
        languages: doctorDetails.languages,
        license: doctorDetails.license,
        livingPlace: doctorDetails.livingPlace,
        profilePicture: downloadURL, // Save the image URL to Firestore
      };

      // Add doctor details to Firestore
      await addDoc(collection(db, 'doctors'), doctorData);

      console.log('Doctor added successfully:', doctorData);
      setFormSubmitted(true); // Set form submission status to true
    } catch (error) {
      setError('Error uploading profile picture or saving doctor details');
      console.error('Error adding doctor:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 pt-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Add Doctor</h1>
      
      {formSubmitted ? (
        <Alert variant="success">Doctor added successfully!</Alert>
      ) : (
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={doctorDetails.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSpecialty">
            <Form.Label>Specialty</Form.Label>
            <Form.Control
              type="text"
              name="specialty"
              value={doctorDetails.specialty}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formExperience">
            <Form.Label>Experience</Form.Label>
            <Form.Control
              type="text"
              name="experience"
              value={doctorDetails.experience}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLanguages">
            <Form.Label>Languages</Form.Label>
            <Form.Control
              type="text"
              name="languages"
              value={doctorDetails.languages}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLicense">
            <Form.Label>License</Form.Label>
            <Form.Control
              type="text"
              name="license"
              value={doctorDetails.license}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLivingPlace">
            <Form.Label>Living Place</Form.Label>
            <Form.Control
              type="text"
              name="livingPlace"
              value={doctorDetails.livingPlace}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProfilePicture">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Add Doctor
          </Button>
        </Form>
      )}
    </div>
  );
};

export default AddDoctorForm;
