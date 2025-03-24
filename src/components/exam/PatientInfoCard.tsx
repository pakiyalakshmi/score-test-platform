
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
        
        <div className="flex flex-col md:flex-row gap-4">
          {patientInfo.imageUrl && (
            <div className="flex-shrink-0 rounded-lg overflow-hidden max-w-[160px]">
              <img 
                src={patientInfo.imageUrl} 
                alt={patientInfo.name} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
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
