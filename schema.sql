-- Step 0: Select or Create Database and Use It
DROP DATABASE IF EXISTS drug_dispense;
CREATE DATABASE IF NOT EXISTS drug_dispense;
USE drug_dispense;

-- Step 1: Drop tables if they exist (to avoid conflict if re-running script)
DROP TABLE IF EXISTS Doctor;
DROP TABLE IF EXISTS Patient;
DROP TABLE IF EXISTS Pharmacist;
DROP TABLE IF EXISTS User;


-- Step 1: Create the Subtype Table `Doctor`
CREATE TABLE Doctor (
    id INT AUTO_INCREMENT PRIMARY KEY,
	fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
	gender VARCHAR(10) NOT NULL,
    contact_info VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_register DATE DEFAULT (CURRENT_DATE),
    specialization VARCHAR(100),
    license_number VARCHAR(50) UNIQUE,
    status ENUM("Available", "Unavailable"),
    user_status varchar(255) GENERATED ALWAYS AS ('User') VIRTUAL
);

-- Step 2: Create the Subtype Table `Patient`
CREATE TABLE Patient (
    id INT AUTO_INCREMENT PRIMARY KEY,
	fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
	gender VARCHAR(10) NOT NULL,
	date_of_birth DATE,
    contact_info VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_register DATE DEFAULT (CURRENT_DATE),
    address VARCHAR(255),
    emergency_contact VARCHAR(255),
    user_status varchar(255) GENERATED ALWAYS AS ('User') VIRTUAL
);

-- Step 3: Create the Subtype Table `Pharmacist`
CREATE TABLE Pharmacist (
    id INT AUTO_INCREMENT PRIMARY KEY,
	fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
	gender VARCHAR(10) NOT NULL,
    contact_info VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_register DATE DEFAULT (CURRENT_DATE),
    license_number VARCHAR(50) UNIQUE,
    work_shift ENUM('Morning', 'Afternoon', 'Night'),
    status ENUM("Available", "Unavailable"),
    user_status varchar(255) GENERATED ALWAYS AS ('User') VIRTUAL
);

-- Drop tables if they exist to prevent conflicts on re-run
DROP TABLE IF EXISTS Prescription;
DROP TABLE IF EXISTS PrescriptionQueue;
DROP TABLE IF EXISTS Record;
DROP TABLE IF EXISTS Medication;
DROP TABLE IF EXISTS Allergy;
DROP TABLE IF EXISTS Medication_detail;
DROP TABLE IF EXISTS Symptom_statement;

-- Create Medication Table
CREATE TABLE Medication (
    medication_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dosage_form VARCHAR(50),            -- e.g., tablet, capsule, liquid
    strength VARCHAR(50),               -- e.g., 500 mg
    quantity_in_stock INT DEFAULT 0,
    expiration_date DATE,
    manufacturer VARCHAR(255)
);

CREATE TABLE Prescription (
    prescription_id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,             -- References doctor 
    patient_id INT NOT NULL,            -- References patient 
    pharmacist_id INT NOT NULL,			-- References phramacist 
    date_issued DATE DEFAULT (CURRENT_DATE),
    status ENUM('Pending', 'Confirmed', 'Dispensed') DEFAULT 'Pending',
    notes TEXT,
    dosage_instructions TEXT,
    CONSTRAINT fk_PresDoc FOREIGN KEY (doctor_id) REFERENCES Doctor(id) ON DELETE CASCADE,
    CONSTRAINT fk_PresPatient FOREIGN KEY (patient_id) REFERENCES Patient(id) ON DELETE CASCADE,
    CONSTRAINT fk_PresParma FOREIGN KEY (pharmacist_id) REFERENCES Pharmacist(id) ON DELETE CASCADE
);

-- Create Symptom_statement Table
CREATE TABLE Symptom_statament(
	sym_id INT PRIMARY KEY auto_increment,
    patient_id INT NOT NULL,
    date_issued DATE DEFAULT (CURRENT_DATE),
	sym_description TEXT,
    CONSTRAINT fk_PatientSym FOREIGN KEY (patient_id) REFERENCES Patient(id) ON DELETE CASCADE
);

-- Create  Table Medication_detail
CREATE TABLE Medication_datail(
	med_detail_id INT PRIMARY KEY auto_increment,
    prescription_id INT,
    medication_id INT,
    CONSTRAINT fk_PresMeddetail FOREIGN KEY (prescription_id) REFERENCES Prescription(prescription_id),
    CONSTRAINT fk_MedMeddetail FOREIGN KEY (medication_id) REFERENCES Medication(medication_id)
);


