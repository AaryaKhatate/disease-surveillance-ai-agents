-- Disease Surveillance AI Agent System - Sample Data
-- Inserts realistic test data for development and testing

USE [YourDatabaseName];
GO

PRINT 'Inserting sample data...';
PRINT '';

-- =============================================
-- Sample Hospital Surveillance Data
-- =============================================
PRINT 'Inserting hospital surveillance data...';

INSERT INTO hospital_surveillance_data (timestamp, location, region, symptom_type, patient_count, age_group, severity_level, diagnosis)
VALUES
    -- Mumbai region - Recent flu-like outbreak
    (DATEADD(hour, -2, GETDATE()), 'Lilavati Hospital', 'Mumbai', 'fever', 45, '18-45', 'moderate', 'Influenza A'),
    (DATEADD(hour, -2, GETDATE()), 'Lilavati Hospital', 'Mumbai', 'cough', 38, '18-45', 'mild', 'Upper Respiratory Infection'),
    (DATEADD(hour, -3, GETDATE()), 'JJ Hospital', 'Mumbai', 'fever', 52, '45-65', 'moderate', 'Influenza A'),
    (DATEADD(hour, -4, GETDATE()), 'KEM Hospital', 'Mumbai', 'respiratory_distress', 12, '65+', 'severe', 'Pneumonia'),
    (DATEADD(day, -1, GETDATE()), 'Breach Candy Hospital', 'Mumbai', 'fever', 28, '0-18', 'mild', 'Viral Fever'),
    (DATEADD(day, -1, GETDATE()), 'Hinduja Hospital', 'Mumbai', 'cough', 33, '18-45', 'mild', 'Bronchitis'),
    
    -- Delhi region - Dengue cases
    (DATEADD(hour, -1, GETDATE()), 'AIIMS Delhi', 'Delhi', 'fever', 23, '18-45', 'high', 'Dengue Fever'),
    (DATEADD(hour, -2, GETDATE()), 'Max Hospital', 'Delhi', 'fever', 18, '18-45', 'high', 'Dengue Fever'),
    (DATEADD(hour, -3, GETDATE()), 'Safdarjung Hospital', 'Delhi', 'rash', 15, '0-18', 'moderate', 'Dengue Fever'),
    (DATEADD(day, -1, GETDATE()), 'Apollo Hospital', 'Delhi', 'fever', 27, '45-65', 'high', 'Dengue Fever'),
    
    -- Bangalore region - Normal surveillance
    (DATEADD(hour, -1, GETDATE()), 'Manipal Hospital', 'Bangalore', 'fever', 8, '18-45', 'mild', 'Common Cold'),
    (DATEADD(hour, -2, GETDATE()), 'Apollo Hospitals', 'Bangalore', 'cough', 12, '45-65', 'mild', 'Seasonal Allergy'),
    (DATEADD(day, -1, GETDATE()), 'Fortis Hospital', 'Bangalore', 'fever', 6, '0-18', 'mild', 'Viral Infection'),
    
    -- Historical data (1 week ago)
    (DATEADD(day, -7, GETDATE()), 'Lilavati Hospital', 'Mumbai', 'fever', 15, '18-45', 'mild', 'Viral Fever'),
    (DATEADD(day, -7, GETDATE()), 'AIIMS Delhi', 'Delhi', 'fever', 10, '18-45', 'moderate', 'Unknown'),
    (DATEADD(day, -7, GETDATE()), 'Manipal Hospital', 'Bangalore', 'cough', 7, '45-65', 'mild', 'Bronchitis');

PRINT '✓ Inserted ' + CAST(@@ROWCOUNT AS VARCHAR) + ' hospital records';
GO

-- =============================================
-- Sample Social Media Surveillance Data
-- =============================================
PRINT 'Inserting social media surveillance data...';

