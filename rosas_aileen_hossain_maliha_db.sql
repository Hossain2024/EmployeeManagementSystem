CREATE DATABASE Emp_Management;
USE Emp_Management;

CREATE TABLE Department(
	DepartmentID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	Dept_Name VARCHAR(50) NOT NULL,
	Dept_Description VARCHAR(50) NOT NULL,
	Num_Of_Employees INT NOT NULL,
	CONSTRAINT unique_name UNIQUE (Dept_Name),
	CONSTRAINT check_num_of_employees CHECK (Num_Of_Employees >= 0)
);

CREATE TABLE Role (
	RoleID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	RoleName  VARCHAR(50) NOT NULL, 
	Role_Description VARCHAR(50) NOT NULL
);

CREATE TABLE RoleDepartment(
  RoleID INT NOT NULL,
  DepartmentID INT NOT NULL,
  Skill VARCHAR(50),
  FOREIGN KEY (RoleID) REFERENCES Role(RoleID),
  FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID),
  PRIMARY KEY (RoleID, DepartmentID)
);

CREATE TABLE Emp_Position(
	RoleID INT NOT NULL, 
	Level INT, 
	FOREIGN KEY (RoleID) REFERENCES Role(RoleID),
	PRIMARY KEY (RoleID)
);

CREATE TABLE Country(
	CountryID INT NOT NULL PRIMARY KEY,
	Name VARCHAR(50) NOT NULL 
);

CREATE TABLE State(
	StateID INT NOT NULL,
	CountryID INT NOT NULL,
	StateName VARCHAR(50) NOT NULL,
	FOREIGN KEY (CountryID) REFERENCES Country(CountryID),
	PRIMARY KEY (StateID, CountryID)
);

CREATE TABLE City(
	CityID INT NOT NULL, 
	StateID INT NOT NULL,
	CountryID INT NOT NULL,
	Name VARCHAR(50) NOT NULL, 
	FOREIGN KEY (StateID, CountryID) REFERENCES State(StateID, CountryID),
	PRIMARY KEY(CityID, StateID) 
);

CREATE TABLE ZipCode(
	ZipCodeID INT NOT NULL,
	Number INT NOT NULL,
	PRIMARY KEY(ZipCodeID)
);

CREATE TABLE Street(
	StreetID INT NOT NULL, 
	ZipCodeID INT NOT NULL,
	CityID INT NOT NULL,
	StateID INT NOT NULL,
	CountryID INT NOT NULL,
	Address VARCHAR(50) NOT NULL,
	FOREIGN KEY (CityID, StateID) REFERENCES City(CityID, StateID),
	FOREIGN KEY(CountryID) REFERENCES Country(CountryID),
	FOREIGN KEY (ZipCodeID) REFERENCES ZipCode(ZipCodeID),
	Primary KEY(StreetID, ZipCodeID, CityID)
);