INSERT INTO Doctor (id, fname, lname, gender, contact_info, email, password, specialization, license_number, status)
VALUES
(1, 'John', 'Doe', 'Male', '555-1234', 'johndoe@example.com', 'password123', 'Cardiology', 'DOC12345', 'Available'),
(2, 'Alice', 'Smith', 'Female', '555-5678', 'alicesmith@example.com', 'password456', 'Neurology', 'DOC12346', 'Available'),
(3, 'Bob', 'Brown', 'Male', '555-9012', 'bobbrown@example.com', 'password789', 'Pediatrics', 'DOC12347', 'Available'),
(4, 'Karen', 'Taylor', 'Female', '555-3456', 'karentaylor@example.com', 'password101', 'Dermatology', 'DOC12348', 'Available'),
(5, 'Michael', 'Johnson', 'Male', '555-6789', 'michaeljohnson@example.com', 'password102', 'Oncology', 'DOC12349', 'Available'),
(6, 'Emma', 'Davis', 'Female', '555-1122', 'emmadavis@example.com', 'password103', 'Orthopedics', 'DOC12350', 'Available'),
(7, 'James', 'Wilson', 'Male', '555-3344', 'jameswilson@example.com', 'password104', 'Psychiatry', 'DOC12351', 'Available'),
(8, 'Olivia', 'Miller', 'Female', '555-5566', 'oliviamiller@example.com', 'password105', 'Gynecology', 'DOC12352', 'Available'),
(9, 'William', 'Moore', 'Male', '555-7788', 'williammoore@example.com', 'password106', 'Surgery', 'DOC12353', 'Available'),
(10, 'Sophia', 'Anderson', 'Female', '555-9900', 'sophiaanderson@example.com', 'password107', 'Endocrinology', 'DOC12354', 'Available');

INSERT INTO Patient (id, fname, lname, gender, date_of_birth, contact_info, email, password, address, emergency_contact)
VALUES
(1, 'Ethan', 'Walker', 'Male', '1985-06-15', '555-0011', 'ethanwalker@example.com', 'securepass1', '123 Main St', '555-1011'),
(2, 'Mia', 'Hall', 'Female', '1990-03-22', '555-0022', 'miahall@example.com', 'securepass2', '456 Oak St', '555-2022'),
(3, 'Lucas', 'Young', 'Male', '1987-12-11', '555-0033', 'lucasyoung@example.com', 'securepass3', '789 Pine St', '555-3033'),
(4, 'Emma', 'Harris', 'Female', '1993-07-04', '555-0044', 'emmaharris@example.com', 'securepass4', '101 Maple St', '555-4044'),
(5, 'Noah', 'Clark', 'Male', '1989-09-16', '555-0055', 'noahclark@example.com', 'securepass5', '202 Birch St', '555-5055'),
(6, 'Sophia', 'Lewis', 'Female', '1992-11-20', '555-0066', 'sophialewis@example.com', 'securepass6', '303 Cedar St', '555-6066'),
(7, 'Liam', 'Robinson', 'Male', '1988-05-30', '555-0077', 'liamrobinson@example.com', 'securepass7', '404 Spruce St', '555-7077'),
(8, 'Ava', 'Walker', 'Female', '1991-08-15', '555-0088', 'avawalker@example.com', 'securepass8', '505 Elm St', '555-8088'),
(9, 'Oliver', 'White', 'Male', '1986-01-23', '555-0099', 'oliverwhite@example.com', 'securepass9', '606 Willow St', '555-9099'),
(10, 'Isabella', 'Martinez', 'Female', '1994-10-02', '555-0100', 'isabellamartinez@example.com', 'securepass10', '707 Aspen St', '555-0101');

INSERT INTO Pharmacist (id, fname, lname, gender, contact_info, email, password, license_number, work_shift, status)
VALUES
(1, 'Liam', 'Gray', 'Male', '555-1111', 'liamgray@example.com', 'pharma1', 'PHA10001', 'Morning', 'Available'),
(2, 'Sophia', 'Clark', 'Female', '555-2222', 'sophiaclark@example.com', 'pharma2', 'PHA10002', 'Afternoon', 'Available'),
(3, 'Mason', 'Hill', 'Male', '555-3333', 'masonhill@example.com', 'pharma3', 'PHA10003', 'Night', 'Available'),
(4, 'Ella', 'Scott', 'Female', '555-4444', 'ellascott@example.com', 'pharma4', 'PHA10004', 'Morning', 'Available'),
(5, 'James', 'Adams', 'Male', '555-5555', 'jamesadams@example.com', 'pharma5', 'PHA10005', 'Afternoon', 'Available'),
(6, 'Ava', 'Green', 'Female', '555-6666', 'avagreen@example.com', 'pharma6', 'PHA10006', 'Night', 'Available'),
(7, 'Ethan', 'Baker', 'Male', '555-7777', 'ethanbaker@example.com', 'pharma7', 'PHA10007', 'Morning', 'Available'),
(8, 'Olivia', 'Wright', 'Female', '555-8888', 'oliviawright@example.com', 'pharma8', 'PHA10008', 'Afternoon', 'Available'),
(9, 'Noah', 'King', 'Male', '555-9999', 'noahking@example.com', 'pharma9', 'PHA10009', 'Night', 'Available'),
(10, 'Emma', 'Allen', 'Female', '555-0000', 'emmaallen@example.com', 'pharma10', 'PHA10010', 'Morning', 'Available');

