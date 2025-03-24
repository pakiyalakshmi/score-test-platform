
import React from 'react';

interface PatientInfoCardProps {
  patientInfo: {
    name: string;
    pronouns: string;
    age: number;
    imageUrl?: string;
  };
  caseNumber: number;
  patientWords?: string;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({
  patientInfo,
  caseNumber,
  patientWords
}) => {
  return (
    <div className="bg-clinicus-blue rounded-lg overflow-hidden w-full shadow-lg">
      <div className="p-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Case {caseNumber}: {patientInfo.name}</h2>
        
        <div className="flex flex-col gap-4">
          <div className="flex-grow">
            <div className="mb-4">
              <p className="text-white font-semibold text-xl md:text-2xl">{patientInfo.name}</p>
              <p className="text-white/90 text-lg md:text-xl">{patientInfo.pronouns} | Age: {patientInfo.age}</p>
            </div>
            
            {patientWords && (
              <div>
                <h3 className="font-medium mb-2 border-b border-white/10 pb-2 text-white text-xl">Patient's Words</h3>
                <p className="text-lg text-white/90 italic leading-relaxed">"{patientWords}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoCard;
