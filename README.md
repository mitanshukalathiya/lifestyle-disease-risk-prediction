# AI-Powered Cardiovascular Disease Risk Assessment Platform

An AI-powered web application that estimates cardiovascular disease risk using patient health and lifestyle information and provides personalized preventive recommendations.

The project combines a machine learning model, FastAPI backend, and modern Next.js frontend into a complete end-to-end AI application.

## Live Demo

🌐 **Web Application:**  
https://cvd-risk-prediction-eight.vercel.app/

🔗 **Backend API Documentation:**  
https://cardiovascular-risk-backend.onrender.com/docs

> Note: The backend is hosted on Render's free tier, so the first request after inactivity may take some time while the server wakes up.

---

## Overview

Cardiovascular diseases are among the major health risks worldwide. Early identification of potential risk factors can encourage people to take preventive measures and seek professional medical advice.

This project uses machine learning to analyze health and lifestyle parameters and estimate the likelihood of cardiovascular disease.

The application allows users to:

- Enter health and lifestyle information
- Get an AI-based cardiovascular risk prediction
- View the estimated risk level
- Understand important risk factors
- Receive personalized preventive recommendations
- Use the application directly through a responsive web interface

---

## Key Features

### 🧠 AI-Based Risk Prediction

Uses a trained machine learning classification model to estimate cardiovascular disease risk from patient information.

### 📊 Risk Assessment

The application converts the model's prediction into an easy-to-understand risk assessment.

### 💡 Personalized Recommendations

Based on the submitted health and lifestyle information, the system provides preventive recommendations related to areas such as:

- Physical activity
- Diet and nutrition
- Smoking
- Alcohol consumption
- Blood pressure
- Cholesterol
- Blood glucose
- Weight management

### 🌐 Full-Stack Web Application

The project includes:

- Modern frontend
- REST API backend
- Machine learning inference
- Production deployment

### 📱 Responsive UI

The interface is designed to work across desktop and mobile screen sizes.

### 🚀 Live Deployment

The application is deployed using:

- Vercel for the frontend
- Render for the backend API

---

## Machine Learning Pipeline

The project follows a standard industry ML workflow:

	1.	Data collection
	2.	Data cleaning and preprocessing
	3.	Exploratory Data Analysis (EDA)
	4.	Feature engineering (BMI calculation)
	5.	Train-test split
	6.	Model training
	7.	Model comparison
	8.	Hyperparameter tuning
	9.	Feature importance analysis
	10.	Risk interpretation and recommendation engine

---

## Models Tested

    - Logistic Regression
    - Random Forest
    - XGBoost

Best performing model: XGBoost

---

## Final Model Performance

	Accuracy: 71.34%
	Recall: 83.56%
	F1 Score: 74.17%

---

## Dataset

Dataset used: Cardiovascular Disease Dataset

Number of records: ~70,000 patients

Features include:

	•	Age
	•	Gender
	•	Height
	•	Weight
	•	Blood pressure
	•	Cholesterol level
	•	Glucose level
	•	Smoking habit
	•	Alcohol consumption
	•	Physical activity

Target variable: Cardio

	0 → No cardiovascular disease
	1 → Cardiovascular disease present