INSERT INTO Medication (name, description, dosage_form, strength, quantity_in_stock, expiration_date, manufacturer)
VALUES
('Paracetamol', 'Pain relief and fever reduction', 'Tablet', '500mg', 200, '2025-12-31', 'ABC Pharma'),
('Ibuprofen', 'Anti-inflammatory and pain relief', 'Capsule', '400mg', 150, '2026-06-30', 'XYZ Labs'),
('Amoxicillin', 'Antibiotic for bacterial infections', 'Liquid', '250mg/5ml', 300, '2024-10-15', 'MedHealth Inc.'),
('Ciprofloxacin', 'Antibiotic for infections', 'Tablet', '500mg', 100, '2025-05-20', 'GlobalPharm'),
('Metformin', 'Diabetes medication', 'Tablet', '850mg', 250, '2026-01-10', 'HealthGenix'),
('Atorvastatin', 'Cholesterol management', 'Tablet', '10mg', 180, '2026-11-25', 'Lifespan Pharma'),
('Omeprazole', 'Acid reflux treatment', 'Capsule', '20mg', 300, '2027-03-01', 'Acme Pharma'),
('Cetirizine', 'Allergy relief', 'Tablet', '10mg', 400, '2025-07-12', 'WellnessCorp'),
('Azithromycin', 'Antibiotic for infections', 'Tablet', '250mg', 120, '2025-08-08', 'PharmaPlus'),
('Aspirin', 'Pain relief and blood thinner', 'Tablet', '81mg', 500, '2025-09-18', 'HealthFirst');

INSERT INTO Prescription (doctor_id, patient_id, pharmacist_id, date_issued, status, notes, dosage_instructions)
VALUES
(1, 1, 1, '2024-11-20', 'Pending', 'Pain management', 'Take 1 tablet every 8 hours'),
(2, 2, 2, '2024-11-19', 'Confirmed', 'Antibiotic course', 'Take 2 capsules daily for 7 days'),
(3, 3, 3, '2024-11-18', 'Dispensed', 'Fever reduction', 'Take 1 tablet twice a day'),
(4, 4, 4, '2024-11-17', 'Pending', 'Allergy relief', 'Take 1 tablet at bedtime'),
(5, 5, 5, '2024-11-16', 'Dispensed', 'Diabetes management', 'Take 1 tablet with breakfast'),
(6, 6, 6, '2024-11-15', 'Confirmed', 'Acid reflux treatment', 'Take 1 capsule 30 minutes before meals'),
(7, 7, 7, '2024-11-14', 'Pending', 'Cholesterol control', 'Take 1 tablet at night'),
(8, 8, 8, '2024-11-13', 'Dispensed', 'Infection control', 'Take 1 tablet daily for 5 days'),
(9, 9, 9, '2024-11-12', 'Confirmed', 'Pain relief', 'Take 1 tablet as needed, up to 3 times a day'),
(10, 10, 10, '2024-11-11', 'Pending', 'General health', 'Take 1 tablet every morning');

INSERT INTO Symptom_statament (patient_id, date_issued, sym_description)
VALUES
(1, '2024-11-20', 'Fever and chills'),
(2, '2024-11-19', 'Severe headache and nausea'),
(3, '2024-11-18', 'Sore throat and cough'),
(4, '2024-11-17', 'Skin rash and itching'),
(5, '2024-11-16', 'Frequent urination and thirst'),
(6, '2024-11-15', 'Stomach pain and acid reflux'),
(7, '2024-11-14', 'Chest pain during exertion'),
(8, '2024-11-13', 'Nasal congestion and sneezing'),
(9, '2024-11-12', 'Joint pain and swelling'),
(10, '2024-11-11', 'Fatigue and dizziness');

INSERT INTO Medication_datail (prescription_id, medication_id)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);











