
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile on component mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  if (!additionalHistory && !pastMedicalHistory && !medications && !socialHistory) {
    return null;
  }
  
  // If we're on mobile, render tabs interface
  if (isMobile) {
    return (
      <div className="w-full">
        <Tabs defaultValue="additional" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="additional" className="text-xs">History</TabsTrigger>
            <TabsTrigger value="past" className="text-xs">PMH</TabsTrigger>
            <TabsTrigger value="meds" className="text-xs">Meds</TabsTrigger>
            <TabsTrigger value="social" className="text-xs">Social</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[250px]">
            <TabsContent value="additional" className="mt-0">
              {additionalHistory && (
                <div className="glass-card p-4">
                  <h3 className="font-medium mb-2 text-lg text-clinicus-blue">Additional History</h3>
                  <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">{additionalHistory}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="mt-0">
              {pastMedicalHistory && (
                <div className="glass-card p-4">
                  <h3 className="font-medium mb-2 text-lg text-clinicus-blue">Past Medical History</h3>
                  <ul className="text-base text-gray-700 list-disc pl-5 space-y-2 leading-relaxed">
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
                <div className="glass-card p-4">
                  <h3 className="font-medium mb-2 text-lg text-clinicus-blue">Medications</h3>
                  <ul className="text-base text-gray-700 list-disc pl-5 space-y-2 leading-relaxed">
                    <li>Metoprolol</li>
                    <li>Atorvastatin</li>
                    <li>Aspirin</li>
                  </ul>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="social" className="mt-0">
              {socialHistory && (
                <div className="glass-card p-4">
                  <h3 className="font-medium mb-2 text-lg text-clinicus-blue">Social History</h3>
                  <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">{socialHistory}</p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    );
  }
  
  // For desktop view, show Additional History first, then other cards in a scrollable area
  return (
    <div className="space-y-4 w-full">
      {additionalHistory && (
        <div className="glass-card p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-200">
          <h3 className="font-medium mb-3 text-lg text-clinicus-blue">Additional History</h3>
          <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">{additionalHistory}</p>
        </div>
      )}
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-clinicus-blue">Medical Information</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pt-0 pb-4">
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-4">
              {pastMedicalHistory && (
                <div className="glass-card p-4 shadow-md border border-gray-200">
                  <h3 className="font-medium mb-3 text-lg text-clinicus-blue">Past Medical History</h3>
                  <ul className="text-base text-gray-700 list-disc pl-5 space-y-2 leading-relaxed">
                    <li>Coronary Artery Disease w/o history of MI</li>
                    <li>Status post percutaneous coronary intervention with stent 3 years ago</li>
                    <li>Hypertension</li>
                    <li>Hypercholesterolemia</li>
                  </ul>
                </div>
              )}
              
              {medications && (
                <div className="glass-card p-4 shadow-md border border-gray-200">
                  <h3 className="font-medium mb-3 text-lg text-clinicus-blue">Medications</h3>
                  <ul className="text-base text-gray-700 list-disc pl-5 space-y-2 leading-relaxed">
                    <li>Metoprolol</li>
                    <li>Atorvastatin</li>
                    <li>Aspirin</li>
                  </ul>
                </div>
              )}
              
              {socialHistory && (
                <div className="glass-card p-4 shadow-md border border-gray-200">
                  <h3 className="font-medium mb-3 text-lg text-clinicus-blue">Social History</h3>
                  <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">{socialHistory}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalHistorySection;
