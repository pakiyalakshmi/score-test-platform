
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
  
  // For mobile devices, use tabs to save space
  const isMobileView = () => {
    return window.innerWidth < 768;
  };
  
  // If we're on mobile, render tabs interface
  if (isMobileView()) {
    return (
      <div className="w-full">
        <Tabs defaultValue="additional" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="additional" className="text-xs">History</TabsTrigger>
            <TabsTrigger value="past" className="text-xs">PMH</TabsTrigger>
            <TabsTrigger value="meds" className="text-xs">Meds</TabsTrigger>
            <TabsTrigger value="social" className="text-xs">Social</TabsTrigger>
          </TabsList>
          
          <TabsContent value="additional" className="mt-0">
            {additionalHistory && (
              <div className="glass-card p-3">
                <h3 className="font-medium mb-2 text-sm">Additional History</h3>
                <p className="text-xs text-gray-700 whitespace-pre-wrap">{additionalHistory}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-0">
            {pastMedicalHistory && (
              <div className="glass-card p-3">
                <h3 className="font-medium mb-2 text-sm">Past Medical History</h3>
                <ul className="text-xs text-gray-700 list-disc pl-5 space-y-1">
                  <li>Coronary Artery Disease w/o history of MI</li>
                  <li>Status post percutaneous coronary intervention with stent 3 years ago</li>
                  <li>Hypertension</li>
                  <li>Hypercholesterolemia</li>
                </ul>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="meds" className="mt-0">
            {medications && (
              <div className="glass-card p-3">
                <h3 className="font-medium mb-2 text-sm">Medications</h3>
                <ul className="text-xs text-gray-700 list-disc pl-5 space-y-1">
                  <li>Metoprolol</li>
                  <li>Atorvastatin</li>
                  <li>Aspirin</li>
                </ul>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="social" className="mt-0">
            {socialHistory && (
              <div className="glass-card p-3">
                <h3 className="font-medium mb-2 text-sm">Social History</h3>
                <p className="text-xs text-gray-700 whitespace-pre-wrap">{socialHistory}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  // For desktop view, show cards in grid layout
  return (
    <div className="space-y-3 w-full">
      {additionalHistory && (
        <div className="glass-card p-3">
          <h3 className="font-medium mb-2 text-sm">Additional History</h3>
          <p className="text-xs text-gray-700 whitespace-pre-wrap">{additionalHistory}</p>
        </div>
      )}
      
      {pastMedicalHistory && (
        <div className="glass-card p-3">
          <h3 className="font-medium mb-2 text-sm">Past Medical History</h3>
          <ul className="text-xs text-gray-700 list-disc pl-5 space-y-1">
            <li>Coronary Artery Disease w/o history of MI</li>
            <li>Status post percutaneous coronary intervention with stent 3 years ago</li>
            <li>Hypertension</li>
            <li>Hypercholesterolemia</li>
          </ul>
        </div>
      )}
      
      {medications && (
        <div className="glass-card p-3">
          <h3 className="font-medium mb-2 text-sm">Medications</h3>
          <ul className="text-xs text-gray-700 list-disc pl-5 space-y-1">
            <li>Metoprolol</li>
            <li>Atorvastatin</li>
            <li>Aspirin</li>
          </ul>
        </div>
      )}
      
      {socialHistory && (
        <div className="glass-card p-3">
          <h3 className="font-medium mb-2 text-sm">Social History</h3>
          <p className="text-xs text-gray-700 whitespace-pre-wrap">{socialHistory}</p>
        </div>
      )}
    </div>
  );
};

export default MedicalHistorySection;
