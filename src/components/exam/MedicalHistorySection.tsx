
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

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
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {additionalHistory && (
          <div className="glass-card p-4">
            <h3 className="font-medium mb-2 text-sm md:text-base">Additional History</h3>
            <p className="text-xs md:text-sm text-gray-700">{additionalHistory}</p>
          </div>
        )}
        
        {pastMedicalHistory && (
          <div className="glass-card p-4">
            <h3 className="font-medium mb-2 text-sm md:text-base">Past Medical History</h3>
            <ul className="text-xs md:text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>Coronary Artery Disease w/o history of MI</li>
              <li>Status post percutaneous coronary intervention with stent 3 years ago</li>
              <li>Hypertension</li>
              <li>Hypercholesterolemia</li>
            </ul>
          </div>
        )}
        
        {medications && (
          <div className="glass-card p-4">
            <h3 className="font-medium mb-2 text-sm md:text-base">Medications</h3>
            <ul className="text-xs md:text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>Metoprolol</li>
              <li>Atorvastatin</li>
              <li>Aspirin</li>
            </ul>
          </div>
        )}
        
        {socialHistory && (
          <div className="glass-card p-4">
            <h3 className="font-medium mb-2 text-sm md:text-base">Social History</h3>
            <p className="text-xs md:text-sm text-gray-700">{socialHistory}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistorySection;
