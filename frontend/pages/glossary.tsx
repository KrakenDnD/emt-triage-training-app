import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';


export default function Glossary() {
  const navigation = useNavigation<any>();
  const handleBackPress = () => {
  try {
    navigation.goBack();
  } catch (error) {
    console.error('Navigation error:', error);
  }
};
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a365d', '#2c5282', '#3182ce']}
        style={styles.gradient}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => handleBackPress()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>EMT Glossary</Text>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
          <View style={styles.tableContainer}>
            {/* A Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>A</Text>
            </View>
            
            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>ABCDEs</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Primary survey framework: Airway, Breathing, Circulation, Disability, Exposure - used to systematically assess critically ill or injured patients</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>AED</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Automated External Defibrillator - A portable device that analyzes heart rhythm and delivers electric shocks to restore normal heart rhythm during cardiac arrest</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Alveoli</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Small air sacs in the lungs where oxygen and carbon dioxide exchange occurs</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Anaphylaxis</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A severe, life-threatening allergic reaction requiring immediate treatment with epinephrine</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Arteries</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Blood vessels that carry oxygenated blood away from the heart to the body</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Asthma</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A respiratory condition causing bronchospasms, airway narrowing, edema, and mucus obstruction in response to allergens or irritants</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>AVPU Scale</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A method to assess level of consciousness: Alert, Voice responsive, Pain responsive, Unresponsive</Text>
              </View>
            </View>

            {/* B Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>B</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Bariatric Patient</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A patient who is obese or morbidly obese, typically weighing 300+ pounds, requiring special equipment and handling</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Barotrauma</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Injury caused by excessive pressure, particularly to the lungs during ventilation</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>BLS</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Basic Life Support - A set of standardized procedures EMTs use to provide emergency care, including CPR, airway management, and bleeding control</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Bronchi</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Large airways that branch from the trachea into the lungs</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Bronchioles</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Small airways that branch from the bronchi</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>BSI</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Bloodstream Infections - Dangerous infections EMTs prevent through proper hand hygiene, aseptic technique, and infection control practices</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>BVM</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Bag-Valve-Mask - A hand-operated device used to provide positive pressure ventilation to patients who are not breathing adequately</Text>
              </View>
            </View>

            {/* C Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>C</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Capillaries</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Tiny blood vessels connecting arteries and veins where oxygen, nutrients, and waste exchange occurs</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Capillary Refill Time</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A test to assess circulation by squeezing a fingertip and observing how quickly color returns (normal is under 2-3 seconds)</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Cardiac Arrest</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Complete cessation of heart function</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Cardiovascular System</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The body system consisting of the heart, arteries, veins, and capillaries that circulates blood throughout the body</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Central Nervous System (CNS)</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The brain and spinal cord, which control body functions and process information</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Cervix</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The lower, narrow end of the uterus that dilates during childbirth</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>CHF</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Congestive Heart Failure - A condition where the heart cannot pump blood effectively, often causing fluid buildup</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>COPD</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Chronic Obstructive Pulmonary Disease - A group of lung diseases including emphysema and chronic bronchitis that cause prolonged airway obstruction</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>CPAP</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Continuous Positive Airway Pressure - A machine that delivers continuous air pressure to keep airways open, commonly used for sleep apnea</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>CPR</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Cardiopulmonary Resuscitation - Emergency procedure involving chest compressions and rescue breaths to maintain circulation and breathing</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Crepitus</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The sound or sensation of bone fragments rubbing together, indicating a fracture</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Cushing's Triad</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Three signs of increased intracranial pressure: hypertension, bradycardia, and irregular breathing</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Cyanosis</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A bluish discoloration of the skin indicating lack of oxygen</Text>
              </View>
            </View>

            {/* D Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>D</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Defibrillation</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Delivering controlled electric shocks to restore normal heart rhythm</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Dermis</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The middle layer of skin containing sweat glands, oil glands, and hair follicles</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Diabetes Insipidus</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A condition causing excess production of dilute urine due to lack of vasopressin</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Diabetic Ketoacidosis (DKA)</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A serious diabetic emergency characterized by high blood sugar, dehydration, and acid buildup</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Diaphragm</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The primary muscle of respiration that separates the chest from the abdomen</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Dislocation</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>When bones become displaced from their normal position at a joint</Text>
              </View>
            </View>

            {/* E Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>E</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Eclampsia</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A pregnancy complication involving seizures, following preeclampsia</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Ectopic Pregnancy</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>When a fertilized egg implants outside the uterus, typically in the fallopian tube</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>EMR</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Emergency Medical Responder - A basic level of emergency medical provider</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>EMT</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Emergency Medical Technician - A trained healthcare professional who provides basic life support and emergency medical care</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>EMS</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Emergency Medical Services - The system providing emergency medical care and transport</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Endocrine System</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The body system of glands that produce hormones regulating various body functions</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Epidermis</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The outermost layer of skin providing a waterproof barrier</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Epinephrine (Epipen)</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A medication (auto-injector) used to treat severe allergic reactions and anaphylaxis</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Express Consent</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Verbal or written permission given by an alert, competent patient for treatment</Text>
              </View>
            </View>

            {/* F Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>F</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Fallopian Tubes</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Tubes connecting the ovaries to the uterus where fertilization typically occurs</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Femur</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The thighbone; fractures can cause significant blood loss</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Fetus</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The developing baby after 8 weeks of gestation</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Flail Chest</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>When multiple rib fractures cause a section of chest wall to move paradoxically</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Fracture</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A broken bone, classified as open or closed</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Fundus</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The top portion of the uterus, used to estimate gestational age</Text>
              </View>
            </View>

            {/* G Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>G</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Gastric Insufflation</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Air entering the stomach during ventilation, which can cause vomiting</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Gestation</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The period of pregnancy, measured from the last menstrual period</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Glasgow Coma Scale (GCS)</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A scoring system to assess level of consciousness based on eye, verbal, and motor responses</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Greenstick Fracture</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>An incomplete fracture on one side of the bone, common in children</Text>
              </View>
            </View>

            {/* H Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>H</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>HEPA</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>High-Efficiency Particulate Air - A type of mask/filter used to prevent inhalation of airborne infectious diseases</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Hemorrhage</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Severe bleeding</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>HIPAA</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Health Insurance Portability and Accountability Act - Federal law protecting patient privacy and medical information</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Homeostasis</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The body's ability to maintain stable internal conditions despite external changes</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Hypodermis</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The bottom fatty layer of skin that provides insulation</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Hypothermia</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Abnormally low body temperature (below 95°F/35°C)</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Hypoxia</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Insufficient oxygen in the tissues</Text>
              </View>
            </View>

            {/* I Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>I</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Implied Consent</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Legal assumption that an unconscious or incapacitated person would consent to life-saving treatment</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Incident Command</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The organizational structure for managing emergency incidents</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Informed Consent</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A patient's right to receive information and make decisions about their medical care</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Integumentary System</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The body system consisting of skin, hair, nails, and glands</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Intracranial Pressure</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Pressure inside the skull; when elevated, can indicate serious brain injury</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Intubation</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Placing a tube in the trachea to maintain an airway</Text>
              </View>
            </View>

            {/* J Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>J</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Jaw Thrust</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A method to open the airway without moving the neck, used when spinal injury is suspected</Text>
              </View>
            </View>

            {/* L Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>L</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Larynx</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The voice box, located in the upper airway</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Ligaments</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Bands of tissue connecting bones to other bones at joints</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Lower Respiratory Tract</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The trachea, bronchi, and lungs</Text>
              </View>
            </View>

            {/* M Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>M</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>MCI</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Mass Casualty Incident - An emergency event with multiple casualties requiring special triage and resource management</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>MDI</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Metered Dose Inhaler - A device that delivers medication in aerosol form, commonly used for asthma</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Mechanism of Injury</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The forces or circumstances that caused an injury</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Meningitis</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Severe infection of the tissues surrounding the brain and spinal cord</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Musculoskeletal System</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The body system of bones, muscles, cartilage, ligaments, tendons, and joints</Text>
              </View>
            </View>

            {/* N Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>N</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Naloxone (Narcan)</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A medication that reverses opioid overdose by blocking opioid receptors</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Nasal Cannula</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A lightweight oxygen delivery device with prongs that fit inside the nostrils</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Nasopharyngeal Airway (NPA)</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A hollow tube inserted through the nose to maintain an airway</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Nervous System</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The body system controlling voluntary and involuntary functions through electrical signals</Text>
              </View>
            </View>

            {/* O Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>O</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Oropharyngeal Airway (OPA)</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A curved device inserted in the mouth to keep the tongue from blocking the airway in unconscious patients</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>OPQRST</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A mnemonic for assessing pain: Onset, Provocation/Palliation, Quality, Region/Radiation, Severity, Time</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Ovaries</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Female reproductive organs that produce eggs and hormones</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Oxygen Saturation</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The percentage of hemoglobin carrying oxygen, measured by pulse oximetry (normal 95-100%)</Text>
              </View>
            </View>

            {/* P Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>P</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Patent Airway</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>An open, unobstructed airway</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>PEEP</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Positive End Expiratory Pressure - Pressure maintained in the airways at the end of exhalation to improve oxygenation</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Perfusion</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Blood flow delivering oxygen and nutrients to tissues</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Peripheral Nervous System (PNS)</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Network of nerves branching from the spinal cord to the body</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Placenta</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The organ attaching to the uterine wall that provides oxygen and nutrients to the fetus</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Placenta Previa</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A condition where the placenta covers the cervix, causing painless bleeding</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Pneumonia</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Infection of the lungs causing inflammation and fluid accumulation in alveoli</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Pneumothorax</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Collapsed lung due to air in the pleural space</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Polypharmacy</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The use of multiple medications, common in elderly patients and increasing risk of interactions</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>PPE</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Personal Protective Equipment - Protective gear including gloves, masks, gowns, and eye protection used to prevent infection</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Preeclampsia</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Pregnancy complication with high blood pressure, swelling, and protein in urine after 20 weeks gestation</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Primary Survey</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Initial rapid assessment focusing on life-threatening conditions using ABCDEs</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Pulse Oximetry</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Non-invasive method to measure oxygen saturation in the blood</Text>
              </View>
            </View>

            {/* R Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>R</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Radial Pulse</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Pulse felt at the wrist; its presence indicates adequate blood pressure</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Recovery Position</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Positioning a patient on their side to protect the airway and prevent aspiration</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Respiratory Rate</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The number of breaths per minute (normal adult: 12-18)</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>RPM</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>START triage mnemonic: Respirations, Perfusion, Mental Status</Text>
              </View>
            </View>

            {/* S Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>S</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>SAMPLE</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Patient history mnemonic: Signs/Symptoms, Allergies, Medications, Past medical history, Last oral intake, Events leading to illness/injury</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Scene Safety</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Assessing and ensuring the emergency scene is safe before providing care</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Seizure</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Abnormal electrical activity in the brain causing physical manifestations</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Shock</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Critical condition from inadequate blood flow and oxygen delivery to organs</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Spinal Motion Restriction</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Techniques to minimize spinal movement in trauma patients</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Sprain</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Injury involving stretching or tearing of ligaments</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>START</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Simple Triage and Rapid Treatment - A triage system for mass casualty incidents using RPM assessment</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Status Epilepticus</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Prolonged seizures lasting over 15 minutes or repeated seizures without regaining consciousness</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Strain</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Injury involving stretching or tearing of muscles or tendons</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Stroke</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Disruption of blood flow to the brain, either from blockage (ischemic) or bleeding (hemorrhagic)</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Subcutaneous</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Beneath the skin</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Supine Hypotension Syndrome</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Low blood pressure in pregnant women when lying flat due to compression of the inferior vena cava</Text>
              </View>
            </View>

            {/* T Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>T</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Tendons</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Cords of tissue connecting muscles to bones</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Tension Pneumothorax</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Life-threatening condition where air accumulates in the pleural space, completely collapsing the lung</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Tourniquet</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A constricting band applied to an extremity to stop severe arterial bleeding</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Trachea</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The windpipe; the main airway from the larynx to the bronchi</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Triage</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The process of determining treatment priority based on severity of illness or injury</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Trimester</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>A three-month period of pregnancy (first: 0-13 weeks, second: 14-26 weeks, third: 27-40 weeks)</Text>
              </View>
            </View>

            {/* U Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>U</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Upper Respiratory Tract</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The nose, nasal cavity, mouth, sinuses, pharynx, and larynx</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Urethra</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The tube that carries urine from the bladder out of the body</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Uterus</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The hollow, pear-shaped organ that holds the fetus during pregnancy</Text>
              </View>
            </View>

            {/* V Section */}
            <View style={styles.letterHeader}>
              <Text style={styles.letterText}>V</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Veins</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Blood vessels that return deoxygenated blood to the heart</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Venous</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Relating to veins</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Ventilation</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>The process of moving air in and out of the lungs</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.wordText}>Vital Signs</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.definitionText}>Measurable indicators of body function including heart rate, blood pressure, respiratory rate, temperature, and oxygen saturation</Text>
              </View>
            </View>
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        <Text style={styles.footer}>Developed by CodeBlue Collective</Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  tableContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  letterHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  letterText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  leftColumn: {
    flex: 1,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  rightColumn: {
    flex: 2,
    padding: 16,
  },
  wordText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  definitionText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  spacer: {
    height: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
});