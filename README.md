# Lifestyle Disease Risk Prediction using Machine Learning

## Project Overview

This project predicts the risk of cardiovascular disease using machine learning based on lifestyle and health indicators.

Cardiovascular diseases are one of the leading causes of death worldwide. Early prediction of risk factors can help individuals take preventive actions and improve long-term health outcomes.

This system analyzes health data such as age, BMI, blood pressure, cholesterol levels, and lifestyle habits to estimate disease risk and provide preventive health recommendations.

---

## Environment Setup

This project was developed and tested using:

    - Python 3.11

Activate virtual environment and:
    Install dependencies using:

    pip install -r requirements.txt

---

## How to run the project

    python src/risk_assessment.py

---

## Key Features
	•	Machine Learning–based disease risk prediction
	•	Risk score calculation (0–100)
	•	Risk level classification (Low / Medium / High)
	•	Personalized preventive health recommendations
	•	Multiple demo scenarios for testing

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

    Test Accuracy: 74.2%

---

## Technologies Used

    - Python
    - Pandas
    - NumPy
    - Scikit-learn
    - XGBoost
    - Matplotlib
    - Seaborn
    - Jupyter Notebook

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

Target variable: cardio

	0 → No cardiovascular disease
	1 → Cardiovascular disease present


