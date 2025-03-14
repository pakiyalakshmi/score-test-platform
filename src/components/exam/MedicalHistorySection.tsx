
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {additionalHistory && (
          <div className="glass-card p-5">
            <h3 className="font-medium mb-3">Additional History</h3>
            <p className="text-sm text-gray-700">{additionalHistory}</p>
          </div>
        )}
        
        {pastMedicalHistory && (
          <div className="glass-card p-5">
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
          <div className="glass-card p-5">
            <h3 className="font-medium mb-3">Medications</h3>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>Metoprolol</li>
              <li>Atorvastatin</li>
              <li>Aspirin</li>
            </ul>
          </div>
        )}
        
        {socialHistory && (
          <div className="glass-card p-5">
            <h3 className="font-medium mb-3">Social History</h3>
            <p className="text-sm text-gray-700">{socialHistory}</p>
          </div>
        )}
      </div>
      
      {/* Table for Question 1 */}
      <div className="glass-card p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pertinent Positive/ Negative</TableHead>
              <TableHead>Diagnosis it relates to</TableHead>
              <TableHead>Is the Diagnosis More or Less Likely</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MedicalHistorySection;