CREATE TABLE Schedule(
	ScheduleID INT NOT NULL,
    StartShift TIME,
    EndShift TIME, 
    StartDay ENUM('Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
    EndDay ENUM('Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
    PRIMARY KEY(ScheduleID)
);

CREATE TABLE AttendanceStatus(
	AttendanceID INT NOT NULL,
	Status ENUM('OOF','ACTIVE') NOT NULL,
	PRIMARY KEY(AttendanceID)
);

CREATE TABLE Employee(
	EmployeeID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FirstName  VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Gender VARCHAR(50) NOT NULL,
    DOB DATE NOT NULL, 
    JoinDate DATE NOT NULL,
    Ethnicity VARCHAR(50) NOT NULL,
    Street_ID INT NOT NULL,
    City_ID INT NOT NULL,
	ZipCodeID INT NOT NULL,
    Schedule_ID INT NOT NULL,
    Role_ID INT NOT NULL,
    CountryID INT NOT NULL,
    AttendanceID INT DEFAULT NULL,
    Emp_Status ENUM('ACTIVE','DEACTIVATED') NOT NULL,
    
    CONSTRAINT unique_name UNIQUE (FirstName, LastName),
    FOREIGN KEY (CountryID) REFERENCES Country(CountryID),
	FOREIGN KEY (Schedule_ID) REFERENCES Schedule(ScheduleID),
    FOREIGN KEY (Street_ID, ZipCodeID, City_ID) REFERENCES Street(StreetID, ZipCodeID, CityID),
    FOREIGN KEY (AttendanceID) REFERENCES AttendanceStatus(AttendanceID)
);

CREATE TABLE Promotion(
	PromotionID INT NOT NULL,
	Role_Name VARCHAR(50),
	PRIMARY KEY (PromotionID)
);

CREATE TABLE Demotion(
	DemotionID INT NOT NULL,
	Role_Name VARCHAR(50),
	PRIMARY KEY(DemotionID)
);

CREATE TABLE Employee_Promotion(
	EmpPromotionID INT NOT NULL, 
	EmployeeID INT NOT NULL, 
	PromotionID INT NOT NULL, 
	Effective_Date DATE NOT NULL,
	Prev_Role VARCHAR(50), 
	PRIMARY KEY(EmpPromotionID),
	FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
	FOREIGN KEY (PromotionID) REFERENCES Promotion(PromotionID)
);

CREATE TABLE Employee_Demotion(
	EmpDemotionID INT NOT NULL, 
	EmployeeID INT NOT NULL, 
	DemotionID INT NOT NULL, 
	Effective_Date DATE NOT NULL,
	Prev_Role VARCHAR(50), 
	PRIMARY KEY(EmpDemotionID),
	FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
	FOREIGN KEY (DemotionID) REFERENCES Demotion(DemotionID)
);


CREATE TABLE Project (
	ProjectID INT NOT NULL,
	DepartmentID INT NOT NULL,
	Name Varchar(50),
	Start_Date DATE, 
	Delivery_Date DATE, 
	Status VARCHAR(50) NOT NULL,
	PRIMARY KEY (ProjectID),
	FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
);

CREATE TABLE TRAINING(
	TrainingID INT NOT NULL,
	ProjectID INT NOT NULL,
	Title VARCHAR(50) NOT NULL,
	Duration TIME,
	Description VARCHAR(50),
	FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID),
	PRIMARY KEY(TrainingID, ProjectID)
);

CREATE TABLE EmpTraining (
    EmployeeID INT NOT NULL,
    TrainingID INT NOT NULL,
    ProjectID INT NOT NULL,
    Status VARCHAR(50) NOT NULL,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
    FOREIGN KEY (TrainingID, ProjectID) REFERENCES Training(TrainingID, ProjectID),
    PRIMARY KEY (EmployeeID, TrainingID)
);

CREATE TABLE BUILDING (
	BuildingID INT NOT NULL,
	Number INT NOT NULL,
	UNIQUE (Number),
	PRIMARY KEY(BuildingID)
);

CREATE TABLE Floor(
	FloorID INT NOT NULL,
	BuildingID INT NOT NULL,
	FloorNumber INT NOT NULL, 
	UNIQUE(FloorNumber), 
	FOREIGN KEY (BuildingID) REFERENCES Building(BuildingID),
	PRIMARY KEY(FloorID, BuildingID) 
);

CREATE TABLE Room (
	RoomID INT NOT NULL, 
	FloorID INT NOT NULL,
	BuildingID INT NOT NULL,
	RoomNumber INT NOT NULL, 
	UNIQUE(RoomNumber),
	FOREIGN KEY (FloorID, BuildingID) REFERENCES Floor(FloorID, BuildingID),
	PRIMARY KEY(RoomID, FloorID)
);

CREATE TABLE Assigned_Project(
	EmployeeID INT NOT NULL,
	ProjectID INT NOT NULL,
	Assigned_Date DATE,
	PRIMARY KEY(EmployeeID, ProjectID),
	FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
	FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)
);

CREATE TABLE Email(
	EmailAdress VARCHAR(50), 
	EmployeeID INT NOT NULL,
	Type VARCHAR(50), 
	FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
	PRIMARY KEY(EmailAdress, EmployeeID)
);

