CREATE DATABASE Helperland;
use Helperland;
CREATE TABLE ServiceProviders(
	ServiceProviderID int NOT NULL PRIMARY KEY IDENTITY(1,1),
	FirstName varchar(50) NOT NULL,
	LastName varchar(50) NOT NULL,
	Email varchar(max) NOT NULL,
	[Password] varchar(16) NOT NULL,
	PhoneNumber int NOT NULL,
	BirthDate date,
	GenderID int,
	StreetName varchar(max),
	HouseNumber int,
	PostalCode int,
	CityID int,
	AverageRatings float NOT NULL DEFAULT 0,
	AccountStatusID int NOT NULL DEFAULT 0,
	AvatarID int NOT NULL DEFAULT 0
);

CREATE TABLE BookServices(
	ServiceID int NOT NULL PRIMARY KEY IDENTITY(1,1),
	CustomerID int NOT NULL,
	ServiceProviderID int,
	ServiceDate date NOT NULL,
	ServiceTime time NOT NULL,
	Comment varchar(max),
	HavePet int NOT NULL DEFAULT 0,
	AddressID int NOT NULL,
	PaymentAmount float NOT NULL,
	ServiceStatusID int NOT NULL DEFAULT 0,
	ReasonsForCancelledService varchar(max),
	RatingAfterService int,
	CommentAfterService varchar(max),
);

CREATE TABLE Customers(
	CustomerID int NOT NULL PRIMARY KEY IDENTITY(1,1),
	FirstName varchar(50) NOT NULL,
	LastName varchar(50) NOT NULL,
	Email varchar(max) NOT NULL,
	[Password] varchar(16) NOT NULL,
	PhoneNumber int NOT NULL,
	BirthDate date,
	AccountStatusID int NOT NULL DEFAULT 1,
);

CREATE TABLE CustomerAddress(
	AddressID int NOT NULL PRIMARY KEY IDENTITY(1,1),
	CustomerID int NOT NULL,
	StreetName varchar(max) NOT NULL,
	HouseNumber int NOT NULL,
	PostalCode int NOT NULL,
	CityID int NOT NULL,
	PhoneNumber int NOT NULL
);

CREATE TABLE Cities(
	CityID int NOT NULL PRIMARY KEY IDENTITY(1,1),
	CityName varchar(max) NOT NULL,
	NationID int NOT NULL
);

CREATE TABLE Nations(
	NationID int NOT NULL PRIMARY KEY IDENTITY(1,1),
	NationName varchar(max) NOT NULL
);

CREATE TABLE ExtraServices(
	ExtraServiceID int NOT NULL PRIMARY KEY IDENTITY(1,1),
	ExtraServiceName varchar(max) NOT NULL
);

CREATE TABLE BookedExtraServices(
	ServiceID int NOT NULL,
	ExtraServiceID int NOT NULL
);

CREATE TABLE AccountStatus(
	AccountStatusID int NOT NULL PRIMARY KEY IDENTITY(1,1),
	AccountStatus varchar(max) NOT NULL
);

CREATE TABLE ServiceStatus(
	ServiceStatusID int NOT NULL PRIMARY KEY IDENTITY(1,1),
	ServiceStatus varchar(max) NOT NULL
);

CREATE TABLE Gender(
	GenderID int NOT NULL PRIMARY KEY IDENTITY(1,1),
	Gender varchar(20) NOT NULL
);

CREATE TABLE FavouriteSP(
	CustomerID int NOT NULL,
	ServiceProviderID int NOT NULL
);

CREATE TABLE BlockedSP(
	CustomerID int NOT NULL,
	ServiceProviderID int NOT NULL
);

CREATE TABLE BlockedCustomer(
	ServiceProviderID int NOT NULL,
	CustomerID int NOT NULL
);

CREATE TABLE Avatar(
	AvatarID int NOT NULL PRIMARY KEY IDENTITY(1,1),
	AvatarImage varbinary(max) NOT NULL
);

