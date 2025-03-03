
import React from 'react';

interface MedicalHistorySectionProps {
  additionalHistory?: string;
  pastMedicalHistory?: string;
  medications?: string;
  socialHistory?: string;
}

const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({
  additionalHistory,
  pastMedicalHistory,
  medications,
  socialHistory
}) => {
  if (!additionalHistory && !pastMedicalHistory && !medications && !socialHistory) {
    return null;
  }
  
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {additionalHistory && (
        <div className="glass-card p-5">
          <h3 className="font-medium mb-3">Additional History</h3>
          <p className="text-sm text-gray-700">{additionalHistory}</p>
        </div>
      )}
      
      {(pastMedicalHistory || medications) && (
        <div className="glass-card p-5">
          <div className="grid grid-cols-2 gap-4">
            {pastMedicalHistory && (
              <div>
                <h3 className="font-medium mb-3">Past Medical History</h3>
                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                  <li>Coronary Artery Disease w/o history of MI</li>
                  <li>Status post percutaneous coronary intervention with stent 3 years ago</li>
                  <li>Hypertension</li>
                  <li>Hypercholesterolemia</li>
                </ul>
              </div>
            )}
            
            {medications && (
              <div>
                <h3 className="font-medium mb-3">Medications</h3>
                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                  <li>Metoprolol</li>
                  <li>Atorvastatin</li>
                  <li>Aspirin</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      {socialHistory && (
        <div className="glass-card p-5 md:col-span-2">
          <h3 className="font-medium mb-3">Social History</h3>
          <p className="text-sm text-gray-700">{socialHistory}</p>
        </div>
      )}
    </div>
  );
};

export default MedicalHistorySection;