CREATE TABLE Phone(
	PhoneNumber VARCHAR(50), 
	EmployeeID INT NOT NULL,
	Type VARCHAR(50),
	FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
	PRIMARY KEY(PhoneNumber, EmployeeID)
);

CREATE TABLE Evaluation(
	EvaluationPeriod INT NOT NULL,
	EmployeeID INT NOT NULL,
	Comments VARCHAR(50),
	Areas_of_growth VARCHAR(50), 
	FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
	PRIMARY KEY(EvaluationPeriod, EmployeeID)
);

CREATE TABLE CompanyAsset(
	CompanyAssetID INT NOT NULL,
	Item VARCHAR(50),
	PRIMARY KEY (CompanyAssetID)
);

CREATE TABLE BorrowedItems(
	CompanyAssetID INT NOT NULL,
	EmployeeID INT NOT NULL,
	Assinged_Date DATE  NOT NULL,
	Return_Date DATE NULL,
	FOREIGN KEY (CompanyAssetID) REFERENCES CompanyAsset(CompanyAssetID),
	FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
	PRIMARY KEY(CompanyAssetID,EmployeeID)
);

CREATE TABLE LeaveType(
	LeaveTypeID INT NOT NULL,
	Type VARCHAR(50), 
	Description VARCHAR(50),
	MaxDays INT NOT NULL,
	PRIMARY KEY(LeaveTypeID)
);

CREATE TABLE LeaveRequest(
	LeaveRequestID INT NOT NULL,
	EmployeeID INT NOT NULL,
	LeavetypeID INT NOT NULL,
	StartDate DATE,
	EndDate DATE,
	Reason VARCHAR(50),
	Status ENUM('Approved', 'Denied'),
	FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
	FOREIGN KEY (LeaveTypeID) REFERENCES LeaveType(LeaveTypeID),
	PRIMARY KEY(LeaveRequestID)
);

CREATE TABLE PackageType(
	Title VARCHAR(50),
	Item VARCHAR(50),
	UNIQUE(Title),
	PRIMARY KEY(Title)
);

CREATE TABLE Benifit_Item(
	ItemID Int NOT NULL,
	Item_Name VARCHAR(50) NOT NULL,
	PRIMARY KEY(ItemID)
);

CREATE TABLE Assigned_benifits(
	Employee_ID INT NOT NULL,
	ItemID INT NOT NULL,
	Foreign KEY (Employee_ID) REFERENCES Employee(EmployeeID),
	Foreign KEY (ItemID) REFERENCES Benifit_Item(ItemID),
	PRIMARY KEY (Employee_ID, ItemID)
);

CREATE TABLE EmployeeResignation(
	Employee_ID INT NOT NULL,
	ResignationID INT NOT NULL,
	Date DATE NOT NULL,
	Reason VARCHAR(50),
	Foreign KEY (Employee_ID) REFERENCES Employee(EmployeeID),
	PRIMARY KEY (Employee_ID, ResignationID)
);

-- Inserting data
INSERT INTO Department (Dept_Name, Dept_Description, Num_Of_Employees) VALUES
('HR', 'Human Resources', 10),
('IT', 'Information Technology', 25),
('Finance', 'Financial Management', 15),
('Marketing', 'Marketing and Sales', 12),
('Operations', 'Operational Management', 20),
('Legal', 'Legal Affairs', 5),
('Customer Support', 'Customer Service', 18),
('Engineering', 'Software Engineering', 30),
('Research', 'Research and Development', 8),
('Administration', 'Administrative Services', 7);

INSERT INTO Role (RoleName, Role_Description) VALUES
('Manager', 'Oversees department'),
('Developer', 'Develops software'),
('Analyst', 'Analyzes data'),
('Accountant', 'Manages accounts'),
('HR Specialist', 'Handles HR tasks'),
('Marketer', 'Handles marketing strategies'),
('Operations Manager', 'Manages operations'),
('Legal Advisor', 'Handles legal matters'),
('Support Agent', 'Handles customer queries'),
('Researcher', 'Conducts research');