INSERT INTO social_media_surveillance_data (timestamp, location, region, platform, mention_count, symptom_keywords, sentiment_score, post_content)
VALUES
    (DATEADD(hour, -1, GETDATE()), 'Mumbai', 'Mumbai', 'Twitter', 247, 'fever,flu,sick', -0.65, 'Many people in Andheri area reporting fever and flu symptoms #MumbaiHealth'),
    (DATEADD(hour, -2, GETDATE()), 'Mumbai', 'Mumbai', 'Facebook', 189, 'cough,cold,sick', -0.52, 'Local clinics seeing surge in respiratory cases'),
    (DATEADD(hour, -3, GETDATE()), 'Mumbai', 'Mumbai', 'Instagram', 145, 'fever,headache', -0.48, 'Feeling unwell, lots of people around me are sick too'),
    (DATEADD(day, -1, GETDATE()), 'Mumbai', 'Mumbai', 'Twitter', 312, 'flu,hospital,emergency', -0.78, 'Hospitals in Mumbai reporting increased ER visits for flu-like symptoms'),
    
    (DATEADD(hour, -1, GETDATE()), 'Delhi', 'Delhi', 'Twitter', 198, 'dengue,fever,mosquito', -0.72, 'Dengue cases rising in South Delhi, be careful! #DengueAlert'),
    (DATEADD(hour, -2, GETDATE()), 'Delhi', 'Delhi', 'Facebook', 156, 'fever,dengue,rash', -0.68, 'My neighbor just tested positive for dengue, everyone stay safe'),
    (DATEADD(day, -1, GETDATE()), 'Delhi', 'Delhi', 'Twitter', 234, 'dengue,outbreak,warning', -0.85, 'Dengue outbreak confirmed in multiple Delhi localities'),
    
    (DATEADD(hour, -1, GETDATE()), 'Bangalore', 'Bangalore', 'Twitter', 45, 'allergy,pollen,sneeze', -0.25, 'Pollen levels high in Bangalore this week'),
    (DATEADD(day, -1, GETDATE()), 'Bangalore', 'Bangalore', 'Facebook', 38, 'cold,cough', -0.30, 'Weather changing, lots of people catching cold'),
    
    (DATEADD(day, -7, GETDATE()), 'Mumbai', 'Mumbai', 'Twitter', 87, 'fever,sick', -0.35, 'Some flu cases in the area'),
    (DATEADD(day, -7, GETDATE()), 'Delhi', 'Delhi', 'Twitter', 62, 'fever', -0.40, 'Not feeling well today');

PRINT '✓ Inserted ' + CAST(@@ROWCOUNT AS VARCHAR) + ' social media records';
GO

-- =============================================
-- Sample Environmental Surveillance Data
-- =============================================
PRINT 'Inserting environmental surveillance data...';

INSERT INTO environmental_surveillance_data (timestamp, location, region, air_quality_index, water_quality_index, temperature, humidity, pollution_level)
VALUES
    (DATEADD(hour, -1, GETDATE()), 'Dadar', 'Mumbai', 156, 8.2, 32.5, 78, 'moderate'),
    (DATEADD(hour, -2, GETDATE()), 'Bandra', 'Mumbai', 148, 8.4, 31.8, 76, 'moderate'),
    (DATEADD(hour, -3, GETDATE()), 'Andheri', 'Mumbai', 162, 8.1, 33.2, 79, 'unhealthy_sensitive'),
    (DATEADD(day, -1, GETDATE()), 'Colaba', 'Mumbai', 135, 8.6, 30.5, 75, 'moderate'),
    
    (DATEADD(hour, -1, GETDATE()), 'Connaught Place', 'Delhi', 189, 7.8, 28.5, 65, 'unhealthy'),
    (DATEADD(hour, -2, GETDATE()), 'Dwarka', 'Delhi', 195, 7.6, 29.2, 68, 'unhealthy'),
    (DATEADD(hour, -3, GETDATE()), 'Rohini', 'Delhi', 178, 7.9, 27.8, 62, 'unhealthy_sensitive'),
    (DATEADD(day, -1, GETDATE()), 'Saket', 'Delhi', 202, 7.5, 30.1, 70, 'unhealthy'),
    
    (DATEADD(hour, -1, GETDATE()), 'Koramangala', 'Bangalore', 92, 8.8, 26.5, 68, 'moderate'),
    (DATEADD(hour, -2, GETDATE()), 'Whitefield', 'Bangalore', 88, 8.9, 25.8, 65, 'moderate'),
    (DATEADD(hour, -3, GETDATE()), 'Indiranagar', 'Bangalore', 95, 8.7, 27.2, 70, 'moderate'),
    (DATEADD(day, -1, GETDATE()), 'JP Nagar', 'Bangalore', 82, 9.0, 24.5, 62, 'good'),
    
    (DATEADD(day, -7, GETDATE()), 'Dadar', 'Mumbai', 142, 8.3, 31.0, 74, 'moderate'),
    (DATEADD(day, -7, GETDATE()), 'Connaught Place', 'Delhi', 175, 7.8, 29.5, 66, 'unhealthy_sensitive'),
    (DATEADD(day, -7, GETDATE()), 'Koramangala', 'Bangalore', 85, 8.8, 25.0, 64, 'moderate');

PRINT '✓ Inserted ' + CAST(@@ROWCOUNT AS VARCHAR) + ' environmental records';
GO

-- =============================================
-- Sample Pharmacy Surveillance Data
-- =============================================
PRINT 'Inserting pharmacy surveillance data...';

INSERT INTO pharmacy_surveillance_data (timestamp, location, region, medication_name, medication_category, prescription_count, is_otc)
VALUES
    -- Mumbai - Increased flu medication sales
    (DATEADD(hour, -1, GETDATE()), 'Apollo Pharmacy - Andheri', 'Mumbai', 'Paracetamol', 'antipyretic', 128, 1),
    (DATEADD(hour, -1, GETDATE()), 'Apollo Pharmacy - Andheri', 'Mumbai', 'Cetirizine', 'antihistamine', 87, 1),
    (DATEADD(hour, -2, GETDATE()), 'MedPlus - Dadar', 'Mumbai', 'Azithromycin', 'antibiotic', 45, 0),
    (DATEADD(hour, -2, GETDATE()), 'MedPlus - Dadar', 'Mumbai', 'Cough Syrup', 'antitussive', 76, 1),
    (DATEADD(hour, -3, GETDATE()), 'Netmeds - Bandra', 'Mumbai', 'Paracetamol', 'antipyretic', 142, 1),
    (DATEADD(day, -1, GETDATE()), 'PharmEasy - Colaba', 'Mumbai', 'Ibuprofen', 'antipyretic', 95, 1),
    
    -- Delhi - Dengue medication surge
    (DATEADD(hour, -1, GETDATE()), 'Apollo Pharmacy - CP', 'Delhi', 'Paracetamol', 'antipyretic', 156, 1),
    (DATEADD(hour, -1, GETDATE()), 'Apollo Pharmacy - CP', 'Delhi', 'ORS', 'rehydration', 89, 1),
    (DATEADD(hour, -2, GETDATE()), 'MedPlus - Dwarka', 'Delhi', 'Doxycycline', 'antibiotic', 34, 0),
    (DATEADD(hour, -2, GETDATE()), 'MedPlus - Dwarka', 'Delhi', 'Platelet Support', 'supplement', 67, 1),
    (DATEADD(day, -1, GETDATE()), 'Netmeds - Saket', 'Delhi', 'Paracetamol', 'antipyretic', 178, 1),
    
    -- Bangalore - Normal patterns
    (DATEADD(hour, -1, GETDATE()), 'Apollo Pharmacy - Koramangala', 'Bangalore', 'Cetirizine', 'antihistamine', 45, 1),
    (DATEADD(hour, -2, GETDATE()), 'MedPlus - Whitefield', 'Bangalore', 'Paracetamol', 'antipyretic', 52, 1),
    (DATEADD(day, -1, GETDATE()), 'Netmeds - Indiranagar', 'Bangalore', 'Cough Syrup', 'antitussive', 38, 1),
    
    -- Historical baseline (1 week ago)
    (DATEADD(day, -7, GETDATE()), 'Apollo Pharmacy - Andheri', 'Mumbai', 'Paracetamol', 'antipyretic', 48, 1),
    (DATEADD(day, -7, GETDATE()), 'Apollo Pharmacy - CP', 'Delhi', 'Paracetamol', 'antipyretic', 52, 1),
    (DATEADD(day, -7, GETDATE()), 'Apollo Pharmacy - Koramangala', 'Bangalore', 'Cetirizine', 'antihistamine', 35, 1);

PRINT '✓ Inserted ' + CAST(@@ROWCOUNT AS VARCHAR) + ' pharmacy records';
GO

-- =============================================
-- Sample Anomaly Detections
-- =============================================
PRINT 'Inserting anomaly detections...';

INSERT INTO anomaly_detections (timestamp, region, anomaly_type, severity, confidence, data_source, baseline_value, current_value, deviation_percent, detection_method, anomaly_json)
VALUES
    (DATEADD(hour, -1, GETDATE()), 'Mumbai', 'spike', 'high', 0.87, 'hospital', 15.0, 45.0, 200.0, 'statistical', 
     '{"symptom": "fever", "location": "Lilavati Hospital", "threshold_exceeded": true}'),
    
    (DATEADD(hour, -1, GETDATE()), 'Mumbai', 'spike', 'medium', 0.76, 'social_media', 87.0, 247.0, 184.0, 'ml_model',
     '{"platform": "Twitter", "keywords": ["fever", "flu"], "sentiment_drop": true}'),
    
    (DATEADD(hour, -2, GETDATE()), 'Mumbai', 'spike', 'high', 0.82, 'pharmacy', 48.0, 128.0, 167.0, 'statistical',
     '{"medication": "Paracetamol", "pharmacy_chain": "Apollo", "unusual_demand": true}'),
    
    (DATEADD(hour, -1, GETDATE()), 'Delhi', 'spike', 'critical', 0.92, 'hospital', 10.0, 23.0, 130.0, 'statistical',
     '{"symptom": "dengue fever", "hospital": "AIIMS Delhi", "outbreak_indicator": true}'),
    
    (DATEADD(hour, -1, GETDATE()), 'Delhi', 'spike', 'high', 0.85, 'social_media', 62.0, 198.0, 219.0, 'ml_model',
     '{"platform": "Twitter", "keywords": ["dengue", "fever"], "viral_spread": true}'),
    
    (DATEADD(hour, -2, GETDATE()), 'Delhi', 'environmental', 'medium', 0.71, 'environmental', 175.0, 202.0, 15.4, 'temporal',
     '{"metric": "air_quality_index", "location": "Saket", "health_risk": "elevated"}');

PRINT '✓ Inserted ' + CAST(@@ROWCOUNT AS VARCHAR) + ' anomaly detections';
GO

-- =============================================
-- Sample Outbreak Predictions
-- =============================================
PRINT 'Inserting outbreak predictions...';

INSERT INTO outbreak_predictions (disease_name, region, forecast_weeks, predicted_cases, confidence, risk_level, model_used, prediction_json)
VALUES
    ('Influenza A', 'Mumbai', 2, 850, 0.78, 'high', 'SEIR',
     '{"r0": 2.3, "current_cases": 245, "growth_rate": 0.15, "intervention_impact": "low", "peak_week": 1}'),
    
    ('Influenza A', 'Mumbai', 4, 1200, 0.72, 'medium', 'SEIR',
     '{"r0": 2.3, "current_cases": 245, "growth_rate": 0.12, "intervention_impact": "medium", "peak_week": 2}'),
    
    ('Dengue Fever', 'Delhi', 2, 420, 0.85, 'critical', 'SEIR',
     '{"r0": 2.8, "current_cases": 156, "growth_rate": 0.22, "intervention_impact": "low", "peak_week": 1, "mosquito_density": "high"}'),
    
    ('Dengue Fever', 'Delhi', 4, 680, 0.79, 'high', 'SEIR',
     '{"r0": 2.8, "current_cases": 156, "growth_rate": 0.18, "intervention_impact": "medium", "peak_week": 2, "mosquito_density": "high"}'),
    
    ('Seasonal Flu', 'Bangalore', 2, 85, 0.65, 'low', 'SEIR',
     '{"r0": 1.4, "current_cases": 45, "growth_rate": 0.08, "intervention_impact": "low", "peak_week": 3}');

PRINT '✓ Inserted ' + CAST(@@ROWCOUNT AS VARCHAR) + ' outbreak predictions';
GO

-- =============================================
-- Sample Surveillance Alerts
-- =============================================
PRINT 'Inserting surveillance alerts...';

INSERT INTO surveillance_alerts (alert_id, alert_type, severity, region, disease_name, message, audience, status, alert_json)
VALUES
    ('ALERT-MUM-' + CONVERT(VARCHAR, GETDATE(), 112) + '-001', 'outbreak_warning', 'high', 'Mumbai', 'Influenza A',
     'Significant increase in flu-like symptoms detected across Mumbai hospitals. 200% spike in fever cases reported.',
     'health_officials,healthcare_providers', 'active',
     '{"affected_areas": ["Andheri", "Dadar", "Bandra"], "cases": 245, "trend": "rising", "recommendations": ["increase_surveillance", "prepare_resources"]}'),
    
    ('ALERT-DEL-' + CONVERT(VARCHAR, GETDATE(), 112) + '-001', 'outbreak_warning', 'critical', 'Delhi', 'Dengue Fever',
     'CRITICAL: Dengue outbreak confirmed in South Delhi. 130% increase in confirmed cases over baseline.',
     'health_officials,healthcare_providers,public', 'active',
     '{"affected_areas": ["Saket", "Dwarka", "Rohini"], "cases": 156, "trend": "rapidly_rising", "mosquito_control": "urgent", "recommendations": ["vector_control", "public_awareness", "hospital_preparedness"]}'),
    
    ('ALERT-MUM-' + CONVERT(VARCHAR, GETDATE(), 112) + '-002', 'resource_alert', 'medium', 'Mumbai', 'Influenza A',
     'Increased demand for antipyretic medications detected. Pharmacies reporting 167% increase in Paracetamol sales.',
     'health_officials,healthcare_providers', 'active',
     '{"medication": "Paracetamol", "supply_status": "adequate", "trend": "increasing_demand", "recommendations": ["monitor_stock"]}');

PRINT '✓ Inserted ' + CAST(@@ROWCOUNT AS VARCHAR) + ' surveillance alerts';
GO

-- =============================================
-- Sample Chat Session
-- =============================================
PRINT 'Inserting sample chat session...';

INSERT INTO chat_sessions (session_id, conversation_id, user_id, start_time, last_activity, status, session_data)
VALUES
    ('SESSION-' + CONVERT(VARCHAR, GETDATE(), 112) + '-001', 
     'CONV-' + CONVERT(VARCHAR, GETDATE(), 112) + '-001',
     'admin',
     DATEADD(hour, -1, GETDATE()),
     GETDATE(),
     'active',
     '{"user_query": "Analyze current disease surveillance status for Mumbai", "agents_involved": ["DATA_COLLECTION", "ANOMALY_DETECTION", "PREDICTION"], "alerts_generated": 1}');

PRINT '✓ Inserted ' + CAST(@@ROWCOUNT AS VARCHAR) + ' chat session';
GO

PRINT '';
PRINT '========================================';
PRINT '✓ All Sample Data Inserted Successfully!';
PRINT '========================================';
PRINT '';
PRINT 'Data Summary:';
PRINT '- Hospital records: 16 entries';
PRINT '- Social media records: 11 entries';
PRINT '- Environmental records: 15 entries';
PRINT '- Pharmacy records: 17 entries';
PRINT '- Anomaly detections: 6 entries';
PRINT '- Outbreak predictions: 5 entries';
PRINT '- Surveillance alerts: 3 entries';
PRINT '- Chat sessions: 1 entry';
PRINT '';
PRINT 'Sample scenarios included:';
PRINT '✓ Mumbai: Influenza A outbreak (high severity)';
PRINT '✓ Delhi: Dengue fever outbreak (critical severity)';
PRINT '✓ Bangalore: Normal surveillance patterns (low risk)';
GO
