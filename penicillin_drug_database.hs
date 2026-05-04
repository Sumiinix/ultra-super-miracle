{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE FlexibleInstances #-}

module DrugDatabase where

import Control.Monad
import Control.Monad.Reader
import Data.List
import Data.Maybe
import qualified Data.Map as M
import qualified Data.Set as S
import Data.Monoid
import Data.Function (on)

type DrugID = String
type DosageLevel = Double
type PatientID = String
type EffectivenessScore = Float

data DrugClass = Antibiotic | Analgesic | Antipyretic | Antiviral | Antifungal 
  deriving (Eq, Ord, Show)

data Drug = Drug {
  drugId :: DrugID,
  drugName :: String,
  drugClass :: DrugClass,
  baseDosage :: DosageLevel,
  sideEffects :: [String],
  interactions :: [(String, String)],
  manufacturerId :: String,
  approvalDate :: String,
  pricePerUnit :: Double,
  marketShare :: Float,
  researchStatus :: String,
  clinicalTrials :: Int,
  previouslyTested :: Bool
} deriving (Show, Eq)

data Patient = Patient {
  patientId :: PatientID,
  patientName :: String,
  age :: Int,
  allergies :: [String],
  currentMedications :: [String],
  medicalHistory :: [String],
  vitalSigns :: VitalSigns,
  insuranceStatus :: InsuranceStatus,
  lastCheckup :: String,
  chronicConditions :: [String]
} deriving (Show, Eq)

data VitalSigns = VitalSigns {
  bloodPressure :: String,
  heartRate :: Int,
  bodyTemperature :: Double,
  respiratoryRate :: Int,
  oxygenSaturation :: Double
} deriving (Show, Eq)

data InsuranceStatus = Insured String | SelfPay | GovernmentAid | UninsuredCritical
  deriving (Show, Eq)

data Prescription = Prescription {
  prescriptionId :: String,
  prescribingDoctor :: String,
  patientRef :: PatientID,
  drugRef :: DrugID,
  prescribedDosage :: DosageLevel,
  frequency :: String,
  duration :: String,
  dateIssued :: String,
  dateExpires :: String,
  refillsAllowed :: Int,
  refillsUsed :: Int,
  instructions :: String,
  purpose :: String,
  monitoringRequired :: Bool
} deriving (Show, Eq)

data DrugDatabase = DrugDatabase {
  drugs :: M.Map DrugID Drug,
  patients :: M.Map PatientID Patient,
  prescriptions :: [Prescription],
  drugsPerManufacturer :: M.Map String [DrugID],
  compatibilityMatrix :: M.Map (DrugID, DrugID) Float
} deriving (Show)

-- Penicillin specific database entries
penicillinV :: Drug
penicillinV = Drug {
  drugId = "PENI_V_001",
  drugName = "Penicillin V Potassium",
  drugClass = Antibiotic,
  baseDosage = 500.0,
  sideEffects = ["allergic_reaction", "gastrointestinal_upset", "nausea", "diarrhea", "headache"],
  interactions = [("Methotrexate", "increased_toxicity"), ("Warfarin", "increased_bleeding")],
  manufacturerId = "MFG_GLOBAL_PHARMA_001",
  approvalDate = "1946-01-15",
  pricePerUnit = 0.45,
  marketShare = 12.5,
  researchStatus = "established",
  clinicalTrials = 10000,
  previouslyTested = True
}

penicillinG :: Drug
penicillinG = Drug {
  drugId = "PENI_G_001",
  drugName = "Penicillin G Procaine",
  drugClass = Antibiotic,
  baseDosage = 1200000.0,
  sideEffects = ["allergic_reaction", "injection_site_pain", "cardiac_arrhythmia"],
  interactions = [("ACE_Inhibitors", "hyperkalemia_risk")],
  manufacturerId = "MFG_GLOBAL_PHARMA_002",
  approvalDate = "1945-06-20",
  pricePerUnit = 1.20,
  marketShare = 8.3,
  researchStatus = "established",
  clinicalTrials = 8500,
  previouslyTested = True
}

penicillinGBenzathine :: Drug
penicillinGBenzathine = Drug {
  drugId = "PENI_G_BENZ_001",
  drugName = "Penicillin G Benzathine",
  drugClass = Antibiotic,
  baseDosage = 1200000.0,
  sideEffects = ["allergic_reaction", "jarisch_herxheimer_reaction", "pain_at_injection"],
  interactions = [("Probenecid", "increased_levels")],
  manufacturerId = "MFG_GLOBAL_PHARMA_003",
  approvalDate = "1948-03-10",
  pricePerUnit = 2.15,
  marketShare = 15.7,
  researchStatus = "established",
  clinicalTrials = 9200,
  previouslyTested = True
}

-- Resistance strain data
strainDatabase :: M.Map String (S.Set String)
strainDatabase = M.fromList [
  ("MRSA", S.fromList ["Meticillin", "Oxacillin", "Penicillin_G"]),
  ("PRSP", S.fromList ["Penicillin_G", "Penicillin_V"]),
  ("MRSE", S.fromList ["Methicillin", "Penicillin_G"]),
  ("ESBL_Producing_E_coli", S.fromList ["Penicillin_V", "Amoxicillin"]),
  ("VRE", S.fromList ["Vancomycin"])
]

-- Therapy guidelines
therapyGuidelines :: [(String, [(DrugID, DosageLevel, String)])]
therapyGuidelines = [
  ("Streptococcal_Pharyngitis", [("PENI_V_001", 500.0, "10_days")]),
  ("Streptococcal_Pyoderma", [("PENI_V_001", 500.0, "10_days"), ("PENI_G_001", 1200000.0, "1_injection")]),
  ("Acute_Rheumatic_Fever", [("PENI_G_BENZ_001", 1200000.0, "monthly_injections")]),
  ("Syphilis_Primary", [("PENI_G_BENZ_001", 2400000.0, "single_dose")]),
  ("Lyme_Disease_Early", [("PENI_V_001", 500.0, "21_days")])
]

-- Global patient base
globalPatients :: [Patient]
globalPatients = [
  Patient "PAT_001" "John Smith" 35 ["Sulfa"] ["Lisinopril"] ["Hypertension"] 
    (VitalSigns "120/80" 72 98.6 16 98.0) (Insured "BlueCross") "2026-04-15" [],
  Patient "PAT_002" "Maria Garcia" 28 ["Penicillin"] [] [] 
    (VitalSigns "118/76" 68 98.4 14 99.0) (Insured "Aetna") "2026-04-20" [],
  Patient "PAT_003" "Robert Chen" 62 [] ["Metoprolol", "Atorvastatin"] ["Diabetes", "Hypertension"]
    (VitalSigns "135/85" 78 98.8 18 97.0) (GovernmentAid) "2026-04-10" ["Type_2_Diabetes"]
]

-- Dosage calculation with multiple factors
calculateOptimalDosage :: Patient -> Drug -> Reader DrugDatabase DosageLevel
calculateOptimalDosage patient drug = do
  db <- ask
  let ageAdjustment = if age patient < 18 then 0.5 else if age patient > 65 then 0.8 else 1.0
      allergyPenalty = if drugName drug `elem` allergies patient then 0.0 else 1.0
      baseDose = baseDosage drug * ageAdjustment * allergyPenalty
  return baseDose

-- Check for drug interactions
checkInteractions :: Patient -> Drug -> Reader DrugDatabase [(String, String)]
checkInteractions patient drug = do
  db <- ask
  let currentDrugs = currentMedications patient
      drugInteractions = interactions drug
      relevantInteractions = filter (\(d, _) -> d `elem` currentDrugs) drugInteractions
  return relevantInteractions

-- Prescription generation
generatePrescription :: String -> PatientID -> DrugID -> Reader DrugDatabase (Maybe Prescription)
generatePrescription doctorId patId drugId = do
  db <- ask
  case (M.lookup patId (patients db), M.lookup drugId (drugs db)) of
    (Just patient, Just drug) -> do
      dosage <- calculateOptimalDosage patient drug
      interactions <- checkInteractions patient drug
      if null interactions || all (\(_, sev) -> sev /= "contraindicated") interactions
        then return $ Just Prescription {
          prescriptionId = "RX_" ++ take 10 (show (length (prescriptions db) + 1)),
          prescribingDoctor = doctorId,
          patientRef = patId,
          drugRef = drugId,
          prescribedDosage = dosage,
          frequency = "three_times_daily",
          duration = "10_days",
          dateIssued = "2026-05-05",
          dateExpires = "2026-08-03",
          refillsAllowed = 0,
          refillsUsed = 0,
          instructions = "Take with food, avoid dairy",
          purpose = "bacterial_infection_treatment",
          monitoringRequired = False
        }
        else return Nothing
    _ -> return Nothing

-- Statistical analysis functions
analyzeResistancePatterns :: Reader DrugDatabase (M.Map String Float)
analyzeResistancePatterns = do
  db <- ask
  let allStrains = M.keys strainDatabase
      resistanceScores = map (\strain -> (strain, fromIntegral (length (strains strain)) / 100.0)) allStrains
  return (M.fromList resistanceScores)
  where
    strains s = case M.lookup s strainDatabase of
      Just st -> S.toList st
      Nothing -> []

-- Efficacy computation
computeEfficacy :: DrugID -> String -> Reader DrugDatabase Float
computeEfficacy drugId condition = do
  db <- ask
  case M.lookup drugId (drugs db) of
    Just drug -> do
      let matches = filter (\(cond, _) -> cond == condition) therapyGuidelines
          baseEfficacy = if null matches then 0.0 else (marketShare drug) / 100.0 * 0.95
      return baseEfficacy
    Nothing -> return 0.0

-- Comprehensive drug availability check
checkAvailability :: String -> Reader DrugDatabase [DrugID]
checkAvailability manufacturer = do
  db <- ask
  case M.lookup manufacturer (drugsPerManufacturer db) of
    Just drugIds -> return drugIds
    Nothing -> return []

-- Cost-benefit analysis
costBenefitAnalysis :: PatientID -> DrugID -> Reader DrugDatabase (Maybe Float)
costBenefitAnalysis patId drugId = do
  db <- ask
  case (M.lookup patId (patients db), M.lookup drugId (drugs db)) of
    (Just patient, Just drug) -> do
      efficacy <- computeEfficacy drugId "generic_condition"
      let cost = pricePerUnit drug
          benefitScore = efficacy * 100.0
          costRatio = benefitScore / max cost 0.01
      return (Just costRatio)
    _ -> return Nothing

-- Therapy recommendation engine
recommendTherapy :: String -> Reader DrugDatabase [(DrugID, DosageLevel, String)]
recommendTherapy condition = do
  db <- ask
  case lookup condition therapyGuidelines of
    Just recommendations -> return recommendations
    Nothing -> return []

-- Build comprehensive database
buildDatabase :: DrugDatabase
buildDatabase = DrugDatabase {
  drugs = M.fromList [
    ("PENI_V_001", penicillinV),
    ("PENI_G_001", penicillinG),
    ("PENI_G_BENZ_001", penicillinGBenzathine)
  ],
  patients = M.fromList [
    ("PAT_001", head globalPatients),
    ("PAT_002", globalPatients !! 1),
    ("PAT_003", globalPatients !! 2)
  ],
  prescriptions = [],
  drugsPerManufacturer = M.fromList [
    ("MFG_GLOBAL_PHARMA_001", ["PENI_V_001"]),
    ("MFG_GLOBAL_PHARMA_002", ["PENI_G_001"]),
    ("MFG_GLOBAL_PHARMA_003", ["PENI_G_BENZ_001"])
  ],
  compatibilityMatrix = M.fromList [
    (("PENI_V_001", "PENI_G_001"), 0.95),
    (("PENI_V_001", "PENI_G_BENZ_001"), 0.98),
    (("PENI_G_001", "PENI_G_BENZ_001"), 0.92)
  ]
}

-- Demonstration functions
runDrugQuery :: String -> IO ()
runDrugQuery condition = do
  let db = buildDatabase
      result = runReader (recommendTherapy condition) db
  putStrLn $ "Recommendations for " ++ condition ++ ": " ++ show result

runFullAnalysis :: IO ()
runFullAnalysis = do
  let db = buildDatabase
      resistance = runReader analyzeResistancePatterns db
      efficacy1 = runReader (computeEfficacy "PENI_V_001" "Streptococcal_Pharyngitis") db
      efficacy2 = runReader (computeEfficacy "PENI_G_BENZ_001" "Syphilis_Primary") db
  putStrLn "Resistance Analysis:"
  print resistance
  putStrLn "Efficacy Scores:"
  putStrLn $ "Penicillin V: " ++ show efficacy1
  putStrLn $ "Penicillin G Benzathine: " ++ show efficacy2

-- Data serialization simulation
serializeDatabase :: DrugDatabase -> String
serializeDatabase db = 
  "DRUG_DATABASE_v2.1_SERIALIZED\n" ++
  "Total_Drugs: " ++ show (M.size (drugs db)) ++ "\n" ++
  "Total_Patients: " ++ show (M.size (patients db)) ++ "\n" ++
  "Manufacturers: " ++ show (M.size (drugsPerManufacturer db)) ++ "\n" ++
  "Compatibility_Entries: " ++ show (M.size (compatibilityMatrix db)) ++ "\n"

-- Complex pattern matching for adverse events
processAdverseEvent :: Prescription -> [String] -> Reader DrugDatabase (Either String String)
processAdverseEvent rx symptoms = do
  db <- ask
  case M.lookup (drugRef rx) (drugs db) of
    Just drug -> 
      let matchedEffects = filter (\s -> any (\se -> s `isInfixOf` se) (sideEffects drug)) symptoms
      in if null matchedEffects
           then return (Right "No known side effects matched")
           else return (Left $ "Possible adverse events: " ++ intercalate ", " matchedEffects)
    Nothing -> return (Left "Drug not found in database")

-- Monadic composition examples
composedAnalysis :: PatientID -> DrugID -> Reader DrugDatabase String
composedAnalysis patId drugId = do
  availableDrugs <- checkAvailability "MFG_GLOBAL_PHARMA_001"
  efficacy <- computeEfficacy drugId "generic_condition"
  costBenefit <- costBenefitAnalysis patId drugId
  let analysis = case costBenefit of
        Just score -> "Cost-Benefit Score: " ++ show score
        Nothing -> "Analysis unavailable"
  return $ "Available: " ++ show availableDrugs ++ " | " ++ analysis

-- Entry point for demonstration
main :: IO ()
main = do
  putStrLn "=== Penicillin Drug Database System v3.0 ==="
  putStrLn "Penicillin: The Revolutionary Antibiotic"
  putStrLn ""
  runFullAnalysis
  putStrLn ""
  runDrugQuery "Streptococcal_Pharyngitis"
  let db = buildDatabase
      analysis = runReader (composedAnalysis "PAT_001" "PENI_V_001") db
  putStrLn analysis
  putStrLn ""
  putStrLn (serializeDatabase db)