INSERT INTO RoleDepartment (RoleID, DepartmentID, Skill) VALUES
(1, 1, 'Leadership'),
(2, 2, 'Coding'),
(3, 3, 'Data Analysis'),
(4, 3, 'Accounting'),
(5, 1, 'Recruitment'),
(6, 4, 'SEO'),
(7, 5, 'Process Management'),
(8, 6, 'Legal Compliance'),
(9, 7, 'Customer Service'),
(10, 8, 'Innovation');


INSERT INTO Emp_Position (RoleID, Level)
VALUES
(1, 60),
(2, 62),
(3, 64);

INSERT INTO Country (CountryID, Name) VALUES
(1, 'United States');

INSERT INTO State (StateID, CountryID, StateName) VALUES
(1, 1, 'California'),
(2, 1, 'Texas'),
(3, 1, 'New York'),
(4, 1, 'Florida'),
(5, 1, 'Illinois'),
(6, 1, 'Ohio'),
(7, 1, 'Georgia'),
(8, 1, 'North Carolina'),
(9, 1, 'Michigan'),
(10, 1, 'Washington');

INSERT INTO City (CityID, StateID, CountryID, Name) VALUES
(1, 1, 1, 'Los Angeles'),
(2, 2, 1, 'Houston'),
(3, 3, 1, 'New York City'),
(4, 4, 1, 'Miami'),
(5, 5, 1, 'Chicago'),
(6, 6, 1, 'Columbus'),
(7, 7, 1, 'Atlanta'),
(8, 8, 1, 'Charlotte'),
(9, 9, 1, 'Detroit'),
(10, 10, 1, 'Seattle');

INSERT INTO ZipCode (ZipCodeID, Number) VALUES
(1, 90001),
(2, 77001),
(3, 10001),
(4, 33101),
(5, 60601),
(6, 43201),
(7, 30301),
(8, 28201),
(9, 48201),
(10, 98101);

INSERT INTO Street (StreetID, ZipCodeID, CityID, StateID, CountryID, Address) VALUES
(1, 1, 1, 1, 1, '123 Main St'),
(2, 2, 2, 2, 1, '456 Elm St'),
(3, 3, 3, 3, 1, '789 Oak St'),
(4, 4, 4, 4, 1, '101 Pine St'),
(5, 5, 5, 5, 1, '202 Maple St'),
(6, 6, 6, 6, 1, '303 Birch St'),
(7, 7, 7, 7, 1, '404 Cedar St'),
(8, 8, 8, 8, 1, '505 Spruce St'),
(9, 9, 9, 9, 1, '606 Walnut St'),
(10, 10, 10, 10, 1, '707 Cherry St');

INSERT INTO Schedule (ScheduleID, StartShift, EndShift, StartDay, EndDay) VALUES
(1, '09:00:00', '17:00:00', 'Monday', 'Friday'),
(2, '08:30:00', '16:30:00', 'Monday', 'Friday'),
(3, '10:00:00', '18:00:00', 'Monday', 'Friday'),
(4, '08:00:00', '16:00:00', 'Monday', 'Friday'),
(5, '09:30:00', '17:30:00', 'Monday', 'Friday'),
(6, '07:30:00', '15:30:00', 'Monday', 'Friday'),
(7, '09:00:00', '17:00:00', 'Monday', 'Thursday'),
(8, '10:00:00', '18:00:00', 'Tuesday', 'Thursday'),
(9, '08:00:00', '16:00:00', 'Wednesday', 'Friday'),
(10, '07:30:00', '15:30:00', 'Thursday', 'Friday');

INSERT INTO AttendanceStatus (AttendanceID, Status) VALUES
(1, 'ACTIVE'),
(2, 'OOF');

INSERT INTO Employee (FirstName, LastName, Gender, DOB, JoinDate, Ethnicity, Street_ID, City_ID, ZipCodeID, Schedule_ID, Role_ID, CountryID, AttendanceID, Emp_Status) VALUES
('John', 'Doe', 'Male', '1990-01-01', '2015-06-01', 'Caucasian', 1, 1, 1, 1, 1, 1, NULL, 'ACTIVE'),
('Jane', 'Smith', 'Female', '1985-05-15', '2012-09-23', 'Hispanic', 2, 2, 2, 2, 2, 1, NULL, 'ACTIVE'),
('James', 'Brown', 'Male', '1992-02-12', '2018-03-10', 'African American', 3, 3, 3, 3, 3, 1, NULL, 'ACTIVE'),
('Emily', 'Davis', 'Female', '1988-08-30', '2016-05-21', 'Asian', 4, 4, 4, 4, 4, 1, NULL, 'ACTIVE'),
('Michael', 'Miller', 'Male', '1995-11-05', '2019-01-15', 'Caucasian', 5, 5, 5, 5, 5, 1, NULL, 'ACTIVE'),
('Sarah', 'Wilson', 'Female', '1991-03-17', '2017-07-10', 'African American', 6, 6, 6, 6, 6, 1, NULL, 'DEACTIVATED'),
('David', 'Moore', 'Male', '1993-07-25', '2020-09-08', 'Hispanic', 7, 7, 7, 7, 7, 1, NULL, 'ACTIVE'),
('Laura', 'Taylor', 'Female', '1987-12-02', '2014-02-14', 'Asian', 8, 8, 8, 8, 8, 1, NULL, 'ACTIVE'),
('William', 'Anderson', 'Male', '1994-09-14', '2021-10-02', 'Caucasian', 9, 9, 9, 9, 9, 1, NULL, 'DEACTIVATED'),
('Sophia', 'Thomas', 'Female', '1990-04-27', '2013-08-11', 'African American', 10, 10, 10, 10, 10, 1, NULL, 'DEACTIVATED');

INSERT INTO Promotion (PromotionID, Role_Name) VALUES
(1, 'Manager'),
(2, 'Developer'),
(3, 'Analyst'),
(4, 'Accountant'),
(5, 'HR Specialist'),
(6, 'Marketer'),
(7, 'Operations Manager'),
(8, 'Legal Advisor'),
(9, 'Support Agent'),
(10, 'Researcher');

INSERT INTO Demotion (DemotionID, Role_Name) VALUES
(1, 'Manager'),
(2, 'Developer'),
(3, 'Analyst'),
(4, 'Accountant'),
(5, 'HR Specialist'),
(6, 'Marketer'),
(7, 'Operations Manager'),
(8, 'Legal Advisor'),
(9, 'Support Agent'),
(10, 'Researcher');

INSERT INTO Employee_Promotion (EmpPromotionID, EmployeeID, PromotionID, Effective_Date, Prev_Role) VALUES
(6, 6, 6, '2021-05-12', 'Operations Manager'),
(7, 7, 7, '2019-11-01', 'Legal Advisor'),
(8, 8, 8, '2021-03-08', 'Support Agent'),
(9, 9, 9, '2020-12-22', 'Researcher'),
(10, 10, 10, '2019-07-30', 'Manager');

INSERT INTO Employee_Demotion (EmpDemotionID, EmployeeID, DemotionID, Effective_Date, Prev_Role) VALUES
(1, 1, 1, '2022-04-12', 'Manager'),
(2, 2, 2, '2021-02-18', 'Developer'),
(3, 3, 3, '2020-09-05', 'Analyst'),
(4, 4, 4, '2019-11-22', 'Accountant'),
(5, 5, 5, '2021-07-15', 'HR Specialist');