CREATE TABLE Admin(
	AdminID int NOT NULL PRIMARY KEY IDENTITY(1,1),
	Email varchar(max) NOT NULL,
	[Password] varchar(max) NOT NULL
);



/*Service Provider*/
ALTER TABLE ServiceProviders
	ADD CONSTRAINT FK_SPGender
	FOREIGN KEY(GenderID) REFERENCES Gender(GenderID);

ALTER TABLE ServiceProviders
	ADD CONSTRAINT FK_SPCity
	FOREIGN KEY(CityID) REFERENCES Cities(CityID);
	
ALTER TABLE ServiceProviders
	ADD CONSTRAINT FK_SPAccountStatus
	FOREIGN KEY(AccountStatusID) REFERENCES AccountStatus(AccountStatusID);
	
ALTER TABLE ServiceProviders
	ADD CONSTRAINT FK_SPAvatar
	FOREIGN KEY(AvatarID) REFERENCES Avatar(AvatarID);



/*BookServices*/
ALTER TABLE BookServices
	ADD CONSTRAINT FK_CustomerBookService
	FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID);

ALTER TABLE BookServices
	ADD CONSTRAINT FK_SPBookService
	FOREIGN KEY (ServiceProviderID) REFERENCES ServiceProviders(ServiceProviderID);

ALTER TABLE BookServices
	ADD CONSTRAINT FK_AddressBookService
	FOREIGN KEY (AddressID) REFERENCES CustomerAddress(AddressID);
	
ALTER TABLE BookServices
	ADD CONSTRAINT FK_ServiceStatusBookService
	FOREIGN KEY (ServiceStatusID) REFERENCES ServiceStatus(ServiceStatusID);



/*Customer*/
ALTER TABLE Customers
	ADD CONSTRAINT FK_AccountStatusCustomer
	FOREIGN KEY (AccountStatusID) REFERENCES AccountStatus(AccountStatusID);



/*CustomerAddress*/
ALTER TABLE CustomerAddress
	ADD CONSTRAINT FK_CustomerCustomerAddress
	FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID);

ALTER TABLE CustomerAddress
	ADD CONSTRAINT FK_CityCustomerAddress
	FOREIGN KEY (CityID) REFERENCES Cities(CityID);



/*Cities*/
ALTER TABLE Cities
	ADD CONSTRAINT FK_NationCities
	FOREIGN KEY (NationID) REFERENCES Nations(NationID);



/*BookedExtraServices*/
ALTER TABLE BookedExtraServices
	ADD CONSTRAINT FK_ServicesBookedExtraServices
	FOREIGN KEY (ServiceID) REFERENCES BookServices(ServiceID);

ALTER TABLE BookedExtraServices
	ADD CONSTRAINT FK_ExtraServiceBookedExtraServices
	FOREIGN KEY (ExtraServiceID) REFERENCES ExtraServices(ExtraServiceID);



/*Favourite SP*/
ALTER TABLE FavouriteSP
	ADD CONSTRAINT FK_CustomerFavouriteSP
	FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID);

ALTER TABLE FavouriteSP
	ADD CONSTRAINT FK_ServiceProviderFavouriteSP
	FOREIGN KEY (ServiceProviderID) REFERENCES ServiceProviders(ServiceProviderID);



/*BlockedSP*/
ALTER TABLE BlockedSP
	ADD CONSTRAINT FK_CustomerBlockedSP
	FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID);

ALTER TABLE BlockedSP
	ADD CONSTRAINT FK_ServiceProviderBlockedSP
	FOREIGN KEY (ServiceProviderID) REFERENCES ServiceProviders(ServiceProviderID);



/*Blocked Customer*/
ALTER TABLE BlockedCustomer
	ADD CONSTRAINT FK_ServiceProviderBlockedCustomer
	FOREIGN KEY (ServiceProviderID) REFERENCES ServiceProviders(ServiceProviderID);

ALTER TABLE BlockedCustomer
	ADD CONSTRAINT FK_CustomerBlockedCustomer
	FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID);