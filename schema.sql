DROP DATABASE IF EXISTS website;

CREATE DATABASE website;

\c website;

CREATE TABLE IF NOT EXISTS users 
  (userId SERIAL PRIMARY KEY,
  email VARCHAR(30) UNIQUE,
  createdAt VARCHAR(30),
  password VARCHAR(64),
  displayName VARCHAR(64));

CREATE TABLE IF NOT EXISTS website   
  (websiteId SERIAL PRIMARY KEY,
  websiteName VARCHAR(30),
  baseUrl VARCHAR(30) UNIQUE,
  userId SERIAL references users(userId));

CREATE TABLE IF NOT EXISTS pages   
  (websiteId SERIAL references website(websiteID),
  route VARCHAR(30),    
  baseUrl VARCHAR(30),
  pageHits INT);

CREATE TABLE IF NOT EXISTS hits 
  (websiteId SERIAL references website(websiteID),
  visitors INTEGER,
  uniqueVisitors INTEGER,
  timeStamp VARCHAR(64),
  route VARCHAR(64));

CREATE TABLE IF NOT EXISTS session 
  (sessionId VARCHAR(64),
  websiteId SERIAL references website(websiteID),
  sessionSt VARCHAR(64),
  sessionEn VARCHAR(64),
  enRoute VARCHAR(64) ,
  exRoute VARCHAR(64) ,
  ipAddress VARCHAR(64),
  country VARCHAR(64),
  browser VARCHAR(64),
  device VARCHAR(64));