INSERT INTO Project (ProjectID, DepartmentID, Name, Start_Date, Delivery_Date, Status) VALUES
(1, 1, 'Employee Satisfaction Survey', '2022-01-01', '2022-06-30', 'Completed'),
(2, 2, 'New Software Development', '2022-03-01', '2023-03-01', 'Ongoing'),
(3, 3, 'Annual Financial Audit', '2022-06-01', '2022-12-01', 'Completed'),
(4, 4, 'Brand Awareness Campaign', '2022-02-15', '2022-09-15', 'Ongoing'),
(5, 5, 'Operations Optimization', '2022-05-01', '2023-05-01', 'Ongoing'),
(6, 6, 'Legal Compliance Review', '2022-04-01', '2022-12-01', 'Completed'),
(7, 7, 'Customer Service Improvement', '2022-07-01', '2023-01-01', 'Ongoing'),
(8, 8, 'Product Research', '2022-08-01', '2023-02-01', 'Ongoing'),
(9, 9, 'Market Research Report', '2022-09-01', '2023-03-01', 'Completed'),
(10, 10, 'Innovation Initiative', '2022-11-01', '2023-06-01', 'Ongoing');

INSERT INTO TRAINING (TrainingID, ProjectID, Title, Duration, Description) VALUES
(1, 1, 'HR Best Practices', '02:00:00', 'Improving HR processes'),
(2, 2, 'Agile Development Training', '04:00:00', 'Learning Agile methodology'),
(3, 3, 'Financial Reporting', '03:00:00', 'Improving financial reports'),
(4, 4, 'Marketing Strategies', '02:30:00', 'Advanced marketing techniques'),
(5, 5, 'Operations Management', '05:00:00', 'Optimization in operations'),
(6, 6, 'Legal Compliance', '04:30:00', 'Understanding legal regulations'),
(7, 7, 'Customer Service Excellence', '03:00:00', 'Handling customer inquiries'),
(8, 8, 'Product Development', '03:30:00', 'Innovating new products'),
(9, 9, 'Market Analysis', '02:00:00', 'Techniques in market analysis'),
(10, 10, 'Innovation Management', '03:00:00', 'Leading innovation in business');

INSERT INTO EmpTraining (EmployeeID, TrainingID, ProjectID, Status) VALUES
(1, 1, 1, 'Completed'),
(2, 2, 2, 'Ongoing'),
(3, 3, 3, 'Completed'),
(4, 4, 4, 'Ongoing'),
(5, 5, 5, 'Completed'),
(6, 6, 6, 'Ongoing'),
(7, 7, 7, 'Completed'),
(8, 8, 8, 'Ongoing'),
(9, 9, 9, 'Completed'),
(10, 10, 10, 'Ongoing');

INSERT INTO BUILDING (BuildingID, Number) VALUES
(1, 101),
(2, 102),
(3, 103),
(4, 104),
(5, 105),
(6, 106),
(7, 107),
(8, 108),
(9, 109),
(10, 110);

INSERT INTO Floor (FloorID, BuildingID, FloorNumber) VALUES
(1, 1, 1),
(2, 4, 2),
(3, 5, 3);

INSERT INTO Room (RoomID, FloorID, BuildingID, RoomNumber) VALUES
(1, 1, 1, 101),
(2, 1, 1, 102),
(3, 1, 1, 103);

INSERT INTO Assigned_Project (EmployeeID, ProjectID, Assigned_Date) VALUES
(1, 1, '2023-01-15'),
(2, 2, '2023-02-10'),
(3, 3, '2023-03-05'),
(4, 4, '2023-04-20'),
(5, 5, '2023-05-25');

INSERT INTO Email (EmailAdress, EmployeeID, Type) VALUES
('johndoe@example.com', 1, 'Work'),
('janesmith@example.com', 2, 'Personal'),
('jamesbrown@example.com', 3, 'Work'),
('emilydavis@example.com', 4, 'Personal'),
('michaelmiller@example.com', 5, 'Work'),
('sarahwilson@example.com', 6, 'Personal'),
('davidmoore@example.com', 7, 'Work'),
('laurataylor@example.com', 8, 'Personal'),
('williamanderson@example.com', 9, 'Work'),
('sophiathomas@example.com', 10, 'Personal');

INSERT INTO Phone (PhoneNumber, EmployeeID, Type) VALUES
('555-0101', 1, 'Mobile'),
('555-0102', 2, 'Home'),
('555-0103', 3, 'Mobile'),
('555-0104', 4, 'Home'),
('555-0105', 5, 'Mobile'),
('555-0106', 6, 'Home'),
('555-0107', 7, 'Mobile'),
('555-0108', 8, 'Home'),
('555-0109', 9, 'Mobile'),
('555-0110', 10, 'Home');

INSERT INTO Evaluation (EvaluationPeriod, EmployeeID, Comments, Areas_of_growth) VALUES
(1, 2, 'Great performance', 'Leadership skills'),
(2, 4, 'Good teamwork', 'Time management'),
(3, 6, 'Excellent results', 'Communication skills'),
(4, 9, 'Good problem-solving', 'Attention to detail');

INSERT INTO CompanyAsset (CompanyAssetID, Item) VALUES
(1, 'Laptop'),
(2, 'Desk Phone'),
(3, 'Monitor'),
(4, 'Office Chair'),
(5, 'Keyboard'),
(6, 'Mouse'),
(7, 'Tablet'),
(8, 'Headphones'),
(9, 'Printer');

INSERT INTO BorrowedItems (CompanyAssetID, EmployeeID, Assinged_Date, Return_Date) VALUES
(1, 1, '2023-01-10', NULL),
(2, 2, '2023-02-15', NULL),
(3, 3, '2023-03-20', NULL),
(4, 4, '2023-04-25', NULL),
(5, 5, '2023-05-30', NULL);

INSERT INTO LeaveType (LeaveTypeID, Type, Description, MaxDays) VALUES
(1, 'Vacation', 'Paid time off for vacation', 15),
(2, 'Sick', 'Paid time off for illness', 10),
(3, 'Personal', 'Unpaid time off for personal reasons', 5),
(4, 'Maternity', 'Paid time off for maternity leave', 30),
(5, 'Paternity', 'Paid time off for paternity leave', 15),
(6, 'Bereavement', 'Paid time off for death of a close relative', 5),
(7, 'Jury Duty', 'Paid time off for jury duty', 10),
(8, 'Unpaid', 'Unpaid leave for any reason', 0),
(9, 'Public Holiday', 'Paid time off for public holidays', 12),
(10, 'Compensatory', 'Time off for working overtime', 7);

INSERT INTO LeaveRequest (LeaveRequestID, EmployeeID, LeavetypeID, StartDate, EndDate, Reason, Status)  VALUES
(1, 1, 1, '2023-06-01', '2023-06-05', 'Vacation', 'Approved'),
(2, 2, 2, '2023-07-01', '2023-07-03', 'Medical', 'Denied'),
(3, 3, 3, '2023-08-10', '2023-08-12', 'Personal', 'Approved'),
(5, 5, 2, '2023-05-20', '2023-05-22', 'Sick Leave', 'Approved'),
(6, 6, 3, '2023-10-05', '2023-10-07', 'Personal', 'Approved');

INSERT INTO PackageType (Title, Item) VALUES
('Health Package', 'Medical Insurance'),
('Retirement Package', 'Pension Fund'),
('Travel Package', 'Flight Discounts'),
('Meal Package', 'Restaurant Coupons'),
('Fitness Package', 'Gym Membership'),
('Wellness Package', 'Therapy Sessions');

INSERT INTO Benifit_Item (ItemID, Item_Name) VALUES
(1, 'Medical Insurance'),
(2, 'Pension Fund'),
(3, 'Flight Discounts'),
(4, 'Restaurant Coupons'),
(5, 'Gym Membership'),
(6, 'Therapy Sessions');

INSERT INTO Assigned_benifits (Employee_ID, ItemID) VALUES
(1, 1),
(4, 2),
(10, 3),
(6, 4),
(2, 5),
(3, 6);

INSERT IGNORE INTO EmployeeResignation (Employee_ID, ResignationID, Date, Reason) VALUES
(3, 1, '2023-12-15', 'Personal Reasons'),
(7, 2, '2023-11-10', 'Better Opportunity'),
(4, 3, '2023-09-25', 'Health Issues');